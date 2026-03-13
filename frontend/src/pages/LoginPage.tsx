import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, Eye, EyeOff, Building2 } from 'lucide-react';

const LoginPage: React.FC = () => {
    const initialTenant = window.location.hostname.split('.')[0] !== 'localhost'
        ? window.location.hostname.split('.')[0]
        : localStorage.getItem('tenantSlug') || '';
    const [tenantSlug, setTenantSlug] = useState(initialTenant);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { tenantSlug, username, password });
            const { token, role, tenantSlug: resolvedTenantSlug, tenantName } = response.data;
            if (token) {
                login(token, role || 'ROLE_ADMIN', resolvedTenantSlug || tenantSlug, tenantName);
                setTimeout(() => navigate('/', { replace: true }), 100);
            }
        } catch (err: any) {
            setError('Credenciais inválidas ou servidor offline.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6 font-sans">
            <div className="max-w-[440px] w-full bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden p-12 border border-slate-100">
                <div className="text-center mb-10">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                        <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Acesso ao Sistema</h1>
                    <p className="text-slate-400 mt-2 text-sm font-medium">Recauchutagem ERP Industrial</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl text-xs font-bold border border-rose-100 text-center animate-pulse">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tenant</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                            <input
                                type="text"
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-slate-700"
                                placeholder="empresa-cliente"
                                value={tenantSlug}
                                onChange={e => setTenantSlug(e.target.value.toLowerCase())}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-slate-700"
                                placeholder="Seu usuário"
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="w-full pl-12 pr-14 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-slate-700"
                                placeholder="Sua senha"
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 p-2 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 mt-4 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
                    </button>
                </form>
                
                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Versão Estável 2.0 • 2026</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
