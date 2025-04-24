let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let id = parseInt(localStorage.getItem('id')) || 0;

document.getElementById('formTarefa').addEventListener('submit', function(e) {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;
  const dataEntrega = document.getElementById('dataEntrega').value;

  const tarefa = {
    id: id++,
    titulo,
    descricao,
    dataEntrega,
    status: 'pendente',
    subtarefas: []
  };

  tarefas.push(tarefa);
  salvarDados();
  listarTarefas();
  this.reset();
});

function salvarDados() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  localStorage.setItem('id', id.toString());
}

function listarTarefas(filtro = 'todas') {
  const ul = document.getElementById('listaTarefas');
  ul.innerHTML = '';

  let pendentes = 0;
  let concluidas = 0;

  tarefas.forEach((t, index) => {
    if (filtro !== 'todas' && t.status !== filtro) return;

    const li = document.createElement('li');
    li.id = `tarefa-${t.id}`;

    if (t.status === 'pendente' && t.dataEntrega && new Date(t.dataEntrega) < new Date()) {
      li.classList.add('tarefa-atrasada'); 
    }

    let tituloHTML = `<strong>${t.titulo}</strong>`;

    let subtarefasHTML = '';
    if (t.subtarefas.length > 0) {
      subtarefasHTML = '<ul>';
      t.subtarefas.forEach((s, i) => {
        subtarefasHTML += `
          <li>
            <input type="checkbox" ${s.concluida ? 'checked' : ''} onchange="toggleSubtarefa(${index}, ${i})">
            ${s.texto}
          </li>
        `;
      });
      subtarefasHTML += '</ul>';
    }

    li.innerHTML = `
    
      ${tituloHTML} - ${t.descricao || ''}
      ${t.dataEntrega ? `<br>Entrega: ${t.dataEntrega}` : ''}
      <br>Status: ${t.status}
      ${subtarefasHTML}
      <input type="text" id="novaSub${index}" placeholder="Nova subtarefa">
      <button onclick="adicionarSubtarefa(${index})">Adicionar Subtarefa</button>
      <br>
      <button onclick="mudarStatus(${t.id})">
      ${t.status === 'pendente' ? 'Concluir' : 'Reabrir'}
      </button>
      <button onclick="remover(${t.id})">Remover</button>
      <button onclick="moverCima(${index})">↑</button>
      <button onclick="moverBaixo(${index})">↓</button>
    `
    ;

    ul.appendChild(li);

    if (t.status === 'pendente') pendentes++;
    else concluidas++;
  });

  const contador = document.getElementById('contador');
  if (filtro === 'todas') {
    contador.textContent = `Pendentes: ${pendentes} | Concluídas: ${concluidas}`;
  } else {
    contador.textContent = ''; 
  }
  }

function filtrar(status) {
  listarTarefas(status);
}

function buscarPorTitulo() {
  const busca = document.getElementById('busca').value.toLowerCase();
  const ul = document.getElementById('listaTarefas');
  const itens = ul.getElementsByTagName('li');

  for (let i = 0; i < tarefas.length; i++) {
    const tarefa = tarefas[i];
    const li = document.getElementById(`tarefa-${tarefa.id}`);

    if (!li) continue;

    if (tarefa.titulo.toLowerCase().includes(busca)) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
  }
}


function adicionarSubtarefa(index) {
  const subtarefaInput = document.getElementById(`novaSub${index}`);
  const texto = subtarefaInput.value;

  if (texto.trim() === '') return;

  tarefas[index].subtarefas.push({ texto, concluida: false });
  salvarDados();
  listarTarefas();
}

function toggleSubtarefa(tarefaIndex, subtarefaIndex) {
  tarefas[tarefaIndex].subtarefas[subtarefaIndex].concluida = !tarefas[tarefaIndex].subtarefas[subtarefaIndex].concluida;
  salvarDados();
  listarTarefas();
}

function mudarStatus(id) {
  const tarefa = tarefas.find(t => t.id === id);
  tarefa.status = tarefa.status === 'pendente' ? 'concluida' : 'pendente';
  salvarDados();
  listarTarefas();
}

function remover(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  salvarDados();
  listarTarefas();
}

function moverCima(index) {
  if (index === 0) return;
  const tarefa = tarefas[index];
  tarefas.splice(index, 1);
  tarefas.splice(index - 1, 0, tarefa);
  salvarDados();
  listarTarefas();
}

function moverBaixo(index) {
  if (index === tarefas.length - 1) return;
  const tarefa = tarefas[index];
  tarefas.splice(index, 1);
  tarefas.splice(index + 1, 0, tarefa);
  salvarDados();
  listarTarefas();
}

window.onload = listarTarefas;

