
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import colors from '../styles/colors';

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  const completed = task.status === 'Concluída';

  // Associar cada prioridade à sua cor
  const priorityColors = {
    Baixa: colors.priorityLow,
    Média: colors.priorityMedium,
    Alta: colors.priorityHigh,
  };

  return (
    <View
      style={[
        styles.card,
        completed && styles.completedCard,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text
            style={[
              styles.title,
              completed && styles.completedText,
            ]}
          >
            {task.titulo}
          </Text>

          <Text style={styles.status}>
            {task.status}
          </Text>
        </View>

        <View
          style={[
            styles.priority,
            {
              backgroundColor:
                priorityColors[task.prioridade] || colors.gray,
            },
          ]}
        >
          <Text style={styles.priorityText}>
            {task.prioridade}
          </Text>
        </View>
      </View>

      {task.descricao ? (
        <Text style={styles.description}>
          {task.descricao}
        </Text>
      ) : null}

      {task.dataEntrega ? (
        <Text style={styles.date}>
          Prazo: {task.dataEntrega}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={
            completed ? 'Reabrir tarefa' : 'Concluir tarefa'
          }
        >
          <Text style={styles.buttonText}>
            {completed ? 'Reabrir' : 'Concluir'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Editar tarefa"
        >
          <Text style={styles.editText}>
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel="Excluir tarefa"
        >
          <Text style={styles.deleteText}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },

  completedCard: {
    opacity: 0.75,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  titleArea: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },

  completedText: {
    textDecorationLine: 'line-through',
  },

  status: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 5,
  },

  priority: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  priorityText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 14,
    lineHeight: 21,
  },

  date: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 12,
  },

  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },

  completeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 5,
  },

  editButton: {
    backgroundColor: colors.editBackground,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 5,
  },

  deleteButton: {
    backgroundColor: colors.deleteBackground,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 8,
    marginBottom: 5,
  },

  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },

  editText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },

  deleteText: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
