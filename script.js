// script.js

let questoes = [
  /*
  {
    numero: 1,
    enunciado: "Qual é a capital do Brasil?",
    alternativas: {
      A: "São Paulo",
      B: "Rio de Janeiro",
      C: "Brasília",
      D: "Salvador",
      E: "Belo Horizonte"
    }
  },
  {
    numero: 2,
    enunciado: "Qual é o resultado de 2 + 2?",
    alternativas: {
      A: "3",
      B: "4",
      C: "5",
      D: "6",
      E: "2"
    }
  }
  */
];

function salvarQuestao() {
  const enunciado = document.getElementById('enunciado').value;
  const A = document.getElementById('altA').value;
  const B = document.getElementById('altB').value;
  const C = document.getElementById('altC').value;
  const D = document.getElementById('altD').value;
  const E = document.getElementById('altE').value;

  if (!enunciado || !A || !B || !C || !D || !E) {
    alert('Preencha todos os campos.');
    return;
  }

  const novaQuestao = {
    numero: questoes.length + 1,
    enunciado,
    alternativas: { A, B, C, D, E }
  };

  questoes.push(novaQuestao);
  atualizarLista();

  document.getElementById('enunciado').value = '';
  document.getElementById('altA').value = '';
  document.getElementById('altB').value = '';
  document.getElementById('altC').value = '';
  document.getElementById('altD').value = '';
  document.getElementById('altE').value = '';
}

function atualizarLista() {
  const ul = document.getElementById('listaQuestoes');
  ul.innerHTML = '';
  questoes.forEach(q => {
    const li = document.createElement('li');
    li.innerText = `Questão ${q.numero}: ${q.enunciado}`;
    ul.appendChild(li);
  });
}

function embaralharAlternativas(alternativas) {
  const letras = Object.keys(alternativas);
  const valores = Object.values(alternativas);
  const embaralhadas = valores
    .map(v => ({ v, o: Math.random() }))
    .sort((a, b) => a.o - b.o)
    .map((el, i) => [letras[i], el.v]);
  return Object.fromEntries(embaralhadas);
}

function gerarVersoesPDF() {
  for (let v = 1; v <= 3; v++) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Avaliação`, 105, y, { align: 'center' });

    y += 10;
    doc.setFontSize(12);
    doc.text('Nome: __________________________________________', 10, y);
    doc.text('Número: ____________', 140, y);

    y += 10;
    doc.text('Série: __________________________________________', 10, y);
    doc.text('Data: ____________', 140, y);

    y += 15;

    const espacamento = 8;
    const xColuna1 = 10;
    const xColuna2 = 105;

    const questoesVersao = questoes.map(q => ({
      numero: q.numero,
      enunciado: q.enunciado,
      alternativas: embaralharAlternativas(q.alternativas)
    }));

    for (let i = 0; i < questoesVersao.length; i += 2) {
      let yInicioLinha = y;

      const q1 = questoesVersao[i];
      doc.text(`Questão ${q1.numero}: ${q1.enunciado}`, xColuna1, yInicioLinha);
      let altLetra = Object.keys(q1.alternativas);
      let altValor = Object.values(q1.alternativas);
      for (let j = 0; j < 5; j++) {
        yInicioLinha += espacamento;
        doc.text(`${altLetra[j]}) ${altValor[j]}`, xColuna1 + 5, yInicioLinha);
      }
      const alturaQ1 = yInicioLinha;

      yInicioLinha = y;

      if (i + 1 < questoesVersao.length) {
        const q2 = questoesVersao[i + 1];
        doc.text(`Questão ${q2.numero}: ${q2.enunciado}`, xColuna2, yInicioLinha);
        altLetra = Object.keys(q2.alternativas);
        altValor = Object.values(q2.alternativas);
        for (let j = 0; j < 5; j++) {
          yInicioLinha += espacamento;
          doc.text(`${altLetra[j]}) ${altValor[j]}`, xColuna2 + 5, yInicioLinha);
        }
        const alturaQ2 = yInicioLinha;
        y = Math.max(alturaQ1, alturaQ2) + espacamento;
      } else {
        y = alturaQ1 + espacamento;
      }

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`prova_versao_${v}.pdf`);
  }
}

// Inicializa com exemplos
atualizarLista();
