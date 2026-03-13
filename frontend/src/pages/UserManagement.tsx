import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { UserPlus, Shield, Trash2 } from 'lucide-react';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users', { username, password, role });
            setUsername(''); setPassword(''); setRole('USER');
            setShowForm(false);
            loadUsers();
        } catch (e) { alert("Erro ao cadastrar usuário"); }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Remover acesso deste usuário?")) {
            await api.delete(`/users/${id}`);
            loadUsers();
        }
    };

    return (
        <div className="space-y-8 text-left">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Gestão de Acessos</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-4 tracking-tight">Controle de credenciais industriais</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all hover:scale-105 text-xs uppercase tracking-widest"
                >
                    <UserPlus size={16} /> {showForm ? 'Fechar' : 'Novo Acesso'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top duration-300">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Usuário</label>
                        <input 
                            className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                            placeholder="ex: joao.vendas" value={username} onChange={e => setUsername(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Senha</label>
                        <input 
                            type="password"
                            className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                            placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Perfil</label>
                        <select 
                            className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                            value={role} onChange={e => setRole(e.target.value)}
                        >
                            <option value="ADMIN">ADMIN (Total)</option>
                            <option value="DIRETORIA">DIRETORIA (Relatórios)</option>
                            <option value="VENDAS">VENDAS (Comercial)</option>
                            <option value="PRODUCAO">PRODUÇÃO (Fábrica)</option>
                            <option value="FATURAMENTO">FATURAMENTO (Fiscal)</option>
                        </select>
                    </div>
                    <button className="md:col-span-3 py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg text-xs">Ativar Credencial</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(u => (
                    <div key={u.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 ${u.role === 'ROLE_ADMIN' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-50 text-slate-400'} rounded-2xl flex items-center justify-center`}>
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 uppercase leading-none tracking-tight">{u.username}</h4>
                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full mt-2 inline-block">{u.role.replace('ROLE_', '')}</span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(u.id)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
