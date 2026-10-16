import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Estudante() {
    const [usuarios, setUsuarios] = useState([]);
    const [estudanteLogado, setEstudanteLogado] = useState(null);
    const [mentores, setMentores] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados de Login
    const [emailLogin, setEmailLogin] = useState('');
    const [senhaLogin, setSenhaLogin] = useState('');

    // Estados de Cadastro
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [emailUsuario, setEmailUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');
    const [bairroUsuario, setBairroUsuario] = useState('');
    const [bioUsuario, setBioUsuario] = useState('');
    const [idadeUsuario, setIdadeUsuario] = useState('');

    // Estados de Edição de Perfil (UPDATE de Usuário)
    const [editandoPerfil, setEditandoPerfil] = useState(false);
    const [nomeEdit, setNomeEdit] = useState('');
    const [emailEdit, setEmailEdit] = useState('');
    const [senhaEdit, setSenhaEdit] = useState('');
    const [bairroEdit, setBairroEdit] = useState('');
    const [bioEdit, setBioEdit] = useState('');

    // Estados de Agendamento
    const [mentorId, setMentorId] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [observacoes, setObservacoes] = useState('');

    // Estados para Edição / Alteração de Data
    const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState(null);
    const [novaDataHora, setNovaDataHora] = useState('');

    const carregarDados = () => {
        setLoading(true);
        api.get('/usuarios')
            .then(res => setUsuarios(res.data))
            .catch(err => console.error("Erro ao carregar utilizadores:", err));

        api.get('/mentores')
            .then(res => setMentores(res.data))
            .catch(err => console.error("Erro ao carregar mentores:", err));

        api.get('/agendamentos')
            .then(res => {
                setAgendamentos(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar agendamentos:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const utilizadorEncontrado = usuarios.find(
            u => u.email.toLowerCase() === emailLogin.toLowerCase() && u.senha === senhaLogin
        );

        if (utilizadorEncontrado) {
            setEstudanteLogado(utilizadorEncontrado);
            setEmailLogin('');
            setSenhaLogin('');
        } else {
            alert('E-mail ou senha incorretos. Verifique os dados ou crie uma conta.');
        }
    };

    const handleCadastrarUsuario = (e) => {
        e.preventDefault();

        // Validação de maioridade (mínimo 18 anos)
        if (parseInt(idadeUsuario) < 18) {
            alert('Cadastro não permitido. O Raiz Tech é exclusivo para maiores de 18 anos.');
            return;
        }

        api.post('/usuarios', {
            nome: nomeUsuario,
            email: emailUsuario,
            senha: senhaUsuario,
            bairro: bairroUsuario,
            bio: bioUsuario
        })
            .then(res => {
                alert('Estudante cadastrado com sucesso! Podes fazer login agora.');
                setNomeUsuario(''); setEmailUsuario(''); setSenhaUsuario(''); setBairroUsuario(''); setBioUsuario(''); setIdadeUsuario('');
                carregarDados();
                setEstudanteLogado(res.data);
            })
            .catch(err => { console.error(err); alert('Erro ao cadastrar estudante.'); });
    };

    // UPDATE: Atualizar Perfil do Estudante
    const handleAtualizarPerfil = (e) => {
        e.preventDefault();
        if (!estudanteLogado) return;

        api.put(`/usuarios/${estudanteLogado.id}`, {
            nome: nomeEdit,
            email: emailEdit,
            senha: senhaEdit,
            bairro: bairroEdit,
            bio: bioEdit
        })
            .then(res => {
                alert('Perfil atualizado com sucesso!');
                setEstudanteLogado(res.data);
                setEditandoPerfil(false);
                carregarDados();
            })
            .catch(err => {
                console.error("Erro ao atualizar perfil:", err);
                alert('Erro ao atualizar o perfil. Verifica os dados.');
            });
    };

    const handleCadastrarAgendamento = (e) => {
        e.preventDefault();
        if (!estudanteLogado) {
            alert('Sessão expirada ou inválida.');
            return;
        }

        api.post('/agendamentos', {
            dataHora: dataHora,
            observacoes: observacoes,
            status: 'AGENDADO',
            mentor: { id: Number(mentorId) },
            usuario: { id: Number(estudanteLogado.id) }
        })
            .then(() => {
                alert('Mentoria agendada com sucesso!');
                setDataHora(''); setObservacoes(''); setMentorId('');
                carregarDados();
            })
            .catch(err => { console.error(err); alert('Erro para agendar mentoria.'); });
    };

    // UPDATE: Alterar Data/Hora da Mentoria com payload limpo
    const handleAlterarDataAgendamento = (agendamento) => {
        if (!novaDataHora) {
            alert('Por favor, escolhe uma nova data e hora.');
            return;
        }

        const dataFormatada = novaDataHora.length === 16 ? `${novaDataHora}:00` : novaDataHora;

        api.put(`/agendamentos/${agendamento.id}`, {
            dataHora: dataFormatada,
            observacoes: agendamento.observacoes,
            status: agendamento.status,
            mentor: { id: agendamento.mentor?.id },
            usuario: { id: agendamento.usuario?.id }
        })
            .then(() => {
                alert('Data da mentoria alterada com sucesso!');
                setAgendamentoEmEdicao(null);
                setNovaDataHora('');
                carregarDados();
            })
            .catch(err => {
                console.error("Erro ao alterar data:", err.response || err);
                alert(`Erro ao alterar a data (${err.response?.status || 'Erro de rede'}). Verifica a consola.`);
            });
    };

    // DELETE: Excluir/Cancelar Agendamento
    const handleExcluirAgendamento = (idAgendamento) => {
        if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
            api.delete(`/agendamentos/${idAgendamento}`)
                .then(() => {
                    alert('Agendamento excluído com sucesso.');
                    carregarDados();
                })
                .catch(err => {
                    console.error("Erro ao excluir agendamento:", err.response || err);
                    alert(`Erro ao excluir agendamento (${err.response?.status || 'Erro de rede'}).`);
                });
        }
    };

    // DELETE: Excluir Conta do Estudante
    const handleExcluirConta = () => {
        if (window.confirm('Atenção: Esta ação é irreversível. Deseja mesmo eliminar a conta e todos os dados associados?')) {
            api.delete(`/usuarios/${estudanteLogado.id}`)
                .then(() => {
                    alert('Conta eliminada com sucesso.');
                    setEstudanteLogado(null);
                    carregarDados();
                })
                .catch(err => { console.error(err); alert('Erro para excluir a conta.'); });
        }
    };

    const minhasMentorias = agendamentos.filter(ag => ag.usuario?.id === estudanteLogado?.id);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
            <div style={{ flex: 1 }}>
                {/* CABEÇALHO */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ color: '#28a745', margin: '0 0 5px 0' }}>Área do Estudante</h1>
                        <p style={{ color: '#666', margin: 0 }}>
                            {estudanteLogado ? `Sessão ativa: ${estudanteLogado.nome} (${estudanteLogado.bairro})` : 'Faça login ou crie sua conta'}
                        </p>
                    </div>
                    <Link to="/" style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.9rem' }}>
                        &larr; Voltar à tela inicial
                    </Link>
                </div>

                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />

                {!estudanteLogado ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', backgroundColor: '#fdfdfd', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>

                        {/* LOGIN */}
                        <div>
                            <h3 style={{ marginTop: 0, color: '#333' }}>Fazer Login</h3>
                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>E-mail:</label>
                                    <input type="email" placeholder="Digite seu e-mail" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Senha:</label>
                                    <input type="password" placeholder="Digite sua senha" value={senhaLogin} onChange={e => setSenhaLogin(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px' }}>
                                    Entrar
                                </button>
                            </form>
                        </div>

                        {/* CADASTRO */}
                        <div>
                            <h3 style={{ marginTop: 0, color: '#333' }}>Criar Conta</h3>
                            <form onSubmit={handleCadastrarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input type="text" placeholder="Nome Completo" value={nomeUsuario} onChange={e => setNomeUsuario(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <input type="email" placeholder="E-mail" value={emailUsuario} onChange={e => setEmailUsuario(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <input type="password" placeholder="Senha" value={senhaUsuario} onChange={e => setSenhaUsuario(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <input type="number" placeholder="Idade (Mínimo 18 anos)" value={idadeUsuario} onChange={e => setIdadeUsuario(e.target.value)} min="1" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <input type="text" placeholder="Cidade e estado (ex: São Paulo - SP)" value={bairroUsuario} onChange={e => setBairroUsuario(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <textarea placeholder="Breve biografia / objetivos" value={bioUsuario} onChange={e => setBioUsuario(e.target.value)} rows="2" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <button type="submit" style={{ padding: '8px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Registar
                                </button>
                            </form>
                        </div>

                    </div>
                ) : (
                    /* PAINEL LOGADO */
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e2f0d9', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <div>
                                <strong>Conta Ativa:</strong> {estudanteLogado.nome} | <strong>Cidade e Estado:</strong> {estudanteLogado.bairro}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => {
                                        setEditandoPerfil(!editandoPerfil);
                                        if (!editandoPerfil) {
                                            setNomeEdit(estudanteLogado.nome || '');
                                            setEmailEdit(estudanteLogado.email || '');
                                            setSenhaEdit(estudanteLogado.senha || '');
                                            setBairroEdit(estudanteLogado.bairro || '');
                                            setBioEdit(estudanteLogado.bio || '');
                                        }
                                    }}
                                    style={{ padding: '6px 12px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                >
                                    {editandoPerfil ? 'Cancelar Edição' : 'Editar Perfil'}
                                </button>
                                <button
                                    onClick={() => setEstudanteLogado(null)}
                                    style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Terminar Sessão
                                </button>
                                <button
                                    onClick={handleExcluirConta}
                                    style={{ padding: '6px 12px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Excluir Conta
                                </button>
                            </div>
                        </div>

                        {/* FORMULÁRIO DE EDIÇÃO DE PERFIL (UPDATE) */}
                        {editandoPerfil && (
                            <section style={{ marginBottom: '30px', backgroundColor: '#fffbe6', padding: '20px', borderRadius: '8px', border: '1px solid #ffe58f' }}>
                                <h3 style={{ marginTop: 0, color: '#d48806' }}>Atualizar Meus Dados de Estudante</h3>
                                <form onSubmit={handleAtualizarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Nome Completo:</label>
                                        <input type="text" value={nomeEdit} onChange={e => setNomeEdit(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>E-mail:</label>
                                        <input type="email" value={emailEdit} onChange={e => setEmailEdit(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Senha:</label>
                                        <input type="password" value={senhaEdit} onChange={e => setSenhaEdit(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Cidade e Estado:</label>
                                        <input type="text" value={bairroEdit} onChange={e => setBairroEdit(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Biografia:</label>
                                        <textarea value={bioEdit} onChange={e => setBioEdit(e.target.value)} rows="2" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <button type="submit" style={{ padding: '10px', backgroundColor: '#faad14', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        Salvar Alterações
                                    </button>
                                </form>
                            </section>
                        )}

                        {/* AGENDAR NOVA MENTORIA */}
                        <section style={{ marginBottom: '40px', backgroundColor: '#f9f9f9', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                            <h2 style={{ marginTop: 0 }}>Agendar Nova Mentoria</h2>
                            <form onSubmit={handleCadastrarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Selecionar Mentor:</label>
                                    <select value={mentorId} onChange={(e) => setMentorId(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                        <option value="">-- Escolhe um Especialista --</option>
                                        {mentores.map(m => (
                                            <option key={m.id} value={m.id}>{m.nome} — {m.especialidade}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data e Hora da Sessão:</label>
                                    <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Observações / Tópicos a Discutir:</label>
                                    <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>

                                <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Confirmar Agendamento
                                </button>
                            </form>
                        </section>

                        {/* LISTAGEM DE MENTORIAS COM OPÇÃO DE ALTERAR DATA E EXCLUIR */}
                        <section>
                            <h2>Minhas Mentorias Agendadas</h2>
                            {loading && <p>A carregar...</p>}
                            {!loading && minhasMentorias.length === 0 && <p style={{ color: '#666' }}>Ainda não tem nenhuma mentoria agendada.</p>}

                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {minhasMentorias.map(ag => (
                                    <li key={ag.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #c3e6cb', borderRadius: '8px', backgroundColor: '#f4f9f4' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <strong>Data e Hora:</strong> {new Date(ag.dataHora).toLocaleString()} <br />
                                                <strong>Mentor:</strong> {ag.mentor?.nome || 'N/D'} ({ag.mentor?.especialidade}) <br />
                                                <strong>Observações:</strong> {ag.observacoes || 'Nenhuma'} <br />
                                                <span style={{ display: 'inline-block', marginTop: '8px', padding: '3px 8px', backgroundColor: '#28a745', color: '#fff', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                    Status: {ag.status}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => {
                                                        setAgendamentoEmEdicao(ag.id === agendamentoEmEdicao ? null : ag.id);
                                                        setNovaDataHora('');
                                                    }}
                                                    style={{ padding: '8px 12px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                                >
                                                    {agendamentoEmEdicao === ag.id ? 'Fechar' : 'Alterar Data'}
                                                </button>

                                                <button
                                                    onClick={() => handleExcluirAgendamento(ag.id)}
                                                    style={{ padding: '8px 12px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>

                                        {/* FORMULÁRIO DE EDIÇÃO DE DATA (EXPANSÍVEL) */}
                                        {agendamentoEmEdicao === ag.id && (
                                            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff', border: '1px dashed #28a745', borderRadius: '6px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.85rem' }}>Nova Data e Hora:</label>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <input
                                                        type="datetime-local"
                                                        value={novaDataHora}
                                                        onChange={e => setNovaDataHora(e.target.value)}
                                                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    />
                                                    <button
                                                        onClick={() => handleAlterarDataAgendamento(ag)}
                                                        style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                    >
                                                        Salvar Nova Data
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                )}
            </div>

            {/* RODAPÉ PROFISSIONAL */}
            <footer style={{ marginTop: '50px', padding: '20px 0', textAlign: 'center', borderTop: '1px solid #eaeaea', color: '#666', fontSize: '0.85rem' }}>
                <p style={{ margin: '0 0 5px 0' }}>Precisa de ajuda ou suporte? Entre em contato pelo e-mail: <strong>suporte@raiztech.com</strong></p>
                <p style={{ margin: 0, color: '#888' }}>&copy; 2026 Raiz Tech. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}