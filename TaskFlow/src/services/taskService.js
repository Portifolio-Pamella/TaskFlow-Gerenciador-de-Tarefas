
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './firebaseConfig';

const tasksCollection = collection(db, 'tarefas');

const PRIORIDADES_VALIDAS = ['Baixa', 'Média', 'Alta'];

// Validar os dados antes de salvar no Firestore
function validateTask(task) {
  if (!task || typeof task !== 'object') {
    throw new Error('Os dados da tarefa são inválidos.');
  }

  const titulo = typeof task.titulo === 'string'
    ? task.titulo.trim()
    : '';

  const descricao = typeof task.descricao === 'string'
    ? task.descricao.trim()
    : '';

  const dataEntrega = typeof task.dataEntrega === 'string'
    ? task.dataEntrega.trim()
    : '';

  if (!titulo) {
    throw new Error('O título da tarefa é obrigatório.');
  }

  if (titulo.length > 80) {
    throw new Error('O título deve ter no máximo 80 caracteres.');
  }

  if (!PRIORIDADES_VALIDAS.includes(task.prioridade)) {
    throw new Error('Selecione uma prioridade válida.');
  }

  // A data é opcional, mas precisa ser válida se for informada.
  if (dataEntrega) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dataEntrega.match(regex);

    if (!match) {
      throw new Error('A data deve estar no formato DD/MM/AAAA.');
    }

    const dia = Number(match[1]);
    const mes = Number(match[2]);
    const ano = Number(match[3]);

    const data = new Date(ano, mes - 1, dia);

    const dataValida =
      data.getFullYear() === ano &&
      data.getMonth() === mes - 1 &&
      data.getDate() === dia;

    if (!dataValida) {
      throw new Error('Informe uma data válida.');
    }
  }

  return {
    titulo,
    descricao,
    prioridade: task.prioridade,
    dataEntrega,
  };
}

// Criar tarefa
export async function createTask(userId, task) {
  if (!userId) {
    throw new Error('Usuário não identificado.');
  }

  const taskData = validateTask(task);

  return addDoc(tasksCollection, {
    userId,
    ...taskData,
    status: 'Pendente',
    createdAt: serverTimestamp(),
  });
}

// Listar tarefas em tempo real
export function listenTasks(userId, callback, onError) {
  if (!userId) {
    throw new Error('Usuário não identificado.');
  }

  if (typeof callback !== 'function') {
    throw new Error('A função de retorno das tarefas é inválida.');
  }

  const tasksQuery = query(
    tasksCollection,
    where('userId', '==', userId)
  );

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      // Ordenar da tarefa mais recente para a mais antiga
      tasks.sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;

        return dateB - dateA;
      });

      callback(tasks);
    },
    onError
  );
}

// Editar tarefa
export async function updateTask(taskId, task) {
  if (!taskId) {
    throw new Error('Identificador da tarefa não informado.');
  }

  const taskData = validateTask(task);
  const taskRef = doc(db, 'tarefas', taskId);

  return updateDoc(taskRef, taskData);
}

// Concluir ou reabrir tarefa
export async function toggleTaskStatus(taskId, currentStatus) {
  if (!taskId) {
    throw new Error('Identificador da tarefa não informado.');
  }

  if (!['Pendente', 'Concluída'].includes(currentStatus)) {
    throw new Error('O status atual da tarefa é inválido.');
  }

  const taskRef = doc(db, 'tarefas', taskId);

  const newStatus = currentStatus === 'Concluída'
    ? 'Pendente'
    : 'Concluída';

  return updateDoc(taskRef, {
    status: newStatus,
  });
}

// Excluir tarefa
export async function removeTask(taskId) {
  if (!taskId) {
    throw new Error('Identificador da tarefa não informado.');
  }

  const taskRef = doc(db, 'tarefas', taskId);

  return deleteDoc(taskRef);
}
