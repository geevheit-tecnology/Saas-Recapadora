import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft } from 'lucide-react';

const ProductForm: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('SERVICE');
    const [stockQuantity, setStockQuantity] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            api.get(`/products/${id}`).then(res => {
                const p = res.data;
                setName(p.name || ''); 
                setDescription(p.description || ''); 
                setPrice(p.price?.toString() || ''); 
                setType(p.type || 'SERVICE'); 
                setStockQuantity(p.stockQuantity?.toString() || '0');
            }).catch(err => console.error("Erro ao carregar produto", err));
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) {
            alert("Preço inválido");
            return;
        }
        const stockQuantityNum = type === 'SERVICE' ? 0 : parseInt(stockQuantity || '0', 10);
        if (Number.isNaN(stockQuantityNum) || stockQuantityNum < 0) {
            alert("Estoque inválido");
            return;
        }

        setIsLoading(true);
        try {
            const data = { 
                name: name.toUpperCase(), 
                description: description.trim() || null, 
                price: priceNum, 
                type, 
                stockQuantity: stockQuantityNum
            };

            if (id) {
                await api.put(`/products/${id}`, data);
            } else {
                await api.post('/products', data);
            }
            alert("Item salvo com sucesso!");
            navigate('/products');
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || "Erro desconhecido";
            alert("Falha ao salvar: " + msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{id ? 'Editar Cadastro' : 'Novo Serviço/Produto'}</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-8 mt-2">Configuração de Catálogo Industrial</p>
                </div>
                <Link to="/products" className="text-slate-400 hover:text-slate-800 transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft size={14} /> Voltar
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden text-left">
                <div className="p-12 space-y-8">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Nome do Serviço ou Material *</label>
                        <input 
                            className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            placeholder="EX: RECAPAGEM ARO 22.5"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Tipo</label>
                            <select 
                                className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" 
                                value={type} 
                                onChange={e => setType(e.target.value)}
                            >
                                <option value="SERVICE">SERVIÇO</option>
                                <option value="MATERIAL">MATERIAL</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Valor Unitário (R$) *</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-emerald-600" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)} 
                                required 
                                placeholder="0,00"
                            />
                        </div>
                        <div>
                            <label className={`text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block ${type === 'SERVICE' ? 'opacity-30' : ''}`}>Qtd. Estoque</label>
                            <input 
                                type="number" 
                                disabled={type === 'SERVICE'} 
                                className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold disabled:opacity-30" 
                                value={stockQuantity} 
                                onChange={e => setStockQuantity(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Observações Técnicas</label>
                        <textarea 
                            className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold min-h-[120px]" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Detalhes adicionais..."
                        />
                    </div>
                </div>

                <div className="bg-slate-50 p-10 flex justify-end gap-4">
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all text-xs"
                    >
                        {isLoading ? 'GRAVANDO...' : 'CONFIRMAR CADASTRO'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
