import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Users, ClipboardList, Wallet, TrendingUp, Package, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => { loadStats(); }, []);

    const loadStats = async () => {
        try {
            const res = await api.get('/dashboard/stats');
            setStats(res.data || {});
        } catch (e) { 
            console.error("Erro dashboard:", e); 
            setStats({});
        }
    };

    if (!stats) return <div className="p-20 text-center text-slate-400 animate-pulse text-sm font-medium tracking-widest uppercase">Carregando painel estratégico...</div>;

    const totalClients = stats.totalClients || 0;
    const totalRevenue = stats.totalRevenue || 0;
    const totalCost = stats.totalCost || 0;
    const netProfit = stats.netProfit || 0;
    const recentOrders = stats.recentOrders || [];
    const ordersByStatus = stats.ordersByStatus || {};

    const kpis = [
        { label: 'Clientes Ativos', value: totalClients, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Users size={20} /> },
        { label: 'Faturamento Bruto', value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`, color: 'text-slate-700', bg: 'bg-slate-50', icon: <Wallet size={20} /> },
        { label: 'Custo Industrial', value: `R$ ${totalCost.toLocaleString('pt-BR')}`, color: 'text-amber-600', bg: 'bg-amber-50/50', icon: <Package size={20} /> },
        { label: 'Margem Líquida', value: `R$ ${netProfit.toLocaleString('pt-BR')}`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <TrendingUp size={20} /> },
    ];

    return (
        <div className="space-y-10">
            <div className="text-left border-l-4 border-blue-500 pl-6 py-1">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Painel de Controle</h2>
                <p className="text-slate-400 text-sm font-medium">Bem-vindo à central de gestão operacional</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                        <div className={`w-10 h-10 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center mb-4`}>
                            {kpi.icon}
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <ClipboardList size={16} className="text-blue-500" /> Movimentações Recentes
                        </h3>
                        <Link to="/orders" className="text-blue-500 font-bold text-[10px] uppercase tracking-widest hover:text-blue-700 transition-colors">Ver Relatório Completo</Link>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">ID Ordem</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {recentOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">#{order.id.toString().padStart(4, '0')}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-600 uppercase text-xs">{order.client?.name || 'Não inf.'}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-800">R$ {(order.totalAmount || 0).toLocaleString('pt-BR')}</td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-300 text-xs italic">Nenhuma ordem registrada</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Logistics Status */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-8 text-left">Status da Operação</h3>
                    <div className="space-y-6">
                        {Object.entries(ordersByStatus).map(([status, count]: any) => (
                            <div key={status} className="space-y-2 text-left">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{status}</span>
                                    <span className="text-lg font-bold text-slate-700 leading-none">{count}</span>
                                </div>
                                <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-blue-400'}`} 
                                        style={{ width: `${(count / (stats.totalOrders || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {Object.keys(ordersByStatus).length === 0 && (
                            <p className="text-center text-slate-300 text-xs italic py-10">Sem atividades no momento</p>
                        )}
                    </div>
                    <div className="mt-10 pt-6 border-t border-slate-50 flex items-center gap-3 text-slate-300">
                        <CheckCircle size={14} className="text-emerald-400" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Servidor Sincronizado</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
