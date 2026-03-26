import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ChevronRight, History, X } from 'lucide-react';

const ProductionControl: React.FC = () => {
    const [tiresByStatus, setTiresByStatus] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [selectedTire, setSelectedTire] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => { loadTires(); }, []);

    async function loadTires() {
        setLoading(true);
        try {
            const response = await api.get('/tires/by-status');
            setTiresByStatus(response.data || {});
        } catch (error) { console.error("Erro ao carregar fila:", error); }
        finally { setLoading(false); }
    };

    const handleMove = async (id: number, currentStatus: string) => {
        const nextMap: any = {
            'COLLECTED': 'RECEIVED',
            'RECEIVED': 'INSPECTION',
            'INSPECTION': 'PRODUCTION',
            'PRODUCTION': 'READY'
        };
        const next = nextMap[currentStatus];
        if (!next) return;

        const obs = prompt(`Confirma movimentação para ${next}? Observações:`);
        if (obs === null) return; // Cancelou o prompt

        setIsUpdating(true);
        try {
            await api.patch(`/tires/${id}/status`, { status: next, observation: obs || "Movimentação de rotina" });
            await loadTires();
        } catch (e) { alert("Erro na comunicação com o servidor industrial."); }
        finally { setIsUpdating(false); }
    };

    const handleReject = async (id: number) => {
        const obs = prompt("MOTIVO DA RECUSA (SUCATA):");
        if (!obs) return;
        
        setIsUpdating(true);
        try {
            await api.patch(`/tires/${id}/status`, { status: 'REJECTED', observation: obs });
            await loadTires();
        } catch (e) { alert("Erro ao registrar sucata."); }
        finally { setIsUpdating(false); }
    };

    const stages = [
        { key: 'COLLECTED', label: 'Triagem / Coleta', color: 'bg-blue-500' },
        { key: 'RECEIVED', label: 'Chegada Fábrica', color: 'bg-slate-600' },
        { key: 'INSPECTION', label: 'Exame / Laudo', color: 'bg-indigo-600' },
        { key: 'PRODUCTION', label: 'Produção / Reforma', color: 'bg-amber-500' },
        { key: 'READY', label: 'Expedição / Pronto', color: 'bg-emerald-600' },
    ];

    if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse uppercase text-xs tracking-widest">Sincronizando Workflow...</div>;

    return (
        <div className="space-y-8 text-left">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Fluxo de Produção Industrial</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-4 mt-2">Gestão de Chão de Fábrica</p>
                </div>
                {isUpdating && <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black animate-pulse">ATUALIZANDO...</div>}
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-10 min-h-[650px] snap-x">
                {stages.map(stage => (
                    <div key={stage.key} className="flex-none w-80 bg-slate-100 rounded-[3rem] p-5 flex flex-col gap-5 border-2 border-slate-200/50 shadow-inner snap-center">
                        <div className={`p-6 ${stage.color} text-white rounded-[2.5rem] font-black text-xs uppercase text-center shadow-lg tracking-widest`}>
                            {stage.label} <br/> <span className="opacity-50 text-[10px]">{tiresByStatus[stage.key]?.length || 0} ITENS</span>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto p-1 custom-scrollbar">
                            {tiresByStatus[stage.key]?.map((tire: any) => (
                                <div 
                                    key={tire.id} 
                                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
                                    onClick={() => setSelectedTire(tire)}
                                >
                                    <div className="text-[9px] font-black text-blue-600 mb-2 flex justify-between uppercase">
                                        <span>#{tire.serialNumber || 'S/N'}</span>
                                        <History className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="font-black text-slate-800 text-sm uppercase leading-tight mb-1">{tire.brand}</div>
                                    <div className="text-[10px] font-bold text-slate-400 italic mb-5">{tire.size}</div>
                                    
                                    <div className="flex gap-2">
                                        {stage.key !== 'READY' && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleMove(tire.id, stage.key); }}
                                                className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                PRÓXIMA FASE <ChevronRight className="w-3 h-3" />
                                            </button>
                                        )}
                                        {stage.key === 'INSPECTION' && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleReject(tire.id); }}
                                                className="px-4 py-3 bg-rose-50 text-rose-600 rounded-2xl text-[9px] font-black hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!tiresByStatus[stage.key] || tiresByStatus[stage.key].length === 0) && (
                                <div className="py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Livre</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Hospitalar do Pneu */}
            {selectedTire && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-6 text-left">
                    <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="bg-slate-900 p-10 text-white flex justify-between items-start">
                            <div>
                                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Prontuário Industrial Ativo</p>
                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{selectedTire.brand} {selectedTire.size}</h3>
                                <div className="flex gap-4 mt-4">
                                    <span className="text-slate-400 font-mono text-xs font-bold uppercase">SÉRIE: {selectedTire.serialNumber}</span>
                                    <span className="text-slate-400 font-mono text-xs font-bold uppercase">PLACA: {selectedTire.licensePlate || 'N/A'}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedTire(null)} className="bg-white/10 p-3 rounded-2xl hover:bg-rose-500 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-10 max-h-[450px] overflow-y-auto custom-scrollbar">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Linha do Tempo Industrial</h4>
                            <div className="space-y-10 border-l-2 border-slate-100 ml-3">
                                {selectedTire.history?.map((h: any, idx: number) => (
                                    <div key={idx} className="relative pl-10">
                                        <div className="absolute left-[-11px] top-0 w-5 h-5 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">{h.statusAtThatTime}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(h.timestamp).toLocaleString('pt-BR')}</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{h.description}</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Responsável: {h.userName || 'Sistema'}</p>
                                    </div>
                                ))}
                                {(!selectedTire.history || selectedTire.history.length === 0) && (
                                    <p className="text-center text-slate-300 italic py-10 font-bold uppercase text-[10px] tracking-widest pl-0 ml-[-10px]">Sem registros históricos</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionControl;
