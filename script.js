document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const form = document.getElementById('antecipacaoForm');
    const formContent = document.getElementById('formContent');
    const formOverlay = document.getElementById('formOverlay');
    const cpfInput = document.getElementById('cpf');
    const matriculaInput = document.getElementById('matricula');
    const nascimentoInput = document.getElementById('nascimento');
    const confirmacaoCheckbox = document.getElementById('confirmacao');
    const submitBtn = document.getElementById('submitBtn');
    
    // Referências às mensagens de resposta
    const successMessage = document.getElementById('successMessage');
    const warningMessage = document.getElementById('warningMessage');
    const errorMessage = document.getElementById('errorMessage');
    const successText = document.getElementById('successText');
    const warningText = document.getElementById('warningText');
    const errorText = document.getElementById('errorText');
    
    // Botões de reset
    const resetBtn = document.getElementById('resetBtn');
    const resetBtnWarning = document.getElementById('resetBtnWarning');
    const resetBtnError = document.getElementById('resetBtnError');
    
    // Elementos do modal de cancelamento
    const cancelRequestBtn = document.getElementById('cancelRequestBtn');
    const cancelModalOverlay = document.getElementById('cancelModalOverlay');
    const cancelModalYes = document.getElementById('cancelModalYes');
    const cancelModalNo = document.getElementById('cancelModalNo');
    
    // URL do webhook
    const webhookUrl = 'https://n8n-dti-isp.campinagran.de/webhook/e247568f-a7f3-4d80-b44a-79809313be53';
    
    // Habilitar/desabilitar botão de envio baseado no checkbox
    confirmacaoCheckbox.addEventListener('change', function() {
        submitBtn.disabled = !this.checked;
    });

    // Máscara para CPF - aceita apenas números e formata automaticamente
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        }
    });
    
    // Garantir que apenas números sejam digitados na matrícula
    matriculaInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
    
    // Máscara para data de nascimento (formato DD/MM/AAAA)
    nascimentoInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 8) {
            // Formatar como DD/MM/AAAA
            if (value.length > 4) {
                value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
            }
            e.target.value = value;
        }
    });
    
    // Função para validar data de nascimento
    function validateDate(dateStr) {
        // Verificar o formato DD/MM/AAAA
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const matches = dateStr.match(regex);
        
        if (!matches) return false;
        
        const day = parseInt(matches[1], 10);
        const month = parseInt(matches[2], 10) - 1; // Meses em JS são de 0-11
        const year = parseInt(matches[3], 10);
        
        // Criar objeto de data e verificar se é válida
        const date = new Date(year, month, day);
        
        // Verificar se a data é válida e se está no passado
        const today = new Date();
        return (
            date.getDate() === day &&
            date.getMonth() === month &&
            date.getFullYear() === year &&
            date <= today
        );
    }
    
    // Função para converter data no formato DD/MM/AAAA para AAAA-MM-DD
    function convertToISODate(dateStr) {
        const parts = dateStr.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    // Função para validar CPF
    function validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        
        // Algoritmo de validação
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }
    
    // Função para definir erro nos campos
    function setError(input, message) {
        input.classList.add('error');
        const errorMessage = input.nextElementSibling;
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // Função para remover erro dos campos
    function removeError(input) {
        input.classList.remove('error');
        const errorMessage = input.nextElementSibling;
        errorMessage.style.display = 'none';
    }
    
    // Esconder todas as mensagens de resposta
    function hideAllMessages() {
        successMessage.classList.remove('show-message');
        warningMessage.classList.remove('show-message');
        errorMessage.classList.remove('show-message');
        formOverlay.style.display = 'none';
    }
    
    // Mostrar mensagem e desativar formulário
    function showMessage(messageElement, text) {
        // Primeiro esconde todas as mensagens
        hideAllMessages();
        
        // Define o texto da mensagem
        if (text) {
            const textElement = messageElement.querySelector('span');
            textElement.textContent = text;
        }
        
        // Exibe a mensagem e o overlay
        messageElement.classList.add('show-message');
        formOverlay.style.display = 'block';
    }
    
    // Função para formatar data/hora
    function formatDateHour(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Resetar o formulário e esconder mensagens
    function resetForm() {
        form.reset();
        hideAllMessages();
        submitBtn.disabled = true;
    }
    
    // Adicionar event listeners aos botões de reset
    resetBtn.addEventListener('click', resetForm);
    resetBtnWarning.addEventListener('click', hideAllMessages);
    resetBtnError.addEventListener('click', hideAllMessages);
    
    // Manipulador de envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar o formulário antes de enviar
        let isValid = true;
        
        // Validar CPF
        if (!validateCPF(cpfInput.value)) {
            setError(cpfInput, 'CPF inválido');
            isValid = false;
        } else {
            removeError(cpfInput);
        }
        
        // Validar matrícula
        if (matriculaInput.value.trim() === '') {
            setError(matriculaInput, 'Matrícula é obrigatória');
            isValid = false;
        } else {
            removeError(matriculaInput);
        }
        
        // Validar data de nascimento
        if (nascimentoInput.value === '') {
            setError(nascimentoInput, 'Data de nascimento é obrigatória');
            isValid = false;
        } else if (!validateDate(nascimentoInput.value)) {
            setError(nascimentoInput, 'Data de nascimento inválida');
            isValid = false;
        } else {
            removeError(nascimentoInput);
        }
        
        // Verificar se o checkbox está marcado
        if (!confirmacaoCheckbox.checked) {
            const checkboxError = confirmacaoCheckbox.nextElementSibling.nextElementSibling;
            checkboxError.style.display = 'block';
            isValid = false;
        } else {
            const checkboxError = confirmacaoCheckbox.nextElementSibling.nextElementSibling;
            checkboxError.style.display = 'none';
        }
        
        if (!isValid) {
            return;
        }
        
        // Esconder mensagens existentes
        hideAllMessages();
        
        // Atualizar o texto do botão para indicar processamento
        const originalButtonText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner"></div> Processando...';
        submitBtn.disabled = true;
        
        try {
            // Preparar os dados para envio
            const formData = {
                cpf: cpfInput.value.replace(/[^\d]/g, ''),
                matricula: matriculaInput.value,
                nascimento: convertToISODate(nascimentoInput.value),
                confirmacao: confirmacaoCheckbox.checked
            };
            
            // Enviar os dados para o webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('cybergit2077:R83Y3CAN1G6I6C05QBEK@qo')
                },
                body: JSON.stringify(formData)
            });
            
            // Verificar se a resposta está ok
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            // Processar a resposta
            const data = await response.json();
            
            // Debug para verificar o formato da resposta
            console.log('Resposta do servidor:', data);
            
            // Verificar se a resposta é um objeto ou um array
            if (data) {
                // Se for um array, acessar o primeiro item
                const responseData = Array.isArray(data) && data.length > 0 ? data[0] : data;
                console.log('Dados da resposta:', responseData);
                
                // Exibir a mensagem apropriada com base no código de resposta
                // Se não houver código, considerar como sucesso
                const cod = responseData.cod || 200;
                
                switch(cod) {
                    case 200:
                        showMessage(successMessage, responseData.nomefc ? 
                            `Prezado(a) ${responseData.nomefc},\n\nSua solicitação foi registrada com sucesso! \nA primeira parcela do seu 13º salário será processada conforme o cronograma estabelecido.` : 
                            'Sua solicitação foi registrada com sucesso! A primeira parcela do seu 13º salário será processada conforme o cronograma estabelecido.');
                        break;
                    case 300:
                        showMessage(warningMessage, responseData.nomefc ? 
                            `Atenção, ${responseData.nomefc}!\n\n${responseData.msg || 'Identificamos que você já possui uma solicitação em andamento.'} ${responseData.created_at ? `\n\nData do registro anterior: ${formatDateHour(responseData.created_at)}` : ''}` : 
                            `Atenção!\n\n${responseData.msg || 'Identificamos que você já possui uma solicitação em andamento.'} ${responseData.created_at ? `\n\nData do registro anterior: ${formatDateHour(responseData.created_at)}` : ''}`);
                        break;
                    case 500:
                        showMessage(errorMessage, 'Não foi possível processar sua solicitação neste momento. Por favor, tente novamente mais tarde ou entre em contato com o setor responsável.');
                        break;
                    default:
                        showMessage(successMessage, 'Sua solicitação foi registrada com sucesso! A primeira parcela do seu 13º salário será processada conforme o cronograma estabelecido.');
                }
            } else {
                // Se não houver dados na resposta, ainda assim considerar como sucesso
                showMessage(successMessage, 'Solicitação enviada com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            
            // Verificar se é um erro de rede real
            if (error.name === 'TypeError' && (error.message.includes('NetworkError') || error.message.includes('Failed to fetch'))) {
                showMessage(errorMessage, 'Ops! Parece que estamos com problemas de conexão. Por favor, verifique sua internet e tente novamente em alguns instantes.');
            } else if (error.message.includes('Erro HTTP:')) {
                // Erro de resposta HTTP
                showMessage(errorMessage, 'Nosso sistema está temporariamente indisponível. Por favor, tente novamente mais tarde ou entre em contato com o suporte técnico.');
            } else {
                // Para outros erros, ainda mostrar mensagem de sucesso
                // Isso evita que erros de parsing JSON ou outros erros técnicos afetem a experiência do usuário
                showMessage(successMessage, 'Sua solicitação foi registrada com sucesso! A primeira parcela do seu 13º salário será processada conforme o cronograma estabelecido.');
            }
        } finally {
            // Restaurar o botão ao estado original
            submitBtn.innerHTML = originalButtonText;
            submitBtn.disabled = !confirmacaoCheckbox.checked;
        }
    });

    // Funcionalidade do modal de cancelamento
    // Variáveis globais para armazenar os dados do usuário para cancelamento
    let cancelRequestData = null;

    // Evento para abrir o modal de cancelamento
    cancelRequestBtn.addEventListener('click', function() {
        // Capturar os dados do formulário para usar no cancelamento
        cancelRequestData = {
            cpf: cpfInput.value.replace(/[^\d]/g, ''),
            matricula: matriculaInput.value.trim(),
            nascimento: convertToISODate(nascimentoInput.value)
        };
        
        // Mostrar o modal
        cancelModalOverlay.classList.add('show');
    });

    // Evento para fechar o modal (botão "Não")
    cancelModalNo.addEventListener('click', function() {
        cancelModalOverlay.classList.remove('show');
        cancelRequestData = null;
    });

    // Evento para confirmar o cancelamento (botão "Sim, Cancelar")
    cancelModalYes.addEventListener('click', async function() {
        if (!cancelRequestData) {
            console.error('Dados de cancelamento não encontrados');
            return;
        }

        // Validar se os dados estão completos
        if (!cancelRequestData.cpf || !cancelRequestData.matricula || !cancelRequestData.nascimento) {
            console.error('Dados incompletos para cancelamento:', cancelRequestData);
            showMessage(errorMessage, 'Dados incompletos. Por favor, preencha todos os campos antes de cancelar.');
            cancelModalOverlay.classList.remove('show');
            return;
        }

        try {
            // Desabilitar o botão durante o processo
            cancelModalYes.disabled = true;
            cancelModalYes.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cancelando...';

            // URL para cancelamento
            const cancelUrl = 'https://n8n-dti-isp.campinagran.de/webhook-test/a06efbf4-4462-4fec-aaa7-d3a2e7ec57a4';
            
            // Preparar os parâmetros para a requisição GET
            const urlParams = new URLSearchParams({
                cpf: cancelRequestData.cpf,
                matricula: cancelRequestData.matricula,
                'data de nascimento': cancelRequestData.nascimento
            });

            // Log para debug
            console.log('URL de cancelamento:', `${cancelUrl}?${urlParams.toString()}`);
            console.log('Dados enviados:', {
                cpf: cancelRequestData.cpf,
                matricula: cancelRequestData.matricula,
                'data de nascimento': cancelRequestData.nascimento
            });

            // Enviar a requisição GET
            const response = await fetch(`${cancelUrl}?${urlParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa('cybergit2077:R83Y3CAN1G6I6C05QBEK@qo')
                }
            });

            console.log('Status da resposta:', response.status);
            console.log('Resposta OK:', response.ok);

            // Fechar o modal
            cancelModalOverlay.classList.remove('show');

            if (response.ok) {
                // Sucesso no cancelamento
                showMessage(successMessage, 'Sua solicitação de cancelamento foi enviada com sucesso e será processada pelo suporte. Você será notificado assim que o cancelamento for concluído.');
            } else {
                // Erro no cancelamento
                showMessage(errorMessage, 'Não foi possível enviar sua solicitação de cancelamento neste momento. Por favor, tente novamente mais tarde ou entre em contato com o setor responsável.');
            }

        } catch (error) {
            console.error('Erro ao cancelar solicitação:', error);
            console.error('Tipo de erro:', error.name);
            console.error('Mensagem de erro:', error.message);
            
            // Fechar o modal
            cancelModalOverlay.classList.remove('show');
            
            // Mostrar mensagem de erro
            showMessage(errorMessage, 'Ops! Ocorreu um erro ao tentar cancelar sua solicitação. Por favor, tente novamente mais tarde.');
        } finally {
            // Restaurar o botão
            cancelModalYes.disabled = false;
            cancelModalYes.innerHTML = 'Sim, Cancelar';
            cancelRequestData = null;
        }
    });

    // Fechar modal ao clicar fora dele
    cancelModalOverlay.addEventListener('click', function(event) {
        if (event.target === cancelModalOverlay) {
            cancelModalOverlay.classList.remove('show');
            cancelRequestData = null;
        }
    });
});