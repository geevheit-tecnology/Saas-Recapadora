import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Truck, Plus } from 'lucide-react';

const SupplierList: React.FC = () => {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => { loadSuppliers(); }, []);

    const loadSuppliers = async () => {
        const res = await api.get('/suppliers');
        setSuppliers(res.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/suppliers', { name, cnpj, category });
            setName(''); setCnpj(''); setCategory('');
            setShowForm(false);
            loadSuppliers();
        } catch (e) { alert("Erro ao salvar fornecedor"); }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Fornecedores</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-4">Parceiros de Matéria-prima</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" /> {showForm ? 'Fechar' : 'Novo Fornecedor'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top duration-300">
                    <input 
                        className="p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                        placeholder="Nome Fantasia" value={name} onChange={e => setName(e.target.value)} required 
                    />
                    <input 
                        className="p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                        placeholder="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value)} 
                    />
                    <input 
                        className="p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                        placeholder="Categoria (ex: Borrachas)" value={category} onChange={e => setCategory(e.target.value)} 
                    />
                    <button className="md:col-span-3 py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest">Cadastrar Fornecedor</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map(s => (
                    <div key={s.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 text-left">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                            <Truck className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 uppercase leading-none mb-1">{s.name}</h4>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{s.category || 'Geral'}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-2">{s.cnpj || 'CNPJ não informado'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupplierList;
