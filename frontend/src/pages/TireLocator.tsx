import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Truck, Hash } from 'lucide-react';

interface Tire {
    id: number;
    brand: string;
    size: string;
    serialNumber: string;
    licensePlate: string;
    status: string;
    serviceOrder?: { id: number, client?: { name: string } };
}

const TireLocator: React.FC = () => {
    const [tires, setTires] = useState<Tire[]>([]);
    const [searchTerm, setSearchNumber] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTires();
    }, []);

    const loadTires = async () => {
        setLoading(true);
        try {
            const res = await api.get('/tires');
            setTires(Array.isArray(res.data) ? res.data : []);
        } catch (e) { 
            console.error("Erro ao carregar pneus", e); 
        } finally {
            setLoading(false);
        }
    };

    const filteredTires = tires.filter(t => 
        (t.serialNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (t.licensePlate?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (t.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const statusMap: any = {
        'COLLECTED': { label: 'Coletado', color: 'bg-blue-100 text-blue-700' },
        'RECEIVED': { label: 'Na Fábrica', color: 'bg-slate-100 text-slate-700' },
        'INSPECTION': { label: 'Em Exame', color: 'bg-blue-100 text-blue-700' },
        'PRODUCTION': { label: 'Em Produção', color: 'bg-amber-100 text-amber-700' },
        'READY': { label: 'Pronto', color: 'bg-emerald-100 text-emerald-700' },
        'DELIVERED': { label: 'Entregue', color: 'bg-indigo-100 text-indigo-700' },
        'REJECTED': { label: 'Sucata', color: 'bg-rose-100 text-rose-700' },
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-left">
                    <h2 className="text-3xl font-black text-slate-800">Localizador de Pneus</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-4">Rastreabilidade em tempo real</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text"
                        placeholder="Busque por Placa, Série ou Marca..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchNumber(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Varrendo o inventário...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTires.map(tire => (
                        <div key={tire.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all group text-left">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[tire.status]?.color || 'bg-slate-100 text-slate-600'}`}>
                                    {statusMap[tire.status]?.label || tire.status}
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase">OS #{tire.serviceOrder?.id || '---'}</div>
                            </div>

                            <h3 className="text-xl font-black text-slate-800 uppercase leading-none mb-1">{tire.brand || 'Marca não inf.'}</h3>
                            <p className="text-sm font-bold text-slate-400 mb-6 italic">{tire.size || 'Medida não inf.'}</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <Hash className="w-4 h-4 text-blue-500" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">Nº de Série</p>
                                        <p className="text-sm font-mono font-black text-slate-700">{tire.serialNumber || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <Truck className="w-4 h-4 text-emerald-500" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">Placa do Veículo</p>
                                        <p className="text-sm font-mono font-black text-slate-700">{tire.licensePlate || 'NÃO INFORMADA'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase">Cliente:</span>
                                <span className="text-xs font-black text-slate-600 truncate max-w-[150px] uppercase">{tire.serviceOrder?.client?.name || 'Não vinculado'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredTires.length === 0 && !loading && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold italic">Nenhum pneu encontrado com esses dados.</p>
                </div>
            )}
        </div>
    );
};

export default TireLocator;
