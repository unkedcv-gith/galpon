import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, User, Sparkles, Building2, Crown, Store } from 'lucide-react';
import { setCurrentUser, getAppUsers } from '../services/storage';
import { AppUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
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
    const cleanUser = username.trim().toLowerCase();
    const allUsers = getAppUsers();

    // Check credentials matching
    const matched = allUsers.find(
      (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser
    );

    if (matched) {
      // Validate passwords
      let isValidPass = false;
      if (matched.role === 'superadmin' && (password === 'superadmin2026' || password === 'superadmin')) isValidPass = true;
      else if (matched.role === 'admin' && (password === 'admin2026' || password === 'galpon2026' || password === 'admin')) isValidPass = true;
      else if (matched.role === 'franquista' && (password === matched.username || password === 'franquicia5' || password === 'franquicia13')) isValidPass = true;
      else if (password === 'galpon2026') isValidPass = true;

      if (isValidPass) {
        setCurrentUser(matched);
        setError('');
        onSuccess(matched);
        onClose();
        return;
      }
    }

    // Default fallback check
    if (cleanUser === 'admin' && (password === 'galpon2026' || password === 'admin2026')) {
      const defaultAdmin: AppUser = allUsers.find(u => u.role === 'admin') || {
        uid: 'user_admin',
        email: 'admin@elgalpon.com',
        username: 'admin',
        displayName: 'Dueño General (Admin)',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(defaultAdmin);
      setError('');
      onSuccess(defaultAdmin);
      onClose();
      return;
    }

    if (cleanUser === 'superadmin' && password === 'superadmin2026') {
      const defaultSuper: AppUser = allUsers.find(u => u.role === 'superadmin') || {
        uid: 'user_superadmin',
        email: 'superadmin@elgalpon.com',
        username: 'superadmin',
        displayName: 'SuperAdmin Dev',
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(defaultSuper);
      setError('');
      onSuccess(defaultSuper);
      onClose();
      return;
    }

    setError('Credenciales incorrectas. Puedes usar los accesos directos por rol abajo.');
  };

  const handleQuickRoleAccess = (role: 'superadmin' | 'admin' | 'franquista5' | 'franquista13') => {
    const allUsers = getAppUsers();
    let selectedUser: AppUser | undefined;

    if (role === 'superadmin') {
      selectedUser = allUsers.find(u => u.role === 'superadmin');
    } else if (role === 'admin') {
      selectedUser = allUsers.find(u => u.role === 'admin');
    } else if (role === 'franquista5') {
      selectedUser = allUsers.find(u => u.assignedBranchId === 'calle-5');
    } else if (role === 'franquista13') {
      selectedUser = allUsers.find(u => u.assignedBranchId === 'calle-13');
    }

    if (selectedUser) {
      setCurrentUser(selectedUser);
      setError('');
      onSuccess(selectedUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-black/90 backdrop-blur-md border-2 border-[#1EB8BF] rounded-3xl w-full max-w-lg overflow-hidden shadow-[8px_8px_0px_0px_#1EB8BF]">
        
        {/* Header */}
        <div className="p-6 bg-zinc-950/80 border-b-2 border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white font-heading font-black text-lg uppercase">
            <Shield className="w-5 h-5 text-[#A3BA13]" />
            <span>Ingreso al Panel Administrativo</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-zinc-300 font-medium">
            Acceso con sistema de roles para SuperAdmin (Desarrollador), Admin (Dueño de negocio) y Franquistas de cada sucursal.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1EB8BF]" /> Usuario o Email
              </label>
              <input
                type="text"
                required
                placeholder="superadmin / admin / franquicia5 / franquicia13"
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
                placeholder="••••••••"
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
              className="w-full bg-[#1EB8BF] hover:bg-[#19a1a7] text-black font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-[3px_3px_0px_0px_#F2C700] transition-all cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Quick Role Selectors for testing and instant access */}
          <div className="pt-4 border-t-2 border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">
                Accesos Directos por Rol (Demo)
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#F2C700]" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRoleAccess('superadmin')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border-2 border-[#ED3078] text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-[#ED3078]" />
                  <span className="text-[11px] font-black text-white uppercase block">SuperAdmin</span>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Control Total & Sucursales</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleAccess('admin')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border-2 border-[#F2C700] text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#F2C700]" />
                  <span className="text-[11px] font-black text-white uppercase block">Admin Dueño</span>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Todas las Sucursales</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleAccess('franquista5')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border-2 border-[#1EB8BF] text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#1EB8BF]" />
                  <span className="text-[11px] font-black text-white uppercase block">Franquista C5</span>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Solo Calle 5</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleAccess('franquista13')}
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border-2 border-[#A3BA13] text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#A3BA13]" />
                  <span className="text-[11px] font-black text-white uppercase block">Franquista C13</span>
                </div>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Solo Calle 13</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
