import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    type: 'SERVICE' | 'MATERIAL';
    stockQuantity: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Erro ao carregar produtos", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Deseja excluir este item?")) {
            try {
                await api.delete(`/products/${id}`);
                loadProducts();
            } catch (error) {
                console.error("Erro ao excluir produto", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Produtos e Serviços</h2>
                <Link to="/products/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                    + Novo Item
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4">Estoque</th>
                            <th className="px-6 py-4">Preço (R$)</th>
                            <th className="px-6 py-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        product.type === 'SERVICE' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {product.type === 'SERVICE' ? 'SERVIÇO' : 'MATERIAL'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {product.type === 'MATERIAL' ? (
                                        <span className={`font-mono font-bold ${product.stockQuantity <= 5 ? 'text-rose-600' : 'text-slate-600'}`}>
                                            {product.stockQuantity} un
                                        </span>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-700">
                                    {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-center space-x-2 text-xs">
                                    <Link to={`/products/edit/${product.id}`} className="inline-block px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md transition-colors font-medium">
                                        Editar
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md transition-colors font-medium">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
