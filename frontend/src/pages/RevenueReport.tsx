import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const RevenueReport: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Sênior: URL absoluta para depurar se o proxy falhar
            console.log("Solicitando faturamento mensal...");
            const res = await api.get('/reports/revenue/monthly');
            console.log("Resposta financeira recebida:", res.data);
            
            const rawData = Array.isArray(res.data) ? res.data : [];
            const formattedData = rawData.map((item: any) => {
                // Suporte a múltiplas variações de chaves do banco (Postgres/H2/Hibernate)
                const total = item.total ?? item.TOTAL ?? item.sum ?? item.SUM ?? 0;
                const month = item.month ?? item.MONTH ?? 'S/D';
                return {
                    month: String(month),
                    total: parseFloat(total.toString())
                };
            });
            setData(formattedData);
        } catch (err: any) {
            console.error("ERRO CRÍTICO FINANCEIRO:", err);
            setError("O servidor financeiro está inacessível. Certifique-se de que existem ordens com status 'COMPLETED'.");
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);

    if (error) return (
        <div className="p-20 bg-white rounded-[3rem] shadow-sm border border-rose-100 text-center space-y-6 max-w-2xl mx-auto mt-10">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-500">
                <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Falha de Comunicação</h3>
            <p className="text-slate-500 font-medium leading-relaxed uppercase text-[10px] tracking-[0.2em]">{error}</p>
            <button onClick={loadData} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">TENTAR RECONEXÃO</button>
        </div>
    );

    return (
        <div className="space-y-10 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Relatório de Faturamento</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-emerald-500 underline-offset-8 mt-2 uppercase text-[10px] tracking-widest">Auditoria Financeira em Tempo Real</p>
                </div>
                <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white text-right w-full md:w-auto shadow-2xl shadow-emerald-100">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Caixa Acumulado Bruto</p>
                    <p className="text-4xl font-black tracking-tighter font-mono">
                        R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="h-[450px] flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse bg-white rounded-[3rem] border border-slate-100 shadow-sm italic">Sincronizando Livros Fiscais...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 h-[500px] flex flex-col">
                        <div className="flex items-center gap-3 mb-10">
                            <TrendingUp className="text-emerald-500 w-6 h-6" />
                            <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-[10px]">Histórico de Performance Mensal</h3>
                        </div>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 10}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 10}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc'}}
                                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'black', padding: '20px'}}
                                        formatter={(val: any) => [`R$ ${val.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'RECEITA']}
                                    />
                                    <Bar dataKey="total" radius={[12, 12, 0, 0]} barSize={50}>
                                        {data.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#10b981' : '#3b82f6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[500px]">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] text-left">Resumo Consolidado</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-50">
                                    {data.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-[10px] shadow-inner uppercase">
                                                        {item.month.substring(0, 2)}
                                                    </div>
                                                    <span className="font-black text-slate-700 tracking-tighter uppercase text-sm">{item.month}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Entrada</p>
                                                <p className="font-black text-slate-900 tracking-tighter text-base">
                                                    R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="px-8 py-32 text-center">
                                                <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest leading-relaxed">Aguardando dados industriais<br/>para auditoria fiscal</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevenueReport;
