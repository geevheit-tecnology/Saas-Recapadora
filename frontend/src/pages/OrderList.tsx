import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Order {
    id: number;
    client: { name: string };
    orderDate: string;
    status: string;
    totalAmount: number;
}

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Erro ao carregar ordens", error);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/orders/${id}/status`, { status: newStatus });
            loadOrders();
        } catch (error) {
            console.error("Erro ao atualizar status", error);
        }
    };

    const statusColors: any = {
        'OPEN': 'bg-blue-100 text-blue-700',
        'IN_PROGRESS': 'bg-amber-100 text-amber-700',
        'COMPLETED': 'bg-emerald-100 text-emerald-700',
        'CANCELLED': 'bg-rose-100 text-rose-700',
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Ordens de Serviço</h2>
                <Link to="/orders/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                    + Nova Ordem
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Total (R$)</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-500">#{order.id.toString().padStart(4, '0')}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">{order.client.name}</td>
                                <td className="px-6 py-4 text-slate-600">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${statusColors[order.status]}`}
                                    >
                                        <option value="OPEN">Aberta</option>
                                        <option value="IN_PROGRESS">Em Andamento</option>
                                        <option value="COMPLETED">Finalizada</option>
                                        <option value="CANCELLED">Cancelada</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">
                                    {order.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link to={`/orders/view/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                        Detalhes
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
