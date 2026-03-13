import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Truck, Factory, Target, Search, BarChart3, Tag, Package, Users, ClipboardList, LogOut, ShieldCheck } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { logout, role } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allMenuItems = [
        { path: '/', label: 'Painel Geral', icon: <LayoutDashboard size={18} />, roles: ['ROLE_ADMIN', 'ROLE_DIRETORIA'] },
        { path: '/collection', label: 'Coleta / Logística', icon: <Truck size={18} />, roles: ['ROLE_ADMIN', 'ROLE_VENDAS'] },
        { path: '/production', label: 'Fluxo de Fábrica', icon: <Factory size={18} />, roles: ['ROLE_ADMIN', 'ROLE_PRODUCAO'] },
        { path: '/sales', label: 'Monitor de Vendas', icon: <Target size={18} />, roles: ['ROLE_ADMIN', 'ROLE_VENDAS'] },
        { path: '/locator', label: 'Localizar Pneu', icon: <Search size={18} />, roles: ['ROLE_ADMIN', 'ROLE_PRODUCAO', 'ROLE_VENDAS'] },
        { path: '/revenue', label: 'Financeiro', icon: <BarChart3 size={18} />, roles: ['ROLE_ADMIN', 'ROLE_DIRETORIA', 'ROLE_FATURAMENTO'] },
        { path: '/prices', label: 'Tabela de Preços', icon: <Tag size={18} />, roles: ['ROLE_ADMIN', 'ROLE_FATURAMENTO'] },
        { path: '/inventory', label: 'Estoque de Insumos', icon: <Package size={18} />, roles: ['ROLE_ADMIN', 'ROLE_FATURAMENTO'] },
        { path: '/clients', label: 'Base de Clientes', icon: <Users size={18} />, roles: ['ROLE_ADMIN', 'ROLE_VENDAS'] },
        { path: '/orders', label: 'Histórico de Ordens', icon: <ClipboardList size={18} />, roles: ['ROLE_ADMIN', 'ROLE_VENDAS', 'ROLE_FATURAMENTO'] },
        { path: '/users', label: 'Controle de Acesso', icon: <ShieldCheck size={18} />, roles: ['ROLE_ADMIN'] },
    ];

    const currentRole = role || 'ROLE_ADMIN'; 
    const filteredMenu = allMenuItems.filter(item => item.roles.includes(currentRole));

    return (
        <div className="flex h-screen bg-[#F1F5F9] font-sans">
            {/* Sidebar Grafite Profundo (Slate-900) */}
            <aside className="w-72 bg-[#0F172A] text-white flex flex-col z-20 shadow-2xl">
                <div className="p-8 flex items-center gap-3 border-b border-white/5 bg-[#1E293B]/30">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-900/20 text-xl">R</div>
                    <h1 className="text-lg font-black tracking-tighter uppercase leading-none text-white">Recauchutagem<br/><span className="text-blue-400 text-[9px] font-black tracking-[0.3em]">Sistemas ERP</span></h1>
                </div>
                
                <nav className="flex-1 mt-8 px-4 space-y-1 overflow-y-auto">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 ml-4 opacity-50 text-left">Navegação Principal</p>
                    {filteredMenu.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 font-bold'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm tracking-tight">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 bg-[#1E293B]/20 border-t border-white/5">
                    <div className="bg-[#1E293B] p-5 rounded-[2rem] flex items-center justify-between border border-white/5 shadow-inner">
                        <div className="text-left">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Identidade Ativa</p>
                            <p className="text-xs font-black text-blue-400 uppercase tracking-tighter">{currentRole.replace('ROLE_', '')}</p>
                        </div>
                        <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-rose-400 transition-colors bg-white/5 rounded-xl hover:bg-white/10">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Soft Gray */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 relative z-10">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                        {allMenuItems.find(i => i.path === location.pathname)?.label || 'Console Industrial'}
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-left">
                            <div className="hidden md:block">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">Sessão Operacional</p>
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Monitorado</p>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                                <ShieldCheck size={22} className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </header>
                
                <div className="flex-1 overflow-auto p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
