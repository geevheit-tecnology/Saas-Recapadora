import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2, Tag } from 'lucide-react';

const PriceTable: React.FC = () => {
    const [prices, setPrices] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    
    const [tireSize, setTireSize] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => { loadPrices(); }, []);

    const loadPrices = async () => {
        const res = await api.get('/service-prices');
        setPrices(res.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/service-prices', { tireSize, serviceName, price });
            setTireSize(''); setServiceName(''); setPrice('');
            setShowForm(false);
            loadPrices();
        } catch (e) { alert("Erro ao salvar preço"); }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Excluir este preço?")) {
            await api.delete(`/service-prices/${id}`);
            loadPrices();
        }
    };

    return (
        <div className="space-y-8 text-left">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Tabela de Preços</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-4 tracking-tight">Configuração comercial estratégica</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105 uppercase text-xs tracking-widest"
                >
                    <Plus size={16} /> {showForm ? 'Fechar' : 'Novo Preço'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top duration-300">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Medida do Pneu</label>
                        <input 
                            className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                            placeholder="Ex: 295/80 R22.5" value={tireSize} onChange={e => setTireSize(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Serviço</label>
                        <input 
                            className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                            placeholder="Ex: Recapagem" value={serviceName} onChange={e => setServiceName(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Valor (R$)</label>
                        <input 
                            className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold text-emerald-600"
                            type="number" step="0.01" placeholder="0,00" value={price} onChange={e => setPrice(e.target.value)} required 
                        />
                    </div>
                    <button className="md:col-span-3 py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest shadow-lg text-xs">Salvar na Tabela</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prices.map(p => (
                    <div key={p.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-blue-200 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(p.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={18} /></button>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                <Tag size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 uppercase leading-none tracking-tight">{p.serviceName}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{p.tireSize}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mt-8 border-t border-slate-50 pt-6">
                            <div className="text-slate-200 font-black text-2xl italic opacity-30 font-mono">PRICE</div>
                            <div className="text-3xl font-black text-emerald-600 tracking-tighter font-mono">
                                R$ {parseFloat(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                ))}
                {prices.length === 0 && (
                    <div className="md:col-span-3 py-32 text-center text-slate-300 italic font-black uppercase tracking-widest text-xs opacity-50">
                        Nenhum parâmetro de preço configurado
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceTable;
