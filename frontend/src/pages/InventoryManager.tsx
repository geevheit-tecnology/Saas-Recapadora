import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PackagePlus, ShoppingCart } from 'lucide-react';

const InventoryManager: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [qty, setQty] = useState('');
    const [cost, setCost] = useState('');

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data.filter((p:any) => p.type === 'MATERIAL')));
        api.get('/suppliers').then(res => setSuppliers(res.data));
    }, []);

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/inventory/purchase', {
                productId: selectedProduct,
                supplierId: selectedSupplier,
                quantity: qty,
                cost: cost
            });
            alert("Compra registrada e estoque atualizado!");
            setQty(''); setCost('');
            api.get('/products').then(res => setProducts(res.data.filter((p:any) => p.type === 'MATERIAL')));
        } catch (e) { alert("Erro ao registrar compra"); }
    };

    return (
        <div className="space-y-8 text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Gestão de Suprimentos</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form de Compra */}
                <form onSubmit={handlePurchase} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <PackagePlus size={24} />
                        </div>
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Entrada de Mercadoria (Compra)</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Material / Insumo</label>
                            <select 
                                className="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                                value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required
                            >
                                <option value="">Selecione o material...</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Atual: {p.stockQuantity})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Fornecedor</label>
                            <select 
                                className="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                                value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}
                            >
                                <option value="">Selecione o fornecedor...</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Quantidade</label>
                                <input 
                                    type="number" className="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold"
                                    value={qty} onChange={e => setQty(e.target.value)} required 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Custo Unitário (R$)</label>
                                <input 
                                    type="number" step="0.01" className="w-full p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-500 font-bold text-emerald-600"
                                    value={cost} onChange={e => setCost(e.target.value)} required 
                                />
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 transition-all">
                        <ShoppingCart size={20} /> Confirmar Compra
                    </button>
                </form>

                {/* Status do Estoque */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Nível de Insumos Críticos</h3>
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {products.map(p => (
                            <div key={p.id} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="font-black text-slate-800 uppercase text-xs tracking-tight">{p.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold tracking-tighter">Estoque Atual: {p.stockQuantity} un</p>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${p.stockQuantity < 10 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {p.stockQuantity < 10 ? 'REPOSIÇÃO URGENTE' : 'OK'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${p.stockQuantity < 10 ? 'bg-rose-500' : 'bg-blue-500'}`}
                                        style={{ width: `${Math.min(p.stockQuantity * 2, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && <p className="text-slate-300 text-xs italic py-10">Nenhum material cadastrado</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryManager;
