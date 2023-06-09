const URL = "https://djangotarefas-production.up.railway.app/api/tarefas"


async function obterTarefas() {
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

async function criarTarefa() {
  const descricao = document.getElementById('descricao').value;
  const responsavel = document.getElementById('responsavel').value;
  const nivel = document.getElementById('nivel').value;
  const situacao = document.getElementById('situacao').value;
  const prioridade = document.getElementById('prioridade').value;

  const novaTarefa = {
    descricao: descricao,
    responsavel: responsavel,
    nivel: parseInt(nivel),
    situacao: situacao,
    prioridade: parseInt(prioridade)
  };

  const response = await fetch(URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaTarefa)
  });
  if (response.status === 201) {
      document.getElementById('descricao').value = '';
      document.getElementById('responsavel').value = '';
      mostrarTarefas()
      console.log("Tarefa criada com sucesso")
      console.log(response.status)
  }else{
      console.log("!!ERRO!!")
  }
}

async function mostrarTarefas() {
  const tarefas = await obterTarefas();
      
  const tabela = document.getElementById('tabela-tarefas');
  tabela.innerHTML = '';
  //Juntando o cabeçalho com o conteudo
  const cabecalho = `
  <thead>
    <tr>
      <th>Id</th>
      <th>Descrição</th>
      <th>Responsável</th>
      <th>Nível</th>
      <th>Situação</th>
      <th>Prioridade</th>
    </tr>
  </thead>
  `;
  tabela.innerHTML += cabecalho;
  for (let tarefa_atual of tarefas) {
    const row = tabela.insertRow();
    row.insertCell().innerText = tarefa_atual.id;
    row.insertCell().innerText = tarefa_atual.descricao;
    row.insertCell().innerText = tarefa_atual.responsavel;
    row.insertCell().innerText = tarefa_atual.nivel;
    row.insertCell().innerText = tarefa_atual.situacao;
    row.insertCell().innerText = tarefa_atual.prioridade;


    // Criando um botão de apagar para cada tarefa
    const botaoDeletar = document.createElement('button');
    botaoDeletar.innerText = 'Excluir';
    botaoDeletar.classList.add('botao-js');//adicionando essa classe para estilizar o botao das linhas
    botaoDeletar.addEventListener('click', () => {
      apagarTarefa(tarefa_atual.id);
    });
    row.insertCell().appendChild(botaoDeletar);


    const botaoAtualizar = document.createElement('button');
    botaoAtualizar.innerText = 'Atualizar';
    botaoAtualizar.classList.add('botao-js');//adicionando essa classe para estilizar o botao das linhas
    botaoAtualizar.addEventListener('click',()=>{
      atualizarTarefas(tarefa_atual.id)
    })
    row.insertCell().appendChild(botaoAtualizar);

  }
}
async function apagarTarefa(id) {
  const confirmacao = await Swal.fire({
    icon: 'warning',
    title: 'Tem certeza que deseja apagar a tarefa?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
  });
  
  if (confirmacao.isConfirmed) {
    const response = await fetch(`${'djangotarefas-production.up.railway.app/api/tarefas'}/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      console.log("Tarefa apagada com sucesso");
      await Swal.fire({
        icon: 'success',
        title: 'Tarefa apagada com sucesso',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      console.log("Erro ao apagar tarefa");
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao apagar tarefa',
        text: 'Não foi possível apagar a tarefa.',
        confirmButtonText: 'OK'
      });
    }

    mostrarTarefas();
  }
}
