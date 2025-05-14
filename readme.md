# Sistema de Consulta de Contracheques e Antecipação do 13º Salário

Sistema web para servidores da Prefeitura Municipal de Campina Grande acessarem contracheques e solicitarem antecipação do 13º salário.

## Visão Geral

Este projeto contém dois formulários principais:

1. **Consulta de Contracheques**: Interface para servidores consultarem e baixarem seus contracheques
2. **Solicitação de Antecipação do 13º**: Formulário para solicitação da antecipação da primeira parcela do 13º salário

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- Integração com backend via Webhook (n8n)

## Estrutura do Projeto

```
📦 contracheque-v2
 ┣ 📜 contracheque-site.html      # Página de consulta de contracheques
 ┣ 📜 index.html                  # Página de solicitação de 13º salário
 ┣ 📜 styles.css                  # Estilos para a página de solicitação
 ┣ 📜 script.js                   # Script para a página de solicitação
 ┣ 📂 imagens                     # Diretório de imagens
 ┃ ┣ 📜 logo3.png                 # Logo da prefeitura
 ┃ ┗ 📜 3.jpg                     # Imagem de fundo
 ┗ 📜 package.json                # Configurações do projeto
```

## Funcionalidades

### Consulta de Contracheques

- Autenticação via CPF, Matrícula e Data de Nascimento
- Validação de campos em tempo real
- Design responsivo
- Feedback visual ao usuário

### Solicitação de Antecipação do 13º

- Formulário com validação completa dos dados
- Integração com sistema backend via webhook
- Feedback visual detalhado conforme resposta do servidor
- Tratamento de diferentes status de resposta (sucesso, aviso, erro)
- Interface responsiva e animações suaves

## Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/prefeitura-cg/contracheque-v2.git
```

2. Entre no diretório do projeto:
```bash
cd contracheque-v2
```

3. Instale as dependências:
```bash
npm install
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O sistema será aberto automaticamente no navegador padrão.

## Integração com Backend

O sistema utiliza webhooks para comunicação com o backend. A autenticação é feita via Basic Auth e as credenciais estão configuradas no arquivo `script.js`.

Respostas possíveis do servidor:
- Código 200: Sucesso no registro
- Código 300: Solicitação já registrada anteriormente
- Código 500: Erro no processamento

## Segurança

- Validação de CPF com algoritmo completo
- Sanitização de inputs
- Autenticação básica para comunicação com o backend
- Proteção contra entradas inválidas

## Manutenção

Para atualizar o sistema:

1. Edite os arquivos HTML, CSS ou JavaScript conforme necessário
2. Teste as alterações localmente com `npm run dev`
3. Envie as alterações para o repositório

## Deadline

Data limite para solicitação de antecipação do 13º salário: 06/06

---

Desenvolvido pela Diretoria de Tecnologia da Informação - PMCG © 2025
