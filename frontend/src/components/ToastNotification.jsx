import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastNotification() {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-purple-400" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl glass-panel border border-purple-500/40 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
      {icons[toast.type] || icons.success}
      <span className="text-xs font-semibold text-white">{toast.message}</span>
    </div>
  );
}
