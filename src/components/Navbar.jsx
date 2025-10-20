import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/add", label: "Add Mood" },
    { to: "/journal", label: "Journal" }
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white px-6 sm:px-8 py-5 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-gray-100"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3"
      >
        {/* <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div> */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Mood Journal
        </h1>
      </motion.div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link 
              to={item.to} 
              className="relative px-6 py-3 rounded-xl font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 group"
            >
              <span className="relative z-10">{item.label}</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile Hamburger Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 group"
        aria-label="Toggle menu"
      >
        <motion.div
          animate={{ rotate: isMenuOpen ? 180 : 0 }}
          className="w-6 h-6 flex flex-col justify-center items-center"
        >
          <motion.span
            animate={{ 
              rotate: isMenuOpen ? 45 : 0,
              y: isMenuOpen ? 6 : 0,
              width: isMenuOpen ? 24 : 16
            }}
            className="h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
          />
          <motion.span
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            className="h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full my-1.5 w-20 transition-all duration-300"
          />
          <motion.span
            animate={{ 
              rotate: isMenuOpen ? -45 : 0,
              y: isMenuOpen ? -6 : 0,
              width: isMenuOpen ? 24 : 12
            }}
            className="h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
          />
        </motion.div>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden border-l border-gray-200"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Menu
                    </h2>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="space-y-3 flex-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 hover:from-purple-500/15 hover:to-pink-500/15 transition-all duration-300 font-semibold text-gray-700 hover:text-gray-900 group border border-gray-100 hover:border-purple-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">{item.label}</span>
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6 border-t border-gray-200"
                >
                  <p className="text-sm text-gray-500 text-center font-medium">
                    Track your emotions with voice input
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}