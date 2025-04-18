import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('/herobg.png')] bg-cover bg-center bg-no-repeat bg-gray-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-left m-9 bg-green-50 bg-clip-text text-5xl font-extrabold text-transparent leading-tight">
          Start Ethereum Cloud Mining Today
          </h1>
          <p className="text-lg text-left sm:text-xl text-white mb-8 max-w-xl m-8">
            Experience hassle-free crypto mining with our advanced cloud mining solutions. 
            Mine cryptocurrencies without hardware investment - secure, efficient, and profitable.
          </p>
        </div>
        {/* Image Container */}
        <div className="md:w-1/2 relative">
          <div className="relative overflow-visible">
            <motion.img
              src="/hero.png"
              alt="Hero Image"
              className="w-full max-w-sm h-auto object-cover"
              animate={{ opacity: [0, 1, 0], y: [20, 0, 20] }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};


export default HeroSection;