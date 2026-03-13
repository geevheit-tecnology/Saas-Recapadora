import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Client {
    id: number;
    name: string;
    taxId: string;
    phone: string;
    email: string;
    address: string;
}

const ClientList: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error("Erro ao carregar clientes", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
            try {
                await api.delete(`/clients/${id}`);
                loadClients();
            } catch (error) {
                console.error("Erro ao excluir cliente", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Gerenciamento de Clientes</h2>
                <Link to="/clients/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                    + Novo Cliente
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">CPF/CNPJ</th>
                            <th className="px-6 py-4">Contato</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {clients.map(client => (
                            <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{client.name}</td>
                                <td className="px-6 py-4 text-slate-600">{client.taxId || '-'}</td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-800 font-medium">{client.phone}</div>
                                    <div className="text-slate-500 text-xs">{client.email}</div>
                                </td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <Link to={`/clients/edit/${client.id}`} className="inline-block px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md transition-colors font-medium">
                                        Editar
                                    </Link>
                                    <button onClick={() => handleDelete(client.id)} className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md transition-colors font-medium">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && (
                    <div className="p-12 text-center text-slate-400 italic">
                        Nenhum cliente cadastrado.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientList;
