import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, AlertTriangle, ArrowLeft } from 'lucide-react';

interface Client { id: number; name: string; }

const CollectionForm: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [tires, setTires] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [serial, setSerial] = useState('');
    const [plate, setPlate] = useState('');

    useEffect(() => {
        api.get('/clients').then(res => setClients(res.data)).catch(err => console.error("Erro ao carregar clientes", err));
    }, []);

    const addTire = () => {
        if (!brand || !size || !serial) {
            alert("Preencha Marca, Medida e Nº de Série para adicionar.");
            return;
        }
        const newTire = { 
            brand: brand.toUpperCase(), 
            size: size.toUpperCase(), 
            serialNumber: serial.toUpperCase(), 
            licensePlate: plate.toUpperCase(),
            status: 'COLLECTED' 
        };
        setTires([...tires, newTire]);
        setBrand(''); setSize(''); setSerial(''); setPlate('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (tires.length === 0) {
            alert("Adicione pelo menos um pneu à lista antes de finalizar.");
            return;
        }
        setIsLoading(true);
        try {
            const orderData = {
                client: { id: parseInt(selectedClientId) },
                status: 'OPEN',
                tires: tires,
                items: [] 
            };
            const response = await api.post('/orders', orderData);
            if (response.status === 200 || response.status === 201) {
                alert("Coleta registrada com sucesso! Ordem de Serviço Gerada.");
                navigate('/orders');
            }
        } catch (error: any) {
            console.error("Erro detalhado na coleta:", error);
            alert("Falha no servidor ao salvar coleta. Erro: " + (error.response?.data?.message || "Erro Interno"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Nova Coleta de Pneus</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-8 mt-2">Módulo de Entrada e Rastreabilidade</p>
                </div>
                <Link to="/orders" className="text-slate-400 hover:text-slate-800 transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft size={14} /> Voltar
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 text-left space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Selecionar Cliente Proprietário</label>
                            <select 
                                className="w-full p-5 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-black text-slate-800"
                                value={selectedClientId} 
                                onChange={e => setSelectedClientId(e.target.value)} 
                                required
                            >
                                <option value="">Escolha um cliente cadastrado...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                            </select>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                <Plus size={16} className="text-blue-500" /> Identificação do Pneu
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-blue-500 outline-none font-bold" placeholder="MARCA (ex: MICHELIN)" value={brand} onChange={e => setBrand(e.target.value)} />
                                <input className="p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-blue-500 outline-none font-bold" placeholder="MEDIDA (ex: 295/80 R22.5)" value={size} onChange={e => setSize(e.target.value)} />
                                <input className="p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-blue-500 outline-none font-bold font-mono" placeholder="Nº SÉRIE / FOGO" value={serial} onChange={e => setSerial(e.target.value)} />
                                <input className="p-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-blue-500 outline-none font-bold font-mono" placeholder="PLACA (OPCIONAL)" value={plate} onChange={e => setPlate(e.target.value)} />
                            </div>
                            <button 
                                type="button" 
                                onClick={addTire}
                                className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all text-xs"
                            >
                                ADICIONAR AO LOTE
                            </button>
                        </div>
                    </div>

                    {/* Tires List */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Resumo do Lote ({tires.length} pneus)</h4>
                        {tires.map((t, i) => (
                            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm text-left group hover:border-blue-200 transition-all">
                                <div>
                                    <div className="font-black text-slate-800 uppercase text-sm leading-none mb-1">{t.brand} - {t.size}</div>
                                    <div className="flex gap-4">
                                        <span className="text-[10px] font-black text-blue-600 font-mono">SÉRIE: {t.serialNumber}</span>
                                        {t.licensePlate && <span className="text-[10px] font-black text-emerald-600 font-mono uppercase">PLACA: {t.licensePlate}</span>}
                                    </div>
                                </div>
                                <button type="button" onClick={() => setTires(tires.filter((_, idx) => idx !== i))} className="text-rose-200 hover:text-rose-600 transition-colors p-2 font-black">X</button>
                            </div>
                        ))}
                        {tires.length === 0 && (
                            <div className="p-20 text-center bg-slate-100/50 rounded-[3rem] border-4 border-dashed border-white text-slate-300 font-black uppercase text-xs tracking-widest italic">
                                Nenhum pneu adicionado
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8 sticky top-10">
                        <div className="text-left">
                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Resumo Final</p>
                            <h3 className="text-xl font-black uppercase leading-tight">Pronto para<br/>Processamento</h3>
                        </div>
                        
                        <div className="space-y-4 py-6 border-y border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Qtd Pneus</span>
                                <span className="text-2xl font-black">{tires.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                                <span className="text-[10px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full">Validado</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={!selectedClientId || tires.length === 0 || isLoading}
                            className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-900/50 disabled:opacity-20 transition-all uppercase tracking-[0.2em] text-xs hover:bg-blue-500 active:scale-95"
                        >
                            {isLoading ? "Enviando..." : "Gerar Ordem Industrial"}
                        </button>
                        
                        <div className="flex items-center gap-3 text-slate-500 bg-white/5 p-4 rounded-2xl">
                            <AlertTriangle size={16} />
                            <p className="text-[9px] font-bold leading-relaxed uppercase">Ao clicar em confirmar, os pneus serão inseridos na fila da fábrica automaticamente.</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CollectionForm;
