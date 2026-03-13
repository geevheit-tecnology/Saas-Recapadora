import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Printer, ArrowLeft } from 'lucide-react';

const OrderReceipt: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        api.get(`/orders/${id}`).then(res => setOrder(res.data));
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (!order) return <div className="p-20 text-center font-black text-slate-400 animate-pulse uppercase text-xs tracking-widest">Gerando Prontuário...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8 no-print pt-4">
                <Link to="/orders" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-all text-xs uppercase tracking-widest">
                    <ArrowLeft size={14} /> Voltar
                </Link>
                <button 
                    onClick={handlePrint}
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest"
                >
                    <Printer size={18} /> IMPRIMIR RECIBO
                </button>
            </div>

            <div id="receipt-print-area" className="bg-white p-12 shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
                <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10 mb-10 text-left">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 leading-none mb-2 tracking-tighter uppercase">RECAUCHUTAGEM <span className="text-blue-600">ERP</span></h1>
                        <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Tecnologia em Renovação de Pneus</p>
                        <div className="mt-6 text-xs font-bold text-slate-400 space-y-1 uppercase">
                            <p>CNPJ: 00.000.000/0001-00</p>
                            <p>Rua da Indústria, 1000 - Distrito Industrial</p>
                            <p>Telefone: (00) 3333-4444</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="bg-slate-900 text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest mb-4 inline-block">
                            Ordem de Coleta / Serviço
                        </div>
                        <div className="text-6xl font-black text-slate-900 tracking-tighter font-mono">#{order.id.toString().padStart(4, '0')}</div>
                        <p className="text-xs font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">Data: {new Date(order.orderDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 text-left">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Cliente / Destinatário</h4>
                        <div className="font-black text-slate-800 text-xl uppercase leading-tight mb-2 tracking-tighter">{order.client?.name}</div>
                        <p className="text-xs font-bold text-slate-500 mb-1 font-mono">DOC: {order.client?.taxId || '---'}</p>
                        <p className="text-xs font-bold text-slate-500 font-mono">{order.client?.phone}</p>
                        <p className="text-[10px] text-slate-400 mt-3 leading-relaxed uppercase font-medium">{order.client?.address}</p>
                    </div>
                    <div className="p-8 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Validação Fiscal</p>
                        <span className="text-2xl font-black text-slate-200 uppercase italic tracking-tighter leading-none">Aguardando<br/>Faturamento</span>
                    </div>
                </div>

                <div className="mb-12">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 border-b-2 border-slate-900 pb-2 text-left">Relação de Pneus para Reforma</h4>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="py-4">Descrição / Marca</th>
                                <th className="py-4">Medida</th>
                                <th className="py-4 text-center font-mono">Nº Série</th>
                                <th className="py-4 text-right">Placa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {order.tires?.map((tire: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="py-5">
                                        <div className="font-black text-slate-800 uppercase text-xs leading-none">{tire.brand}</div>
                                        <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase italic tracking-tighter">{tire.model || 'Pneu Industrial'}</div>
                                    </td>
                                    <td className="py-5 font-black text-slate-600 text-xs">{tire.size}</td>
                                    <td className="py-5 text-center font-mono font-black text-slate-900 text-xs tracking-tighter">{tire.serialNumber}</td>
                                    <td className="py-5 text-right font-mono font-black text-blue-600 text-xs">{tire.licensePlate || '---'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mb-20">
                    <div className="w-72 bg-slate-900 p-8 rounded-[2.5rem] text-white text-right shadow-2xl">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Valor Total Estimado</p>
                        <p className="text-3xl font-black tracking-tighter font-mono">R$ {order.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-20 pt-16 border-t-2 border-slate-50">
                    <div className="text-center">
                        <div className="h-0.5 bg-slate-200 mb-4 mx-10"></div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{order.client?.name}</p>
                        <p className="text-[8px] text-slate-300 uppercase mt-1">Carimbo e Assinatura</p>
                    </div>
                    <div className="text-center">
                        <div className="h-0.5 bg-slate-200 mb-4 mx-10"></div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RESPONSÁVEL TÉCNICO</p>
                        <p className="text-[8px] text-slate-300 uppercase mt-1">Assinatura do Conferente</p>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-[8px] text-slate-200 font-black uppercase tracking-[0.4em]">Recauchutagem ERP Industrial • Rastreabilidade Certificada ISO-9001</p>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #receipt-print-area, #receipt-print-area * { visibility: visible; }
                    #receipt-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                    .no-print { display: none !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>
        </div>
    );
};

export default OrderReceipt;
