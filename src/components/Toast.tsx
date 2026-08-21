import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-xs">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="pointer-events-auto px-4 py-2.5 rounded-full backdrop-blur-xl border border-white/15 bg-[#0a0a0a]/95 text-[#d4d4d4] shadow-2xl flex items-center gap-3"
          >
            <span className="text-[#8e7d5d] font-serif italic text-sm">
              {toast.type === 'pink' ? '✦' : toast.type === 'info' ? '★' : '✓'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-serif italic text-white leading-tight">{toast.title}</p>
              {toast.description && (
                <p className="text-[10px] text-white/50 truncate font-light">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/40 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

