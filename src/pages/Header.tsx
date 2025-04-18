import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'}`}>
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <div className="relative w-32 h-8">
              <Image
                src="/logo.png" // Pastikan file logo.png ada di folder public
                alt="Logo"
                fill
                sizes="(max-width: 600px) 100vw, 32px" // Menambahkan properti sizes
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  </header>
  

  )
}

export default Header
