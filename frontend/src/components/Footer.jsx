import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky bottom-0 z-20 bg-gray-900 bg-opacity-80 border-t border-gray-700"
      style={{
        backdropFilter: 'blur(10px)',
        fontFamily: 'monospace',
        boxShadow: '0px -5px 20px rgba(252, 211, 77, 0.5)'
      }}
    >
      <div className="w-full px-8 py-4">
        <div className="flex justify-start items-center h-full">
          <p className="text-yellow-300 font-semibold text-sm">
            Algorithm Athletes, Spurhacks 2025 LLC
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 