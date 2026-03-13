import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { MessageCircle, FileText, Landmark, Printer } from 'lucide-react';

const SalesMonitor: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders');
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const sendWhatsApp = (order: any) => {
        const tires = order.tires || [];
        const ready = tires.filter((t: any) => t.status === 'READY').length;
        
        let message = `Olá *${order.client?.name}*!\n\n`;
        message += `Seu pedido *#${order.id.toString().padStart(4, '0')}* tem novidades.\n`;
        message += `🚀 Pneus Prontos: ${ready} de ${tires.length}\n\n`;
        
        if (order.billingUrl) {
            message += `💳 Link para Pagamento: ${order.billingUrl}\n\n`;
        }

        message += `Acompanhe aqui: ${window.location.origin}/track/${order.id}`;
        window.open(`https://wa.me/${order.client?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">Sincronizando Malha de Vendas...</div>;

    return (
        <div className="space-y-8 text-left">
            <div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Monitor de Vendas & Faturamento</h2>
                <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-4 tracking-tight">Controle comercial e fiscal</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all">
                        <div className="flex-1 space-y-4 w-full">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">OS #{order.id.toString().padStart(4, '0')}</span>
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                <span className="text-lg font-black text-slate-800 uppercase tracking-tighter">{order.client?.name}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
                                    <FileText className="w-3 h-3 text-blue-500" /> NF: {order.fiscalNoteStatus || 'PENDENTE'}
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 uppercase tracking-widest">
                                    <Landmark className="w-3 h-3 text-emerald-500" /> BANCO: {order.billingStatus || 'AGUARDANDO'}
                                </div>
                            </div>

                            <div className="flex gap-10 pt-2">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Prontos</p>
                                    <p className="text-xl font-black text-emerald-600 leading-none">{order.tires?.filter((t:any) => t.status === 'READY').length || 0}</p>
                                </div>
                                <div className="border-l border-slate-100 pl-10">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sucata</p>
                                    <p className="text-xl font-black text-rose-500 leading-none">{order.tires?.filter((t:any) => t.status === 'REJECTED').length || 0}</p>
                                </div>
                                <div className="border-l border-slate-100 pl-10">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-xl font-black text-slate-900 leading-none">R$ {order.totalAmount.toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <button 
                                onClick={() => sendWhatsApp(order)}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 transition-all active:scale-95 text-xs uppercase tracking-widest"
                            >
                                <MessageCircle size={18} /> NOTIFICAR
                            </button>
                            <Link 
                                to={`/orders/view/${order.id}`}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest"
                            >
                                <Printer size={18} /> RECIBO
                            </Link>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="py-20 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-100 rounded-[3rem]">Nenhuma venda monitorada</div>
                )}
            </div>
        </div>
    );
};

export default SalesMonitor;
