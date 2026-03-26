import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft } from 'lucide-react';

const ClientForm: React.FC = () => {
    const [name, setName] = useState('');
    const [taxId, setTaxId] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            api.get(`/clients/${id}`).then(res => {
                const c = res.data;
                setName(c.name); setTaxId(c.taxId || ''); setPhone(c.phone || ''); setEmail(c.email || ''); setAddress(c.address || '');
            });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = {
                name: name.trim(),
                taxId: taxId.trim() || null,
                phone: phone.trim() || null,
                email: email.trim() || null,
                address: address.trim() || null
            };
            if (id) await api.put(`/clients/${id}`, data);
            else await api.post('/clients', data);
            alert("Operação realizada com sucesso!");
            navigate('/clients');
        } catch (error: any) {
            alert("Erro ao salvar cliente: " + (error.response?.data?.message || "Verifique os dados"));
        } finally { setIsLoading(false); }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10 pb-20">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{id ? 'Editar Cadastro' : 'Novo Cliente'}</h2>
                    <p className="text-slate-500 font-medium italic underline decoration-blue-500 underline-offset-8 mt-2">Gestão de Identidade de Clientes</p>
                </div>
                <Link to="/clients" className="text-slate-400 hover:text-slate-800 transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft size={14} /> Voltar
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden text-left">
                <div className="p-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Nome Completo ou Razão Social</label>
                            <input className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">CPF / CNPJ</label>
                            <input className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" value={taxId} onChange={e => setTaxId(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Telefone de Contato</label>
                            <input className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">E-mail Corporativo</label>
                            <input type="email" className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Endereço de Entrega/Coleta</label>
                            <input className="w-full p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 p-10 flex justify-end gap-4">
                    <Link to="/clients" className="px-8 py-4 rounded-2xl text-slate-400 font-bold hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">Descartar</Link>
                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all text-xs">
                        {isLoading ? 'PROCESSANDO...' : 'SALVAR REGISTRO'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientForm;
