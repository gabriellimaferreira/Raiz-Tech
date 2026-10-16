# 🌿 Raiz Tech

> **Objetivo:** Um portal comunitário de mentoria de carreira e acesso a recursos de requalificação profissional para adultos.

Plataforma web desenvolvida para conectar estudantes de comunidades e periferias a mentores especializados em tecnologia, promovendo partilha de conhecimento, agendamento de mentorias e acesso a recursos educativos abertos.

---

## 🎯 Alinhamento com os ODS (Objetivos de Desenvolvimento Sustentável)

O **Raiz Tech** foi concebido e estruturado com foco direto na transformação social e no impacto comunitário, alinhado às metas globais da ONU:

* 📘 **ODS 4 – Educação de Qualidade:** Promove o acesso a recursos educativos abertos, artigos técnicos, videoaulas e mentorias de requalificação profissional para jovens e adultos.
* 🤝 **ODS 10 – Redução das Desigualdades:** Democratiza o acesso a profissionais do mercado de tecnologia para estudantes da periferia, encurtando distâncias e gerando oportunidades de inserção no mercado de trabalho.

---

## 🚀 Módulos e CRUDs do Sistema

A aplicação é sustentada por **3 CRUDs completos** que garantem a gestão dos utilizadores e das sessões:

1. **CRUD de Usuários (Estudantes da periferia):**
   * **Create:** Registo de novos estudantes com dados de localização (bairro) e objetivos de carreira.
   * **Read:** Consulta e autenticação dos dados do estudante.
   * **Update:** Atualização de perfil e informações pessoais.
   * **Delete:** Opção de exclusão definitiva da conta de estudante.

2. **CRUD de Mentores (Profissionais dispostos a orientar):**
   * **Create:** Registo de mentores com especificação de áreas de atuação (Java, React, SQL, etc.) e contatos.
   * **Read:** Listagem pública de mentores disponíveis e verificação de perfil de acesso.
   * **Update:** Edição de dados do especialista e biografia.
   * **Delete:** Exclusão do perfil voluntário de mentoria.

3. **CRUD de Agendamentos (Sessões de Mentoria):**
   * **Create:** Agendamento de sessão entre estudante e mentor com definição de data, hora e tópicos a discutir.
   * **Read:** Visualização de agenda personalizada tanto no painel do estudante quanto no painel do mentor.
   * **Update:** Alteração de data e horário de mentorias já marcadas.
   * **Delete:** Cancelamento ou exclusão de agendamentos por ambas as partes.

---

## 🛠️ Tecnologias Utilizadas

### Front-end:
* **ReactJS**
* **Vite** (Ferramenta de build e desenvolvimento rápida utilizada para estruturar e rodar a aplicação React)
* **Axios** (Para requisições HTTP e consumo da API REST)
* **React Router DOM** (Para navegação entre páginas e gestão de rotas)

### Back-end:
* **Java 21**
* **Spring Boot / Spring Web** (Framework utilizado para gerar e estruturar o projeto na web através da criação de APIs RESTful)
* **Spring Initializr** (Utilizado na inicialização e bootstrapping do projeto Spring)
* **Spring Data JPA**
* **Hibernate** (ORM responsável por implementar a abordagem **Code First**, gerando e mapeando automaticamente as tabelas e relacionamentos do banco de dados MySQL a partir das entidades Java)
* **Maven** (Gerenciador de dependências)

### Banco de Dados & Infraestrutura:
* **MySQL em Contentor Docker** (O banco de dados roda isolado dentro de um container Docker, garantindo fácil portabilidade e ambiente padronizado)
* **Tomcat Server** (Servidor web embutido no Spring Boot)

---

## ⚙️ Arquitetura e Decisões Técnicas

* **Abordagem Code First com Hibernate:** As entidades Java (`Usuario`, `Mentor`, `Agendamento`, `Recurso`) definem a estrutura relacional do sistema. O Hibernate mapeia e cria automaticamente as tabelas e chaves estrangeiras.
* **Mural de Recursos de Acesso Livre (SEO):** O mural exibe conteúdos educativos (artigos, videoaulas e tutoriais). O acesso é público e indexável, permitindo que estudantes encontrem o conteúdo organicamente no Google e descubram as mentorias gratuitas disponíveis.
* **Ambiente isolado em Docker:** Facilita a execução da aplicação em qualquer máquina sem necessidade de instalar o MySQL nativamente.

---

## 📋 Pré-requisitos

Certifique-se de ter instalado:
* **Java Development Kit (JDK 21+)**
* **Node.js (v18+)**
* **Docker**
* **Maven**

---

## 🚀 Como Executar a Aplicação

### 1. Subir o Banco de Dados (Docker)
```bash
docker run --name mysql-raiztech -e MYSQL_ROOT_PASSWORD=suasenhasecreta -e MYSQL_DATABASE=db_conexao_periferia -p 3306:3306 -d mysql:8.0
```

### 2. Executar o Back-end (Spring Boot)
1. Verifique as credenciais no arquivo `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/db_conexao_periferia?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=suasenhasecreta
   spring.jpa.hibernate.ddl-auto=update
   ```
2. Execute a aplicação Spring Boot:
   ```bash
   mvn spring-boot:run
   ```
   *(O backend rodará na porta `8081`)*.

### 3. Executar o Front-end (React + Vite)
1. Acesse a pasta do front-end e inicie o servidor:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Acesse no navegador: `http://localhost:5173`

---

## 📈 O que Pode Ser Melhorado (Próximos Passos)

* **Chat Interno na Plataforma:** Criar um chat em tempo real para permitir que o estudante e o mentor conversem diretamente antes e depois dos agendamentos.
* **Integração com Google Meet:** Implementar geração automática de links de reuniões do Google Meet no momento em que um agendamento for realizado.
* **Validação Rígida de Calendário:** Aprimorar as regras no front-end e back-end para bloquear o agendamento em datas e horários passados, permitindo selecionar apenas datas futuras.
* **Otimização de SEO no Painel de Recursos:** Expandir a indexação das videoaulas e artigos educativos livres para atrair estudantes que buscam conteúdos de T.I. no Google, direcionando-os para os serviços de mentoria voluntária do site.
* **Autenticação Segura (JWT):** Adicionar Spring Security com validação por tokens JWT e criptografia de senhas.

---

## 📄 Licença

Projeto desenvolvido para o programa **Recode Pro 2026**.
```
eof

Gerei o arquivo `README.md` completo com todas as modificações solicitadas. Basta incluir esse arquivo na raiz do repositório para a entrega do projeto no GitHub!