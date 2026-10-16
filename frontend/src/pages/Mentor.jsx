import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Mentor() {
    const [mentores, setMentores] = useState([]);
    const [mentorLogado, setMentorLogado] = useState(null);
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados de Login
    const [emailLogin, setEmailLogin] = useState('');
    const [senhaLogin, setSenhaLogin] = useState('');

    // Estados de Cadastro
    const [nome, setNome] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [bio, setBio] = useState('');
    const [contato, setContato] = useState('');
    const [senha, setSenha] = useState('');
    const [idadeMentor, setIdadeMentor] = useState('');

    // Estados de Edição de Perfil (UPDATE de Mentor)
    const [editandoPerfil, setEditandoPerfil] = useState(false);
    const [nomeEdit, setNomeEdit] = useState('');
    const [especialidadeEdit, setEspecialidadeEdit] = useState('');
    const [bioEdit, setBioEdit] = useState('');
    const [contatoEdit, setContatoEdit] = useState('');
    const [senhaEdit, setSenhaEdit] = useState('');

    const carregarDados = () => {
        setLoading(true);
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

    // LOGIN PARA MENTOR 
    const handleLogin = (e) => {
        e.preventDefault();
        const digitoLogin = emailLogin.trim().toLowerCase();

        const mentorEncontrado = mentores.find(m => {
            const contatoBanco = (m.contato || '').trim().toLowerCase();
            const emailBanco = (m.email || '').trim().toLowerCase();

            const matchContato = contatoBanco === digitoLogin || emailBanco === digitoLogin;
            const matchSenha = !m.senha || String(m.senha) === String(senhaLogin);

            return matchContato && matchSenha;
        });

        if (mentorEncontrado) {
            setMentorLogado(mentorEncontrado);
            setEmailLogin('');
            setSenhaLogin('');
        } else {
            alert('E-mail/Contato ou senha incorretos. Verifique os dados.');
        }
    };

    const handleCadastrarMentor = (e) => {
        e.preventDefault();

        // Validação de maioridade (mínimo 18 anos)
        if (parseInt(idadeMentor) < 18) {
            alert('Cadastro não permitido. O Raiz Tech exige idade mínima de 18 anos para mentores.');
            return;
        }

        api.post('/mentores', {
            nome: nome,
            especialidade: especialidade,
            bio: bio,
            contato: contato,
            senha: senha
        })
            .then(res => {
                alert('Mentor cadastrado com sucesso! Fazer login agora.');
                setNome(''); setEspecialidade(''); setBio(''); setContato(''); setSenha(''); setIdadeMentor('');
                carregarDados();
                setMentorLogado(res.data);
            })
            .catch(err => { console.error(err); alert('Erro ao cadastrar mentor.'); });
    };

    // UPDATE: Atualizar Perfil do Mentor
    const handleAtualizarPerfil = (e) => {
        e.preventDefault();
        if (!mentorLogado) return;

        api.put(`/mentores/${mentorLogado.id}`, {
            nome: nomeEdit,
            especialidade: especialidadeEdit,
            bio: bioEdit,
            contato: contatoEdit,
            senha: senhaEdit
        })
            .then(res => {
                alert('Perfil de mentor atualizado com sucesso!');
                setMentorLogado(res.data);
                setEditandoPerfil(false);
                carregarDados();
            })
            .catch(err => {
                console.error("Erro ao atualizar perfil de mentor:", err);
                alert('Erro ao atualizar o perfil. Verifica os dados.');
            });
    };

    // DELETE: Cancelar Mentoria pela visão do Mentor
    const handleExcluirAgendamento = (idAgendamento) => {
        if (window.confirm('Tem certeza que pretende cancelar esta mentoria da sua agenda?')) {
            api.delete(`/agendamentos/${idAgendamento}`)
                .then(() => {
                    alert('Mentoria cancelada com sucesso.');
                    carregarDados();
                })
                .catch(err => { console.error(err); alert('Erro ao cancelar agendamento.'); });
        }
    };

    // DELETE: Excluir Perfil de Mentor
    const handleExcluirConta = () => {
        if (window.confirm('Atenção: Esta ação é irreversível. Deseja mesmo excluir o seu perfil de mentor e todos os dados associados?')) {
            api.delete(`/mentores/${mentorLogado.id}`)
                .then(() => {
                    alert('Perfil de mentor excluido com sucesso.');
                    setMentorLogado(null);
                    carregarDados();
                })
                .catch(err => { console.error(err); alert('Erro para excluir perfil de mentor.'); });
        }
    };

    const minhaAgenda = agendamentos.filter(ag => ag.mentor?.id === mentorLogado?.id);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
            <div style={{ flex: 1 }}>
                {/* CABEÇALHO */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ color: '#007bff', margin: '0 0 5px 0' }}>Área do Mentor</h1>
                        <p style={{ color: '#666', margin: 0 }}>
                            {mentorLogado ? `Sessão ativa: ${mentorLogado.nome} (${mentorLogado.especialidade})` : 'Faça login ou crie sua conta'}
                        </p>
                    </div>
                    <Link to="/" style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.9rem' }}>
                        &larr; Voltar à tela inicial
                    </Link>
                </div>

                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />

                {!mentorLogado ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', backgroundColor: '#fdfdfd', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>

                        {/* LOGIN */}
                        <div>
                            <h3 style={{ marginTop: 0, color: '#333' }}>Fazer Login</h3>
                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>E-mail:</label>
                                    <input type="text" placeholder="Digite seu e-mail" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
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
                            <h3 style={{ marginTop: 0, color: '#333' }}>Cadastre-se</h3>
                            <form onSubmit={handleCadastrarMentor} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <input type="text" placeholder="Especialidade (ex: Java, React)" value={especialidade} onChange={e => setEspecialidade(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <textarea placeholder="Breve biografia / experiência" value={bio} onChange={e => setBio(e.target.value)} required rows="2" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <input type="number" placeholder="Idade (Mínimo 18 anos)" value={idadeMentor} onChange={e => setIdadeMentor(e.target.value)} min="1" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <input type="text" placeholder="E-mail" value={contato} onChange={e => setContato(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <button type="submit" style={{ padding: '8px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Registar
                                </button>
                            </form>
                        </div>

                    </div>
                ) : (
                    /* PAINEL LOGADO */
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#cce5ff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <div>
                                <strong>Mentor Ativo:</strong> {mentorLogado.nome} | <strong>Especialidade:</strong> {mentorLogado.especialidade} | <strong>Contato:</strong> {mentorLogado.contato}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => {
                                        setEditandoPerfil(!editandoPerfil);
                                        if (!editandoPerfil) {
                                            setNomeEdit(mentorLogado.nome || '');
                                            setEspecialidadeEdit(mentorLogado.especialidade || '');
                                            setBioEdit(mentorLogado.bio || '');
                                            setContatoEdit(mentorLogado.contato || '');
                                            setSenhaEdit(mentorLogado.senha || '');
                                        }
                                    }}
                                    style={{ padding: '6px 12px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                >
                                    {editandoPerfil ? 'Cancelar Edição' : 'Editar Perfil'}
                                </button>
                                <button
                                    onClick={() => setMentorLogado(null)}
                                    style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Terminar Sessão
                                </button>
                                <button
                                    onClick={handleExcluirConta}
                                    style={{ padding: '6px 12px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Excluir Perfil
                                </button>
                            </div>
                        </div>

                        {/* FORMULÁRIO DE EDIÇÃO DE PERFIL (UPDATE) */}
                        {editandoPerfil && (
                            <section style={{ marginBottom: '30px', backgroundColor: '#fffbe6', padding: '20px', borderRadius: '8px', border: '1px solid #ffe58f' }}>
                                <h3 style={{ marginTop: 0, color: '#d48806' }}>Atualizar Meu Perfil de Mentor</h3>
                                <form onSubmit={handleAtualizarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Nome Completo:</label>
                                        <input type="text" value={nomeEdit} onChange={e => setNomeEdit(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Especialidade:</label>
                                        <input type="text" value={especialidadeEdit} onChange={e => setEspecialidadeEdit(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Biografia:</label>
                                        <textarea value={bioEdit} onChange={e => setBioEdit(e.target.value)} rows="2" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>E-mail / Contato:</label>
                                        <input type="text" value={contatoEdit} onChange={e => setContatoEdit(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>Senha:</label>
                                        <input type="password" value={senhaEdit} onChange={e => setSenhaEdit(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    </div>
                                    <button type="submit" style={{ padding: '10px', backgroundColor: '#faad14', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        Salvar Alterações
                                    </button>
                                </form>
                            </section>
                        )}

                        <section>
                            <h2>Agenda de Mentorias</h2>
                            {loading && <p>A carregar agenda...</p>}
                            {!loading && minhaAgenda.length === 0 && <p style={{ color: '#666' }}>Ainda não tem nenhuma mentoria agendada.</p>}

                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {minhaAgenda.map(ag => (
                                    <li key={ag.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #b8daff', borderRadius: '8px', backgroundColor: '#f0f8ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>Data e Hora:</strong> {new Date(ag.dataHora).toLocaleString()} <br />
                                            <strong>Estudante:</strong> {ag.usuario?.nome || 'N/D'} (Cidade e Estado: {ag.usuario?.bairro || 'N/D'}) <br />
                                            <strong>Email do Estudante:</strong> {ag.usuario?.email || 'N/D'} <br />
                                            <strong>Observações / Tópicos:</strong> {ag.observacoes || 'Nenhuma'} <br />
                                            <span style={{ display: 'inline-block', marginTop: '8px', padding: '3px 8px', backgroundColor: '#004085', color: '#fff', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                Status: {ag.status}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleExcluirAgendamento(ag.id)}
                                            style={{ padding: '8px 12px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                        >
                                            Cancelar Mentoria
                                        </button>
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