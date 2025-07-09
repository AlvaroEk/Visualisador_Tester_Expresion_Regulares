// Importaciones de React y hooks de navegación
import React, { useMemo } from 'react';
import {
  useRoute,
  useFocusEffect,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite'; // Para observar cambios de MobX en la UI
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system'; // Para manipular archivos en el sistema
import * as Sharing from 'expo-sharing'; // Para compartir archivos
import { Alert } from 'react-native'; // Para mostrar alertas nativas

// Importaciones de navegación y capa de dominio
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { RegexTesterViewModel } from '../../features/regexTester/viewmodels/RegexTesterViewModel';
import { RegexParserDataSource } from '../../../data/datasources/RegexParserDataSource';
import { RegexRepositoryImpl } from '../../../data/repositories_impl/RegexRepositoryImpl';
import { ParseRegexUseCase } from '../../../domain/usecases/ParseRegexUseCase';
import { RegexTesterTemplate } from '../../components/templates/RegexTesterTemplate';

// Componente principal observado por MobX
export const RegexTesterScreen = observer(() => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RegexTester'>>();

  // Memoiza la instancia del ViewModel para que no se regenere innecesariamente
  const viewModel = useMemo(() => {
    const dataSource = new RegexParserDataSource();
    const repository = new RegexRepositoryImpl(dataSource);
    const useCase = new ParseRegexUseCase(repository);
    return new RegexTesterViewModel(useCase);
  }, []);

  // Carga los parámetros de navegación (si los hay) al enfocar esta pantalla
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.pattern && typeof route.params.flags === 'string') {
        viewModel.setPattern(route.params.pattern);
        viewModel.setFlags(route.params.flags);
      }
    }, [route.params])
  );

  // Exporta el AST como JSON, permitiendo guardar o compartir
  const exportAST = async (ast: any) => {
    if (!ast) {
      Alert.alert('AST vacío', 'No se ha generado el AST para exportar.');
      return;
    }

    try {
      const json = JSON.stringify(ast, null, 2); // Serializa el AST con sangría
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
      const timePart = now.toTimeString().slice(0, 5).replace(':', '');
      const filename = `regex_ast_${datePart}_${timePart}.json`;
      const folder = FileSystem.documentDirectory + 'ASTs/';
      const path = folder + filename;

      // Crea la carpeta si no existe
      const folderInfo = await FileSystem.getInfoAsync(folder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
      }

      // Muestra opciones de exportación
      Alert.alert('Exportar AST', '¿Qué deseas hacer con el archivo?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar localmente',
          onPress: async () => {
            await FileSystem.writeAsStringAsync(path, json, {
              encoding: FileSystem.EncodingType.UTF8,
            });
            Alert.alert('Guardado', `Archivo guardado en:\nASTs/${filename}`);
          },
        },
        {
          text: 'Compartir',
          onPress: async () => {
            await FileSystem.writeAsStringAsync(path, json, {
              encoding: FileSystem.EncodingType.UTF8,
            });
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(path);
            } else {
              Alert.alert('Error', 'Compartir no está disponible en este dispositivo');
            }
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo exportar el AST');
    }
  };

  // Navega a la pantalla del diagrama AST
  const goToDiagram = () => {
    try {
      const { nodes, connections } = viewModel.getVisualASTNodes();

      if (nodes.length === 0) {
        Alert.alert('AST vacío', 'No se ha generado un AST visualizable.');
        return;
      }

      if (nodes.length > 250) {
        Alert.alert(
          'AST demasiado complejo',
          'Este árbol contiene más de 250 nodos y podría cerrar la app. Intenta simplificar la expresión.'
        );
        return;
      }

      navigation.navigate('ASTDiagram', { nodes, connections });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo generar el diagrama AST.');
    }
  };

  // Navega a la pantalla del diagrama de ferrocarril
  const goToRailroad = () => {
    const expression = viewModel.pattern;
    if (!expression) {
      Alert.alert(
        'Expresión vacía',
        'Por favor, ingresa una expresión regular.'
      );
      return;
    }
    navigation.navigate('RailroadDiagram', { pattern: expression });
  };

  // Renderiza el template principal con todos los datos del ViewModel
  return (
    <RegexTesterTemplate
      inputText={viewModel.inputText}
      pattern={viewModel.pattern}
      flags={viewModel.flags}
      matches={viewModel.result?.matches ?? []}
      indices={viewModel.result?.indices ?? []}
      ast={viewModel.result?.ast ?? null}
      flagError={viewModel.flagError ?? undefined}
      onInputChange={viewModel.setInputText.bind(viewModel)}
      onPatternChange={viewModel.setPattern.bind(viewModel)}
      onFlagsChange={viewModel.setFlags.bind(viewModel)}
      onOpenHistory={() => navigation.navigate('History')}
      onExportAST={() => exportAST(viewModel.result?.ast)}
      onOpenDiagram={goToDiagram}
      onOpenRailroad={goToRailroad}
    />
  );
});
