import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
    const [recursos, setRecursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carregar recursos públicos para o mural da Home
        api.get('/recursos')
            .then(res => {
                setRecursos(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar recursos:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
            <div style={{ flex: 1 }}>
                {/* CABEÇALHO / HERO */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '10px' }}>Raiz Tech</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                        Conectando talentos com mentores e recursos essenciais.
                    </p>
                </div>

                {/* BOTÕES DE NAVEGAÇÃO PRINCIPAL */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
                    <Link
                        to="/estudante"
                        style={{ padding: '12px 24px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem' }}
                    >
                        Área do Estudante
                    </Link>
                    <Link
                        to="/mentor"
                        style={{ padding: '12px 24px', backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem' }}
                    >
                        Área do Mentor
                    </Link>
                </div>

                <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />

                {/* MURAL DE RECURSOS PÚBLICOS */}
                <section>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Mural de Recursos e Oportunidades</h2>
                    {loading && <p>A carregar recursos públicos...</p>}
                    {!loading && recursos.length === 0 && <p style={{ color: '#666' }}>Nenhum recurso publicado no momento.</p>}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                        {recursos.map(rec => (
                            <div key={rec.id} style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fcfcfc', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ marginTop: 0, color: '#0056b3', fontSize: '1.2rem' }}>{rec.titulo}</h3>
                                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.4' }}>{rec.descricao}</p>
                                {rec.link && (
                                    <a
                                        href={rec.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ display: 'inline-block', marginTop: '10px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}
                                    >
                                        Aceder ao Recurso &rarr;
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* RODAPE */}
            <footer style={{ marginTop: '60px', padding: '20px 0', textAlign: 'center', borderTop: '1px solid #eaeaea', color: '#666', fontSize: '0.85rem' }}>
                <p style={{ margin: '0 0 5px 0' }}>Precisa de ajuda ou suporte? Entre em contato pelo e-mail: <strong>suporte@raiztech.com</strong></p>
                <p style={{ margin: 0, color: '#888' }}>&copy; 2026 Raiz Tech. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}