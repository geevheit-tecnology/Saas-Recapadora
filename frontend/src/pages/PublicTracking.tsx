import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Package, Truck, Construction, XCircle } from 'lucide-react';

const PublicTracking: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
        axios.get(`${baseUrl}/orders/track/${id}`)
            .then(res => setOrder(res.data))
            .catch(() => setError(true));
    }, [id]);

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="text-center space-y-4">
                <XCircle className="w-16 h-16 text-rose-500 mx-auto" />
                <h2 className="text-2xl font-black text-slate-800">Pedido não encontrado</h2>
                <p className="text-slate-500">Verifique o número da OS e tente novamente.</p>
            </div>
        </div>
    );

    if (!order) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">Consultando Satélites...</div>;

    const statusConfig: any = {
        'COLLECTED': { label: 'Coletado', icon: <Package className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-50' },
        'RECEIVED': { label: 'Na Fábrica', icon: <Package className="w-5 h-5" />, color: 'text-slate-500', bg: 'bg-slate-50' },
        'INSPECTION': { label: 'Em Exame', icon: <Construction className="w-5 h-5" />, color: 'text-amber-500', bg: 'bg-amber-50' },
        'PRODUCTION': { label: 'Em Reforma', icon: <Construction className="w-5 h-5" />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        'READY': { label: 'Pronto!', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        'DELIVERED': { label: 'Entregue', icon: <Truck className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
        'REJECTED': { label: 'Recusado', icon: <XCircle className="w-5 h-5" />, color: 'text-rose-500', bg: 'bg-rose-50' },
    };

    return (
        <div className="min-h-screen bg-slate-900 pb-20">
            {/* Header Cliente */}
            <div className="bg-blue-600 p-10 text-white rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10">
                    <p className="text-blue-100 text-xs font-black uppercase tracking-[0.3em] mb-2">Acompanhamento de Pedido</p>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-6">Olá, {order.client.name.split(' ')[0]}!</h1>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                            <span className="text-[10px] font-black uppercase block opacity-60">Pedido nº</span>
                            <span className="text-xl font-black">#{order.id.toString().padStart(4, '0')}</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                            <span className="text-[10px] font-black uppercase block opacity-60">Status Geral</span>
                            <span className="text-xl font-black">{order.status === 'OPEN' ? 'EM ANDAMENTO' : order.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Pneus */}
            <div className="max-w-md mx-auto -mt-10 px-6 space-y-6">
                <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2">Seus Pneus ({order.tires.length})</h3>
                
                {order.tires.map((tire: any) => (
                    <div key={tire.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <h4 className="text-xl font-black text-slate-800 uppercase leading-none">{tire.brand}</h4>
                                <p className="text-sm font-bold text-slate-400 italic">{tire.size}</p>
                            </div>
                            <div className={`${statusConfig[tire.status]?.bg} ${statusConfig[tire.status]?.color} p-3 rounded-2xl`}>
                                {statusConfig[tire.status]?.icon}
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-4 border-t border-slate-50 mt-4">
                            <div className="text-center flex-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase">Número de Série</p>
                                <p className="font-mono font-black text-slate-700">{tire.serialNumber}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="text-center flex-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase">Situação Atual</p>
                                <p className={`font-black uppercase text-xs ${statusConfig[tire.status]?.color}`}>{statusConfig[tire.status]?.label}</p>
                            </div>
                        </div>

                        {tire.status === 'REJECTED' && (
                            <div className="mt-4 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                <p className="text-xs text-rose-700 font-bold leading-tight">
                                    ⚠️ Atenção: Este pneu foi avaliado como sucata no exame inicial e não poderá ser reformado por questões de segurança.
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Recauchutagem API Industrial<br/>Tecnologia em Segurança
                </p>
            </div>
        </div>
    );
};

export default PublicTracking;
