
"use client";

import Link from 'next/link';


const Footer = () => {
    return (
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Chisachon Cloud Mining</h3>
              <p className="text-gray-400 text-sm">
              We are one of the leading cryptocurrency mining platforms, offering cryptocurrency mining capacities in every range - for newcomers. Our mission is to make acquiring cryptocurrencies easy and fast for everyone.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-2">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm">support@chisachon.cloud</li>
                <li className="text-gray-400 text-sm">+1 (201) 426-5221</li>
              </ul>
            </div>

            {/* address */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-2">Address</h4>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm">Street:  942 Pennsylvania Avenue</li>
                <li className="text-gray-400 text-sm">City:  Woodbridge</li>
                <li className="text-gray-400 text-sm">State:   New Jersey</li>
                <li className="text-gray-400 text-sm">Zip code:  07095</li>
                <li className="text-gray-400 text-sm">Country:  United States</li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-2">Legal</h4>
              <ul className="space-y-2">
                <li className="text-gray-100 text-sm">
                  <a href="/TOS" className="text-gray-400 hover:text-blue-400 text-sm">
                    Terms of Service
                  </a>
                </li>
                <li className="text-gray-100 text-sm">
                  <a href="/privacypolicy" className="text-gray-400 hover:text-blue-400 text-sm">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Chisachon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

export default Footer;