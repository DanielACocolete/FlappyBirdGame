const canvas = document.getElementById('jogo_canvas');
const ctx = canvas.getContext("2d");
const jogoContainer = document.getElementById('jogo-container');

const flappyImg = new Image();
flappyImg.src = 'imagens/flappy_dunk.png';

const FLAP_VELOCIDADE = -5;
const PASSARO_LARGURA = 40;
const PASSARO_ALTURA = 30;
const CANO_LARGURA = 50;
const CANO_BRECHA = 125;

let passaroX = 50;
let passaroY = 50;
let passaroVelocidade = 0;
let passaroAceleracao = 0.1;

let canoX = 400;
let canoY = canvas.height - 200;

let pontuacaoDiv = document.getElementById('pontuacao_display');
let pontuacao = 0;
let maiorPontuacao = 0;

let pontuado = false;

document.body.onkeyup = function(e){
    if(e.code == 'Space'){
        passaroVelocidade = FLAP_VELOCIDADE;
    }
}

document.getElementById('rejogar-botao').addEventListener('click', function(){
    esconderFimMenu();
    resetarJogo();
    loop();
})

function incrementaPontuacao(){
    if(passaroX > canoX + CANO_LARGURA && (passaroY < canoY + CANO_BRECHA || 
        passaroY + PASSARO_ALTURA > canoY + CANO_BRECHA) && !pontuado){
        pontuacao++;
        pontuacaoDiv.innerHTML = pontuacao;
        pontuado = true;
    }

    if(passaroX < canoX + CANO_LARGURA){
        pontuado = false;
    }
}

function checagemColisao(){
    const passaroBox = {
        x: passaroX,
        y: passaroY,
        width: PASSARO_LARGURA,
        height: PASSARO_ALTURA
    }

    const canoCimaBox = {
        x: canoX,
        y: canoY - CANO_BRECHA + PASSARO_ALTURA,
        width: CANO_LARGURA,
        height: canoY
    }

    const canoBaixoBox = {
        x: canoX,
        y: canoY + CANO_BRECHA + PASSARO_ALTURA,
        width: CANO_LARGURA,
        height: canvas.height - canoY - CANO_BRECHA
    }

    if(passaroBox.x + passaroBox.width > canoCimaBox.x && passaroBox.x < canoCimaBox.x + canoCimaBox.width && 
        passaroBox.y < canoCimaBox.y){
            return true;
    }

    if(passaroBox.x + passaroBox.width > canoBaixoBox.x && passaroBox.x < canoBaixoBox.x + canoBaixoBox.width && 
        passaroBox.y + passaroBox.height > canoBaixoBox.y){
            return true;
    }

    if(passaroY < 0 || passaroY + PASSARO_ALTURA > canvas.height){
        return true;
    }

    return false;
}

function esconderFimMenu(){
    document.getElementById('fim-menu').style.display = 'none';
    jogoContainer.classList.remove('backdrop-blur');
}

function showFimMenu(){
    document.getElementById('fim-menu').style.display = 'block';
    jogoContainer.classList.add('backdrop-blur');
    document.getElementById('pontos_finais').innerHTML = pontuacao;

    if(maiorPontuacao < pontuacao){
        maiorPontuacao = pontuacao;
    }
    document.getElementById('melhor_pontuacao').innerHTML = maiorPontuacao;
}

function resetarJogo(){
    passaroX = 50;
    passaroY = 50;
    passaroVelocidade = 0;
    passaroAceleracao = 0.1;

    canoX = 400;
    canoY = canvas.height - 200;

    pontuacao = 0;
}

function fimJogo(){
    showFimMenu();
}

function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(flappyImg, passaroX, passaroY);

    ctx.fillStyle = '#333';
    ctx.fillRect(canoX, -100, CANO_LARGURA, canoY);
    ctx.fillRect(canoX, canoY + CANO_BRECHA, CANO_LARGURA, canvas.height - canoY);

    if(checagemColisao()){
        fimJogo();
        return;
    }

    canoX -= 1.5;

    if(canoX < -50){
        canoX = 400;
        canoY = Math.random() * (canvas.height - CANO_BRECHA) + CANO_LARGURA;
    }

    passaroVelocidade += passaroAceleracao;
    passaroY += passaroVelocidade;

    incrementaPontuacao();
    requestAnimationFrame(loop);
}

loop();


