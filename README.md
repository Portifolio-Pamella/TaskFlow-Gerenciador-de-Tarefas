# TaskFlow — Gerenciador de Tarefas

CP3 - Mobile
Pamella Christiny Chaves Brito | RM565206 | TDSPX

Aplicativo mobile desenvolvido com **React Native**, **Expo** e **Firebase**, com o objetivo de auxiliar estudantes na organização de suas atividades acadêmicas, prazos e prioridades.

O TaskFlow permite que cada usuário tenha sua própria conta e gerencie suas tarefas de maneira simples, organizada e sincronizada com o banco de dados em nuvem.

---

# 1. Definição do aplicativo

## 1.1. Proposta

O **TaskFlow** é um aplicativo de gerenciamento de tarefas desenvolvido para estudantes que precisam organizar suas atividades acadêmicas, acompanhar prazos e manter o controle de suas responsabilidades.

A proposta surgiu da necessidade de centralizar as tarefas em um único ambiente, permitindo que o usuário registre suas atividades, defina prioridades e acompanhe o que já foi concluído e o que ainda precisa ser realizado.

O aplicativo utiliza autenticação de usuários pelo Firebase Authentication e armazenamento de dados no Cloud Firestore, garantindo que cada usuário tenha acesso somente às suas próprias tarefas.

## 1.2. Objetivo

O principal objetivo do TaskFlow é facilitar a organização da rotina de estudos, oferecendo uma ferramenta intuitiva para administrar atividades acadêmicas.

Entre os objetivos específicos estão:

- Facilitar o cadastro e o gerenciamento de tarefas.
- Permitir a definição de prioridades.
- Acompanhar o andamento das atividades.
- Organizar tarefas por status.
- Armazenar os dados em nuvem.
- Garantir que cada usuário tenha acesso individual às suas informações.

## 1.3. Público-alvo

O aplicativo é destinado principalmente a estudantes que precisam organizar trabalhos, provas, projetos, atividades e outras responsabilidades acadêmicas.

## 1.4. Funcionalidades

### Autenticação de usuários

- Cadastro de novas contas utilizando e-mail e senha.
- Login de usuários cadastrados.
- Logout da conta.
- Manutenção da sessão autenticada.

### Gerenciamento de tarefas

- Criar novas tarefas.
- Listar tarefas cadastradas.
- Editar informações de uma tarefa.
- Excluir tarefas.
- Concluir tarefas.
- Reabrir tarefas concluídas.

### Organização

Cada tarefa possui as seguintes informações:

| Campo | Descrição |
|---|---|
| Título | Nome da atividade |
| Descrição | Detalhes adicionais da tarefa |
| Prioridade | Baixa, Média ou Alta |
| Data de entrega | Prazo opcional no formato DD/MM/AAAA |
| Status | Pendente ou Concluída |

### Filtros e acompanhamento

O usuário pode visualizar suas atividades por meio de três filtros:

- **Todas:** apresenta todas as tarefas cadastradas.
- **Pendentes:** apresenta somente as atividades que ainda precisam ser realizadas.
- **Concluídas:** apresenta as atividades finalizadas.

O aplicativo também apresenta informações de acompanhamento para facilitar a visualização das tarefas.

## 1.5. Tecnologias utilizadas

| Tecnologia | Aplicação no projeto |
|---|---|
| React Native | Desenvolvimento da interface mobile |
| JavaScript | Linguagem utilizada na aplicação |
| Expo | Ambiente de desenvolvimento e execução |
| Firebase Authentication | Cadastro e autenticação dos usuários |
| Cloud Firestore | Banco de dados NoSQL em nuvem |
| AsyncStorage | Persistência local da sessão no ambiente nativo |
| Git e GitHub | Versionamento e hospedagem do código |

---

# 2. Estrutura do projeto

O projeto foi organizado em diretórios para separar as responsabilidades e facilitar a manutenção do código.

```text
TaskFlow/
│
├── src/
│   │
│   ├── components/
│   │   └── TaskCard.js
│   │
│   ├── screens/
│   │   └── TaskFlowScreen.js
│   │
│   ├── services/
│   │   ├── firebaseConfig.js
│   │   ├── firebaseConfig.native.js
│   │   ├── authService.js
│   │   └── taskService.js
│   │
│   └── styles/
│       └── colors.js
│
├── App.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Responsabilidade dos arquivos

- **App.js:** ponto de entrada da aplicação.
- **TaskFlowScreen.js:** concentra a tela principal, os formulários, a autenticação e a interação com as tarefas.
- **TaskCard.js:** componente responsável pela apresentação individual de cada tarefa.
- **authService.js:** reúne as operações de cadastro, login, logout e tratamento de erros de autenticação.
- **taskService.js:** concentra as operações de criação, consulta, edição, conclusão e exclusão de tarefas no Firestore.
- **firebaseConfig.js:** configura a conexão com o Firebase para a versão Web.
- **firebaseConfig.native.js:** configura o Firebase para Android e iOS, incluindo a integração com AsyncStorage para persistência da autenticação.
- **colors.js:** centraliza as cores utilizadas na interface.

---

# 3. Conceitos utilizados no projeto

Nesta seção são apresentados os principais conceitos de desenvolvimento utilizados na construção do TaskFlow e como eles foram aplicados na prática.

## 3.1. React Native

O React Native é um framework que permite desenvolver aplicações mobile utilizando JavaScript e componentes do React.

No TaskFlow, foi utilizado para construir a interface do aplicativo, permitindo que os usuários interajam com formulários, botões, filtros e listas de tarefas.

Entre os componentes utilizados estão:

- `View`: organiza os elementos da interface.
- `Text`: apresenta textos.
- `TextInput`: permite inserir informações.
- `TouchableOpacity`: cria elementos interativos.
- `ScrollView`: permite a rolagem do conteúdo.
- `ActivityIndicator`: apresenta um indicador de carregamento.

A interface foi construída com componentes nativos do React Native, sem utilizar páginas HTML como estrutura principal do aplicativo.

## 3.2. Componentização

A componentização consiste em dividir a interface em partes menores, independentes e reutilizáveis.

No TaskFlow, esse conceito foi aplicado por meio do componente `TaskCard.js`, responsável por apresentar as informações de uma tarefa.

Em vez de escrever toda a estrutura visual de cada tarefa diretamente na tela principal, o componente é reutilizado para apresentar os diferentes registros.

Essa organização facilita a manutenção, evita repetição de código e torna a aplicação mais organizada.

## 3.3. Separação de responsabilidades

O projeto utiliza uma organização em camadas, separando a interface das operações de autenticação e banco de dados.

Essa separação pode ser observada em três partes:

- **Interface:** responsável pela apresentação dos dados e interação com o usuário.
- **Serviços:** responsáveis pelas operações de autenticação e comunicação com o Firestore.
- **Estilos:** responsáveis pela organização visual da aplicação.

Por exemplo, quando o usuário cadastra uma tarefa, a tela principal coleta as informações e chama uma função do `taskService.js`, que realiza a operação no Firestore.

Dessa maneira, a tela não precisa concentrar diretamente todos os detalhes de comunicação com o banco de dados.

## 3.4. Firebase Authentication

O Firebase Authentication é um serviço utilizado para autenticar usuários.

No TaskFlow, ele permite que cada pessoa tenha sua própria conta por meio de e-mail e senha.

Foram utilizadas as seguintes operações:

- `createUserWithEmailAndPassword`: realiza o cadastro de um novo usuário.
- `signInWithEmailAndPassword`: realiza o login.
- `signOut`: encerra a sessão.
- `onAuthStateChanged`: acompanha alterações no estado de autenticação.

O listener `onAuthStateChanged` é importante porque permite identificar se existe um usuário autenticado e atualizar a interface de acordo com essa informação.

Assim, o aplicativo apresenta a área de acesso quando não existe uma sessão ativa e o painel de tarefas quando o usuário está autenticado.

## 3.5. Persistência de autenticação

A persistência permite manter o estado da autenticação mesmo quando o aplicativo é fechado e aberto novamente.

No ambiente nativo, o projeto utiliza o AsyncStorage integrado ao Firebase Authentication por meio de `getReactNativePersistence`.

Isso permite que a sessão seja armazenada localmente, evitando que o usuário precise realizar o login novamente a cada abertura do aplicativo.

## 3.6. Cloud Firestore

O Cloud Firestore é um banco de dados NoSQL disponibilizado pelo Firebase.

Diferentemente de bancos de dados relacionais tradicionais, ele organiza as informações em coleções e documentos.

No TaskFlow, foi criada a coleção:

` tarefas `

Cada documento representa uma tarefa cadastrada e armazena informações como:

```javascript
{
  userId: "identificador_do_usuario",
  titulo: "Estudar React Native",
  descricao: "Revisar os conceitos de componentes",
  prioridade: "Alta",
  dataEntrega: "10/11/2026",
  status: "Pendente",
  createdAt: "Timestamp do Firebase"
}
```

O campo `userId` identifica o usuário responsável pela tarefa.

Essa informação permite relacionar os registros ao usuário autenticado e realizar consultas individuais.

## 3.7. CRUD

CRUD é uma sigla que representa as quatro operações básicas de manipulação de dados:

- **Create:** criar registros.
- **Read:** consultar registros.
- **Update:** atualizar registros.
- **Delete:** excluir registros.

No TaskFlow, essas operações foram implementadas da seguinte maneira:

| Operação | Aplicação no TaskFlow |
|---|---|
| Create | Cadastro de novas tarefas |
| Read | Listagem das tarefas do usuário |
| Update | Edição de informações e alteração do status |
| Delete | Exclusão de tarefas |

As operações são organizadas no arquivo `taskService.js`, que utiliza as funções disponibilizadas pelo SDK do Firebase.

## 3.8. Atualização em tempo real

O Firestore disponibiliza listeners que permitem acompanhar alterações nos dados armazenados.

No projeto, foi utilizado o método `onSnapshot` para acompanhar as tarefas do usuário.

Isso significa que, quando uma tarefa é criada, editada, concluída ou excluída, a lista pode ser atualizada automaticamente, sem que seja necessário realizar uma nova consulta manual a cada alteração.

O listener também é filtrado pelo identificador do usuário autenticado.

## 3.9. Estados e eventos

O React utiliza estados para controlar informações que podem mudar durante a execução da aplicação.

No TaskFlow, foi utilizado o hook `useState` para armazenar informações como:

- Usuário autenticado.
- Lista de tarefas.
- Filtro selecionado.
- Dados preenchidos no formulário.
- Tarefa em edição.
- Mensagens de retorno.
- Estados de carregamento.

Também foi utilizado o hook `useEffect` para executar operações relacionadas ao ciclo de vida da tela, como acompanhar o estado da autenticação e iniciar o listener das tarefas.

Os eventos são responsáveis por executar ações a partir da interação do usuário, como pressionar um botão para salvar, editar, concluir ou excluir uma tarefa.

## 3.10. Segurança e isolamento dos dados

Um dos cuidados importantes do projeto foi garantir que cada usuário tenha acesso somente às próprias tarefas.

Para isso, cada documento possui um campo `userId`, preenchido com o identificador do usuário autenticado.

Além disso, as regras de segurança do Firestore verificam a autenticação e comparam o identificador do usuário com o proprietário do documento.

Dessa forma, as operações de leitura, criação, atualização e exclusão são autorizadas de acordo com o usuário autenticado.

O filtro utilizado nas consultas do aplicativo também considera o `userId`, evitando que a aplicação solicite tarefas de outros usuários.

## 3.11. Validação e tratamento de erros

O projeto utiliza validações para evitar o envio de informações inválidas.

Entre os cuidados implementados nos serviços estão:

- Verificação da existência do usuário.
- Validação do título da tarefa.
- Limite de caracteres para o título.
- Validação das prioridades disponíveis.
- Verificação do formato e da validade da data de entrega.
- Verificação dos identificadores utilizados nas operações.

Também são tratados erros relacionados à autenticação, como e-mail inválido, senha incorreta, conta já cadastrada e falhas de conexão.

Esses tratamentos permitem apresentar mensagens mais claras ao usuário e ajudam a evitar operações com dados inconsistentes.

---

# 4. Configuração e execução do projeto

## 4.1. Pré-requisitos

Para executar o TaskFlow, é necessário ter instalado:

- Node.js e npm.
- Expo.
- Visual Studio Code ou outro editor de código.
- Expo Go para testar em um dispositivo físico, se desejado.
- Uma conta no Firebase.

## 4.2. Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd TaskFlow
```

Instale as dependências:

```bash
npm install
```

## 4.3. Configuração do Firebase

Crie um projeto no Firebase Console e adicione um aplicativo Web para obter as credenciais de configuração.

Ative o método de autenticação **E-mail/Senha** em:

Firebase Console → Authentication → Sign-in method.

Crie o banco de dados em:

Firebase Console → Firestore Database.

Na raiz do projeto, crie um arquivo chamado `.env` com as seguintes variáveis:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Preencha os valores com as credenciais do seu próprio projeto Firebase.

**Importante:** o arquivo `.env` contém configurações específicas do projeto e não deve ser enviado ao GitHub. Utilize o `.env.example` como modelo, sem inserir credenciais reais.

## 4.4. Regras do Firestore

As regras de segurança devem permitir que cada usuário acesse somente os documentos associados ao próprio identificador.

Exemplo das regras utilizadas:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /tarefas/{taskId} {

      allow read: if request.auth != null
                  && resource.data.userId == request.auth.uid;

      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;

      allow update: if request.auth != null
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == resource.data.userId;

      allow delete: if request.auth != null
                    && resource.data.userId == request.auth.uid;
    }
  }
}
```

Essas regras devem ser publicadas no Firebase Console para que as operações do aplicativo sejam autorizadas.

## 4.5. Executando o aplicativo

Para iniciar o ambiente de desenvolvimento, execute:

```bash
npx expo start
```

Para iniciar limpando o cache do Expo:

```bash
npx expo start -c
```

Após iniciar, utilize o QR Code apresentado no terminal para abrir o aplicativo pelo Expo Go ou execute no ambiente Web, caso esteja configurado.

---

# 5. Considerações finais

O desenvolvimento do TaskFlow permitiu aplicar conceitos de desenvolvimento mobile, componentização, gerenciamento de estados, autenticação, persistência de dados e operações CRUD utilizando serviços do Firebase.

Além da implementação das funcionalidades, a organização do projeto buscou separar responsabilidades e facilitar a manutenção do código.

A utilização do Firebase Authentication e do Cloud Firestore possibilitou construir uma aplicação com contas individuais e armazenamento de tarefas em nuvem.

O projeto também reforçou a importância de compreender a lógica por trás das funcionalidades, validar informações e considerar a segurança dos dados durante o desenvolvimento.

**TaskFlow — Organize suas tarefas. Acompanhe seu progresso. Conquiste seus objetivos.**
