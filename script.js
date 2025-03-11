let intervaloContagem; // Variável para armazenar o intervalo da contagem regressiva

// Função para gerar um código de confirmação aleatório entre 1 e 1000
function gerarCodigo() {
    const codigo = Math.floor(Math.random() * 1000) + 1; // Gera um número entre 1 e 1000
    return codigo;
}

// Função para exibir o código de confirmação na tela
function exibirCodigo() {
    const codigo = gerarCodigo();
    document.getElementById('verificationCode').textContent = codigo;
    document.getElementById('confirmation-message').textContent = ''; // Limpar mensagens anteriores

    // Enviar o código para o backend via API
    const email = document.getElementById('email').value;
    if (email) {
        fetch('/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, code: codigo })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('confirmation-message').textContent = "Código enviado para " + email;
        })
        .catch(error => {
            document.getElementById('confirmation-message').textContent = "Erro ao enviar o código.";
        });
    }

    // Reiniciar a contagem regressiva
    reiniciarContagemRegressiva();
}

// Função para verificar se o código gerado é correto
function verificarCodigo() {
    const codigoExibido = document.getElementById('verificationCode').textContent;
    const userInput = document.getElementById('codeInput').value;

    if (userInput === codigoExibido) {
        document.getElementById('confirmation-message').textContent = 'Código verificado com sucesso!';
        document.getElementById('confirmation-message').style.color = 'green';
    } else {
        document.getElementById('confirmation-message').textContent = 'Código incorreto. Tente novamente.';
        document.getElementById('confirmation-message').style.color = 'red';
    }
}

// Função para atualizar o relógio
function atualizarRelogio() {
    const hora = document.getElementById("hora");
    const minuto = document.getElementById("minuto");
    const segundo = document.getElementById("segundo");

    const data = new Date();
    let h = data.getHours();
    let m = data.getMinutes();
    let s = data.getSeconds();

    h = (h < 10) ? '0' + h : h;
    m = (m < 10) ? '0' + m : m;
    s = (s < 10) ? '0' + s : s;

    hora.textContent = h;
    minuto.textContent = m;
    segundo.textContent = s;
}

// Iniciar o relógio
function iniciar() {
    atualizarRelogio();
    setInterval(atualizarRelogio, 1000); // Atualiza o relógio a cada segundo
}

// Função para reiniciar a contagem regressiva a cada vez que o código mudar
function reiniciarContagemRegressiva() {
    // Se houver um intervalo em execução, pare-o
    if (intervaloContagem) {
        clearInterval(intervaloContagem);
    }

    let tempoRestante = 120; // 120 segundos (2 minutos)
    const contagemRegressivaDisplay = document.getElementById('countdown'); // Elemento onde a contagem regressiva será exibida
    
    // Atualiza a contagem regressiva a cada segundo
    intervaloContagem = setInterval(function() {
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        contagemRegressivaDisplay.textContent = `Tempo restante: ${minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
        
        if (tempoRestante === 0) {
            clearInterval(intervaloContagem); // Para a contagem ao chegar a 0
            exibirCodigo(); // Gera e exibe o novo código
        }
        tempoRestante--;
    }, 1000);
}

// Adicionar eventos aos botões
document.getElementById('generateCodeButton').addEventListener('click', exibirCodigo);
document.getElementById('verifyCodeButton').addEventListener('click', verificarCodigo);

// Iniciar o relógio e a contagem regressiva
iniciar();
reiniciarContagemRegressiva(); // Iniciar a contagem regressiva
