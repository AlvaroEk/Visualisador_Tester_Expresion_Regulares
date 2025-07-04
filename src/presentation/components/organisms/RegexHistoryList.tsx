// Importa React y hooks para estado y efecto
import React, { useEffect, useState } from 'react';
// Importa componentes de UI y utilidades desde React Native
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
// Importa funciones y tipos para manejar el historial desde SQLite
import {
  fetchHistory,
  deleteHistoryItem,
  RegexHistoryItem,
} from '../../../data/db/sqlite';
// Hook que detecta si la pantalla está enfocada actualmente
import { useIsFocused } from '@react-navigation/native';
// Importa el store que gestiona el modo oscuro/claro
import { themeStore } from '../../../store/themeStore';
// Importa los colores según el tema
import { Colors } from '../../../theme/colors';

// Define las props del componente
interface Props {
  // Función opcional que se llama al seleccionar un ítem
  onSelect?: (item: { pattern: string; flags: string }) => void;
}

// Componente que muestra una lista del historial de expresiones regulares
export const RegexHistoryList = ({ onSelect }: Props) => {
  // Estado local que almacena los ítems del historial
  const [history, setHistory] = useState<RegexHistoryItem[]>([]);

  // Detecta si la pantalla está activa
  const isFocused = useIsFocused();

  // Detecta si el tema actual es oscuro
  const isDark = themeStore.resolvedMode === 'dark';

  // Obtiene el tema correspondiente
  const theme = isDark ? Colors.dark : Colors.light;

  // Cada vez que la pantalla se enfoca, se recarga el historial
  useEffect(() => {
    loadHistory();
  }, [isFocused]);

  // Función para cargar el historial desde SQLite
  const loadHistory = async () => {
    const all = await fetchHistory();
    setHistory(all.slice(0, 10)); // Muestra solo las últimas 10 expresiones
  };

  // Función que muestra alerta y elimina un ítem si se confirma
  const handleDelete = (id: number) => {
    Alert.alert('Eliminar', '¿Deseas eliminar esta expresión del historial?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteHistoryItem(id); // Elimina de la base de datos
          loadHistory();               // Recarga el historial
        },
      },
    ]);
  };

  // Renderiza cada ítem de la lista
  const renderItem = ({ item }: { item: RegexHistoryItem }) => (
    <View style={[styles.item, { backgroundColor: theme.surface }]}>
      <TouchableOpacity
        style={styles.textArea}
        onPress={() =>
          onSelect?.({ pattern: item.pattern, flags: item.flags }) // Notifica la selección
        }
      >
        <Text style={[styles.text, { color: theme.text }]}>
          /{item.pattern}/ {item.flags} {/* Muestra la expresión en formato regex */}
        </Text>
        <Text style={[styles.timestamp, { color: theme.secondaryText }]}>
          {new Date(item.timestamp).toLocaleString()} {/* Muestra la fecha y hora */}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleDelete(item.id)} // Botón para eliminar el ítem
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={history} // Lista de expresiones a mostrar
      keyExtractor={(item) => item.id.toString()} // Clave única por ítem
      renderItem={renderItem} // Componente que renderiza cada fila
      contentContainerStyle={{ paddingBottom: 20 }} // Espaciado inferior
    />
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  textArea: {
    flex: 1,
    paddingRight: 12,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 20,
  },
});
