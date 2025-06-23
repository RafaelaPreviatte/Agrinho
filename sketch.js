// Jogo: Polinização Urbana - Agrinho 2025
// Autor: Rafaela

// Variáveis principais
let abelha;         // objeto abelha do jogador
let flores = [];    // array que guarda as flores (pontos)
let poluicoes = []; // array que guarda os obstáculos (poluição)
let pontos = 0;     // contador de flores polinizadas
let vidas = 3;      // vidas do jogador
let fase = "campo"; // fase atual do jogo: campo ou cidade
let jogoIniciado = false; // controla se o jogo começou ou está na tela inicial

let botaoInicio;    // botão para iniciar o jogo
let botaoReiniciar; // botão para reiniciar o jogo

// Configuração inicial do jogo
function setup() {
  createCanvas(650, 500); // cria a área do jogo

  abelha = new Abelha();   // cria o objeto abelha

  // Cria botão iniciar e posiciona no centro da tela
  botaoInicio = createButton("COMEÇAR JOGO");
  botaoInicio.position(width / 2 - 70, height / 2 + 80);
  botaoInicio.size(140, 40);
  botaoInicio.style('font-size', '18px');
  botaoInicio.mousePressed(() => {
    jogoIniciado = true;  // começa o jogo ao clicar
    botaoInicio.hide();   // esconde o botão
    mudarFase();          // começa alternância de fases
  });

  // Cria botão reiniciar, mas esconde ele inicialmente
  botaoReiniciar = createButton("REINICIAR JOGO");
  botaoReiniciar.position(width / 2 - 70, height / 2 + 80);
  botaoReiniciar.size(140, 40);
  botaoReiniciar.style('font-size', '18px');
  botaoReiniciar.mousePressed(reiniciarJogo);
  botaoReiniciar.hide();
}

// Loop principal do jogo
function draw() {
  // Se jogo não iniciado, mostra tela inicial com instruções
  if (!jogoIniciado) {
    telaInicial();
    return;
  }

  // Se jogador alcançou 20 pontos, mostra final feliz
  if (pontos >= 20) {
    finalFeliz();
    return;
  }

  // Se acabou as vidas, mostra game over
  if (vidas <= 0) {
    gameOver();
    return;
  }

  // Define cor do fundo conforme a fase (campo ou cidade)
  if (fase === "campo") {
    background(120, 200, 120); // verde claro para campo
  } else {
    background(180);           // cinza para cidade
  }

  // Mostra a abelha na tela
  abelha.mostrar();

  // Movimento da abelha: WASD e setas, com velocidade 6 pixels por frame
  let speed = 6;
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A ou seta esquerda
    abelha.x -= speed;
  }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D ou seta direita
    abelha.x += speed;
  }
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) { // W ou seta cima
    abelha.y -= speed;
  }
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) { // S ou seta baixo
    abelha.y += speed;
  }

  // Limita a abelha para não sair da tela
  abelha.x = constrain(abelha.x, 20, width - 20);
  abelha.y = constrain(abelha.y, 20, height - 20);

  // Atualiza e mostra as flores
  for (let i = flores.length - 1; i >= 0; i--) {
    flores[i].mostrar();
    flores[i].mover();

    // Se abelha colidiu com a flor, ganha ponto e flor some
    if (flores[i].colidiu(abelha)) {
      pontos++;
      flores.splice(i, 1);
    } 
    // Remove flores que saem da tela (para economizar memória)
    else if (flores[i].y > height + 20) {
      flores.splice(i, 1);
    }
  }

  // Atualiza e mostra os obstáculos (poluição)
  for (let i = poluicoes.length - 1; i >= 0; i--) {
    poluicoes[i].mostrar();
    poluicoes[i].mover();

    // Se colidiu, perde vida e remove poluição
    if (poluicoes[i].colidiu(abelha)) {
      vidas--;
      poluicoes.splice(i, 1);
    } 
    // Remove poluição que saiu da tela
    else if (poluicoes[i].y > height + 20) {
      poluicoes.splice(i, 1);
    }
  }

  // Exibe informações na tela: pontos, vidas e fase
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`🌼 Polinizadas: ${pontos}`, 10, 10);
  text(`❤️ Vidas: ${vidas}`, 10, 40);
  text(`🌎 Fase: ${fase}`, 10, 70);

  // Gera novas flores a cada 30 frames (~0.5 segundos)
  if (frameCount % 30 === 0) flores.push(new Flor());
  // Gera poluição mais frequente a cada 20 frames (~0.33 segundos)
  if (frameCount % 20 === 0) poluicoes.push(new Poluicao());
}

// Tela inicial com título, instruções e botão iniciar
function telaInicial() {
  background("#4CAF50"); // céu azul claro
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("🐝 Polinização Urbana", width / 2, height / 2 - 100);

  textSize(22);
  text("Ajude a abelha a polinizar as flores!", width / 2, height / 2 - 60);
  text("Desvie da poluição para não perder vidas.", width / 2, height / 2 - 30);
  text("Controles:", width / 2, height / 2);
  text("⬅️ ➡️ ⬆️ ⬇️ ou W A S D para mover", width / 2, height / 2 + 30);
  text("🌼 Pegue 20 flores para vencer!", width / 2, height / 2 + 70);
}

// Tela de vitória com mensagem especial
function finalFeliz() {
  background(135, 206, 235);
  fill(34, 139, 34);
  rect(0, height - 100, width, 100);

  // Árvores estilizadas
  for (let i = 50; i < width; i += 100) {
    fill(139, 69, 19);
    rect(i, height - 150, 20, 50);
    fill(0, 200, 0);
    ellipse(i + 10, height - 150, 60, 60);
  }

  // Flores no chão
  for (let i = 30; i < width; i += 60) {
    fill(255, 100, 150);
    ellipse(i, height - 20, 20, 20);
  }

  // Mensagens de vitória
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Parabéns!", width / 2, 100);
  textSize(24);
  text("Graças a você, a cidade voltou a florescer!", width / 2, 140);
  text("As abelhas salvaram a natureza 🌸🐝", width / 2, 180);

  noLoop(); // para o jogo

  // Mostra botão reiniciar na vitória
  botaoReiniciar.show();
}

// Tela de Game Over
function gameOver() {
  background(100);
  fill(255, 0, 0);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2);

  noLoop(); // para o draw()

  // Mostra botão reiniciar no game over
  botaoReiniciar.show();
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  // Reseta variáveis principais
  pontos = 0;
  vidas = 3;
  fase = "campo";
  flores = [];
  poluicoes = [];
  jogoIniciado = true;

  // Esconde botão reiniciar e inicia loop novamente
  botaoReiniciar.hide();
  loop();
}

// Classe Abelha - define o jogador
class Abelha {
  constructor() {
    this.x = width / 2;     // posição inicial no meio da tela
    this.y = height - 50;
  }

  mostrar() {
    push();
    translate(this.x, this.y);

    // Corpo com listras amarelo e preto
    noStroke();
    for (let i = -20; i <= 20; i += 10) {
      fill(i % 20 === 0 ? color(255, 200, 0) : color(0));
      ellipse(i, 0, 12, 30);
    }

    // Corpo principal amarelo
    fill(255, 200, 0);
    ellipse(0, 0, 50, 35);

    // Listras pretas no corpo
    fill(0);
    rect(-15, -15, 10, 30);
    rect(-2, -15, 10, 30);
    rect(11, -15, 10, 30);

    // Cabeça preta
    fill(0);
    ellipse(28, 0, 28, 28);

    // Olhos grandes com brilho branco
    fill(255);
    ellipse(20, -8, 14, 14);
    ellipse(35, -8, 14, 14);
    fill(0);
    ellipse(20, -8, 6, 6);
    ellipse(35, -8, 6, 6);
    fill(255, 255, 255, 150);
    ellipse(22, -10, 6, 6);
    ellipse(37, -10, 6, 6);

    // Sorriso rosa claro
    noFill();
    stroke(255, 150, 150);
    strokeWeight(3);
    arc(28, 8, 20, 12, 0, PI);

    noStroke();

    // Antenas finas pretas
    stroke(0);
    strokeWeight(2);
    line(25, -18, 15, -35);
    line(33, -18, 43, -35);

    noStroke();

    // Asas transparentes azuis
    fill(200, 230, 255, 150);
    ellipse(-10, -15, 35, 60);
    ellipse(5, -20, 35, 60);

    pop();
  }
}

// Classe Flor - objeto para coletar pontos
class Flor {
  constructor() {
    this.x = random(width);
    this.y = -20; // aparece no topo da tela
    this.vel = 3; // velocidade descendo
  }

  mostrar() {
    fill(255, 100, 150);
    ellipse(this.x, this.y, 20, 20);
  }

  mover() {
    this.y += this.vel;
  }

  // Detecta colisão com a abelha pelo cálculo de distância
  colidiu(abelha) {
    return dist(this.x, this.y, abelha.x, abelha.y) < 30;
  }
}

// Classe Poluição - obstáculos a evitar
class Poluicao {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.vel = random(7, 12); // velocidade variável para desafio maior
  }

  mostrar() {
    fill(50);
    ellipse(this.x, this.y, 35, 35);
  }

  mover() {
    this.y += this.vel;
  }

  // Detecta colisão com a abelha
  colidiu(abelha) {
    return dist(this.x, this.y, abelha.x, abelha.y) < 35;
  }
}

// Função para alternar fase entre campo e cidade a cada 20 segundos
function mudarFase() {
  setInterval(() => {
    fase = fase === "campo" ? "cidade" : "campo";
  }, 20000);
}
