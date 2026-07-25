import React, { useContext } from 'react';
import AppContext from '../../services/AppContext';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContainer = () => {
  const { state, removeToast } = useContext(AppContext);

  if (!state.toasts || state.toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {state.toasts.map((toast) => {
        let bgClass = 'bg-slate-900 text-white border-slate-700';
        let icon = <FiInfo className="text-blue-400 text-xl flex-shrink-0" />;

        if (toast.type === 'success') {
          bgClass = 'bg-emerald-900/95 text-emerald-50 border-emerald-700/60 shadow-emerald-950/20';
          icon = <FiCheckCircle className="text-emerald-400 text-xl flex-shrink-0" />;
        } else if (toast.type === 'error') {
          bgClass = 'bg-rose-900/95 text-rose-50 border-rose-700/60 shadow-rose-950/20';
          icon = <FiAlertCircle className="text-rose-400 text-xl flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          bgClass = 'bg-amber-900/95 text-amber-50 border-amber-700/60 shadow-amber-950/20';
          icon = <FiAlertCircle className="text-amber-400 text-xl flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up ${bgClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="font-semibold text-sm leading-tight">{toast.title}</h5>}
              {toast.message && <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up {
          animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
