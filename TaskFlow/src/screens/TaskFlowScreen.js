
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../services/firebaseConfig';

import {
  registerUser,
  loginUser,
  logoutUser,
  getAuthErrorMessage,
} from '../services/authService';

import {
  createTask,
  listenTasks,
  updateTask,
  toggleTaskStatus,
  removeTask,
} from '../services/taskService';

import TaskCard from '../components/TaskCard';
import colors from '../styles/colors';

export default function TaskFlowScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('Todas');

  const [editingTask, setEditingTask] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [dataEntrega, setDataEntrega] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // Exibir mensagens na tela
  function showMessage(text, type = 'success') {
    setMessage(text);
    setMessageType(type);
  }

  // Validar data no formato DD/MM/AAAA
  function isValidDate(date) {
    if (!date.trim()) {
      return true; // A data é opcional
    }

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = date.match(regex);

    if (!match) {
      return false;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const parsedDate = new Date(year, month - 1, day);

    return (
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day
    );
  }

  // Verificar usuário autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        setUser(authenticatedUser);
        setLoading(false);
      },
      () => {
        showMessage('Não foi possível verificar sua sessão.', 'error');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Buscar tarefas do usuário em tempo real
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const unsubscribe = listenTasks(
      user.uid,
      (userTasks) => {
        setTasks(userTasks);
      },
      (error) => {
        console.error('Erro ao carregar tarefas:', error);

        if (error.code === 'permission-denied') {
          showMessage(
            'Você não tem permissão para acessar estas tarefas.',
            'error'
          );
        } else if (
          error.code === 'unavailable' ||
          error.code === 'network-request-failed'
        ) {
          showMessage(
            'Sem conexão com o servidor. Verifique sua internet.',
            'error'
          );
        } else {
          showMessage(
            'Não foi possível carregar as tarefas. Tente novamente.',
            'error'
          );
        }
      }
    );

    return unsubscribe;
  }, [user]);

  // Limpar formulário
  function clearForm() {
    setTitulo('');
    setDescricao('');
    setPrioridade('Média');
    setDataEntrega('');
    setEditingTask(null);
  }

  // Cadastro e login
  async function handleAuthentication() {
    setMessage('');

    if (!email.trim() || !password) {
      showMessage('Preencha o e-mail e a senha.', 'error');
      return;
    }

    if (isRegister && password.length < 6) {
      showMessage('A senha precisa ter pelo menos 6 caracteres.', 'error');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      showMessage('As senhas não são iguais.', 'error');
      return;
    }

    try {
      setSaving(true);

      if (isRegister) {
        await registerUser(email, password);
        showMessage('Cadastro realizado com sucesso!');
      } else {
        await loginUser(email, password);
        showMessage('Login realizado com sucesso!');
      }

      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      showMessage(getAuthErrorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  }

  // Sair da conta
  async function handleLogout() {
    try {
      await logoutUser();
      clearForm();
      showMessage('Você saiu da sua conta.');
    } catch (error) {
      showMessage('Não foi possível sair da conta.', 'error');
    }
  }

  // Criar ou editar tarefa
  async function handleSaveTask() {
    if (!titulo.trim()) {
      showMessage('Informe o título da tarefa.', 'error');
      return;
    }

    if (!isValidDate(dataEntrega)) {
      showMessage(
        'Informe uma data válida no formato DD/MM/AAAA.',
        'error'
      );
      return;
    }

    if (titulo.trim().length > 80) {
      showMessage('O título deve ter no máximo 80 caracteres.', 'error');
      return;
    }

    try {
      setSaving(true);

      const taskData = {
        titulo,
        descricao,
        prioridade,
        dataEntrega,
      };

      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        showMessage('Tarefa atualizada com sucesso!');
      } else {
        await createTask(user.uid, taskData);
        showMessage('Tarefa criada com sucesso!');
      }

      clearForm();

     } catch (error) {
  console.error('Erro ao salvar tarefa:', error);

  showMessage(
    error.message || 'Não foi possível salvar a tarefa.',
    'error'
  );

}finally {
      setSaving(false);
    }
  }

  // Carregar dados para edição
  function handleEditTask(task) {
    setEditingTask(task);
    setTitulo(task.titulo || '');
    setDescricao(task.descricao || '');
    setPrioridade(task.prioridade || 'Média');
    setDataEntrega(task.dataEntrega || '');

    showMessage('Edite os campos e salve as alterações.');
  }

  // Concluir ou reabrir
  async function handleToggleTask(task) {
    try {
      await toggleTaskStatus(task.id, task.status);

      showMessage(
        task.status === 'Concluída'
          ? 'Tarefa reaberta!'
          : 'Tarefa concluída!'
      );
    } catch (error) {
      showMessage('Não foi possível atualizar o status.', 'error');
    }
  }

  // Excluir tarefa
  function handleDeleteTask(taskId) {
    Alert.alert(
      'Excluir tarefa',
      'Tem certeza de que deseja excluir esta tarefa? Essa ação não poderá ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeTask(taskId);

              if (editingTask?.id === taskId) {
                clearForm();
              }

              showMessage('Tarefa excluída com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir tarefa:', error);
              showMessage(
                'Não foi possível excluir a tarefa. Tente novamente.',
                'error'
              );
            }
          },
        },
      ]
    );
  }

  // Filtros
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Pendentes') {
      return task.status === 'Pendente';
    }

    if (filter === 'Concluídas') {
      return task.status === 'Concluída';
    }

    return true;
  });

  const pendingCount = tasks.filter(
    (task) => task.status === 'Pendente'
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === 'Concluída'
  ).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando TaskFlow...</Text>
      </View>
    );
  }

  // Tela de login e cadastro
  if (!user) {
    return (
      <ScrollView
        contentContainerStyle={styles.authContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.authCard}>
          <Text style={styles.logo}>TaskFlow</Text>

          <Text style={styles.subtitle}>
            Organize suas tarefas. Simplifique sua rotina.
          </Text>

          <Text style={styles.heading}>
            {isRegister ? 'Crie sua conta' : 'Bem-vinda de volta!'}
          </Text>

          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {isRegister && (
            <>
              <Text style={styles.label}>Confirme sua senha</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha novamente"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </>
          )}

          {message ? (
            <Text
              style={[
                styles.message,
                messageType === 'error'
                  ? styles.errorMessage
                  : styles.successMessage,
              ]}
            >
              {message}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleAuthentication}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isRegister ? 'Cadastrar' : 'Entrar'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsRegister(!isRegister);
              setMessage('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            <Text style={styles.switchText}>
              {isRegister
                ? 'Já tem uma conta? Faça login'
                : 'Ainda não tem conta? Cadastre-se'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Painel principal
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>TaskFlow</Text>
          <Text style={styles.subtitle}>Seu espaço de organização</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Olá!</Text>
        <Text style={styles.welcomeEmail}>{user.email}</Text>
        <Text style={styles.welcomeDescription}>
          Vamos organizar suas atividades?
        </Text>
      </View>

      {message ? (
        <Text
          style={[
            styles.message,
            messageType === 'error'
              ? styles.errorMessage
              : styles.successMessage,
          ]}
        >
          {message}
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>Resumo das tarefas</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{tasks.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Pendentes</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>Concluídas</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>
          {editingTask ? 'Editar tarefa' : 'Nova tarefa'}
        </Text>

        <Text style={styles.label}>Título *</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: Estudar React Native"
          value={titulo}
          onChangeText={setTitulo}
          maxLength={80}
        />

        <Text style={styles.label}>Descrição</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva sua tarefa..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Prioridade</Text>

        <View style={styles.priorityOptions}>
          {['Baixa', 'Média', 'Alta'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.priorityOption,
                prioridade === item && styles.selectedPriority,
              ]}
              onPress={() => setPrioridade(item)}
            >
              <Text
                style={[
                  styles.priorityOptionText,
                  prioridade === item && styles.selectedPriorityText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Data de entrega</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: 10/11/2026"
          value={dataEntrega}
          onChangeText={setDataEntrega}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSaveTask}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryButtonText}>
              {editingTask ? 'Salvar alterações' : 'Adicionar tarefa'}
            </Text>
          )}
        </TouchableOpacity>

        {editingTask && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={clearForm}
          >
            <Text style={styles.cancelText}>Cancelar edição</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Minhas tarefas</Text>

      <View style={styles.filters}>
        {['Todas', 'Pendentes', 'Concluídas'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,
              filter === item && styles.activeFilter,
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.activeFilterText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            Nenhuma tarefa encontrada
          </Text>

          <Text style={styles.emptyText}>
            Adicione uma nova tarefa para começar sua organização.
          </Text>
        </View>
      ) : (
        filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={() => handleToggleTask(task)}
            onEdit={() => handleEditTask(task)}
            onDelete={() => handleDeleteTask(task.id)}
          />
        ))
      )}

      <Text style={styles.footer}>
        TaskFlow • Organize seu dia, alcance seus objetivos.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    color: colors.gray,
    marginTop: 12,
  },

  authContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },

  authCard: {
    backgroundColor: colors.white,
    width: '100%',
    maxWidth: 430,
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },

  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
  },

  subtitle: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 5,
  },

  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 30,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    backgroundColor: '#FAF9FD',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    padding: 13,
    fontSize: 14,
    color: colors.text,
  },

  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 22,
  },

  primaryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },

  switchText: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 22,
    fontSize: 13,
  },

  message: {
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 5,
    fontSize: 13,
  },

  errorMessage: {
    color: '#A72E3A',
    backgroundColor: '#FCEBED',
  },

  successMessage: {
    color: '#176C4B',
    backgroundColor: '#E5F6ED',
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 850,
    alignSelf: 'center',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  logoutButton: {
    backgroundColor: '#FCEBED',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9,
  },

  logoutText: {
    color: colors.danger,
    fontWeight: 'bold',
  },

  welcomeCard: {
    backgroundColor: '#EEE9FA',
    padding: 22,
    borderRadius: 16,
    marginBottom: 24,
  },

  welcomeTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.text,
  },

  welcomeEmail: {
    color: colors.primary,
    marginTop: 6,
    fontWeight: 'bold',
  },

  welcomeDescription: {
    color: colors.gray,
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 14,
  },

  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 15,
    marginHorizontal: 4,
    borderRadius: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },

  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },

  summaryLabel: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 5,
  },

  formCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },

  priorityOptions: {
    flexDirection: 'row',
    marginTop: 4,
  },

  priorityOption: {
    flex: 1,
    padding: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.lightGray,
    alignItems: 'center',
    marginRight: 7,
  },

  selectedPriority: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  priorityOptionText: {
    color: colors.gray,
    fontWeight: 'bold',
    fontSize: 12,
  },

  selectedPriorityText: {
    color: colors.white,
  },

  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },

  cancelText: {
    color: colors.danger,
    fontWeight: 'bold',
  },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },

  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    color: colors.gray,
    fontWeight: 'bold',
    fontSize: 12,
  },

  activeFilterText: {
    color: colors.white,
  },

  emptyCard: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },

  emptyTitle: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },

  emptyText: {
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  footer: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: 11,
    marginTop: 30,
  },
});
