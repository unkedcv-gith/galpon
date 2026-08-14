import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, User, Sparkles } from 'lucide-react';
import { setAdminAuthenticated } from '../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === 'galpon2026') {
      setAdminAuthenticated(true);
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Usuario o contraseña incorrectos. Podés usar "Acceso Rápido Demo".');
    }
  };

  const handleQuickDemoAccess = () => {
    setAdminAuthenticated(true);
    setError('');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-black/60 backdrop-blur-md border-2 border-[#1EB8BF] rounded-3xl w-full max-w-md overflow-hidden shadow-[8px_8px_0px_0px_#1EB8BF]">
        
        <div className="p-6 bg-zinc-950/60 border-b-2 border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-heading font-black text-lg uppercase">
            <Shield className="w-5 h-5 text-[#A3BA13]" />
            <span>Ingreso al Espacio Admin</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-zinc-300 font-medium">
            Ingresá tus credenciales de administración para definir, revisar y aprobar los turnos reservados.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1EB8BF]" /> Usuario Admin
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:border-[#1EB8BF] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#ED3078]" /> Contraseña
              </label>
              <input
                type="password"
                required
                placeholder="galpon2026"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:border-[#ED3078] focus:outline-none"
              />
            </div>

            {error && (
              <div className="text-xs text-[#ED3078] font-bold bg-zinc-950 p-3 rounded-xl border-2 border-[#ED3078]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1EB8BF] hover:bg-[#19a1a7] text-black font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-[3px_3px_0px_0px_#F2C700] transition-all"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="pt-3 border-t-2 border-zinc-800 text-center space-y-2">
            <p className="text-[11px] font-bold text-zinc-400">Credenciales por defecto: <code className="text-[#1EB8BF]">admin</code> / <code className="text-[#ED3078]">galpon2026</code></p>
            
            <button
              onClick={handleQuickDemoAccess}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white border-2 border-[#A3BA13] font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-[#F2C700]" />
              <span>Acceso Rápido Directo Demo</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

