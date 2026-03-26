import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

interface Client { id: number; name: string; }
interface Product { id: number; name: string; price: number; }
interface OrderItem { productId: number; quantity: number; price: number; name: string; }

const OrderForm: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [resClients, resProducts] = await Promise.all([
                api.get('/clients'),
                api.get('/products')
            ]);
            setClients(resClients.data);
            setProducts(resProducts.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    };

    const addItem = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setItems([...items, { productId: product.id, quantity: 1, price: product.price, name: product.name }]);
        }
    };

    const updateQuantity = (index: number, qty: number) => {
        const newItems = [...items];
        newItems[index].quantity = qty;
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const clientId = parseInt(selectedClientId, 10);
        if (Number.isNaN(clientId)) {
            alert("Selecione um cliente valido.");
            return;
        }
        if (items.some(item => !item.quantity || item.quantity <= 0)) {
            alert("Todos os itens precisam ter quantidade maior que zero.");
            return;
        }
        const orderData = {
            client: { id: clientId },
            items: items.map(item => ({
                product: { id: item.productId },
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            setIsSaving(true);
            await api.post('/orders', orderData);
            navigate('/orders');
        } catch (error: any) {
            alert("Erro ao criar ordem: " + (error.response?.data?.message || "Verifique os dados informados"));
        } finally {
            setIsSaving(false);
        }
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/orders" className="text-slate-500 hover:text-slate-800 transition-colors">← Voltar</Link>
                <h2 className="text-2xl font-bold text-slate-800">Nova Ordem de Serviço</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Selecionar Cliente *</label>
                    <select 
                        value={selectedClientId} 
                        onChange={e => setSelectedClientId(e.target.value)} 
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="">Selecione um cliente...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {/* Items Card */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">Itens e Serviços</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium uppercase">Adicionar:</span>
                            <select 
                                onChange={e => { if(e.target.value) addItem(parseInt(e.target.value)); e.target.value = ''; }} 
                                value=""
                                className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Selecione para adicionar...</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-widest">
                                <tr>
                                    <th className="px-6 py-3">Item</th>
                                    <th className="px-6 py-3">Preço Unit.</th>
                                    <th className="px-6 py-3">Qtd.</th>
                                    <th className="px-6 py-3 text-right">Subtotal</th>
                                    <th className="px-6 py-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {items.map((item, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-600">R$ {item.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="number" 
                                                className="w-16 px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                value={item.quantity} 
                                                min="1"
                                                onChange={e => updateQuantity(index, parseInt(e.target.value))} 
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-800">
                                            R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                type="button" 
                                                onClick={() => removeItem(index)}
                                                className="text-rose-500 hover:text-rose-700 p-1"
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                            Nenhum item adicionado à ordem.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {items.length > 0 && (
                                <tfoot className="bg-slate-50/80">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-right text-slate-600 font-semibold uppercase text-xs">Total da Ordem:</td>
                                        <td className="px-6 py-4 text-right text-xl font-black text-blue-700">
                                            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link to="/orders" className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors font-medium">Cancelar</Link>
                    <button 
                        type="submit" 
                        disabled={!selectedClientId || items.length === 0 || isSaving}
                        className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-blue-200"
                    >
                        {isSaving ? 'Salvando...' : 'Finalizar e Gerar Ordem'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;
