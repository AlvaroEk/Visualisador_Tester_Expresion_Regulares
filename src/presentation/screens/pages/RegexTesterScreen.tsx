// Importa React y el hook useMemo
import React, { useMemo } from 'react';
// Importa navegación, acceso a parámetros de ruta y ciclo de foco de pantalla
import { useRoute, useFocusEffect, RouteProp, useNavigation } from '@react-navigation/native';
// Importa observer para hacer el componente reactivo con MobX
import { observer } from 'mobx-react-lite';
// Importa tipo para navegación con stack
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Importa utilidades de sistema de archivos de Expo
import * as FileSystem from 'expo-file-system';
// Importa utilidades para compartir archivos
import * as Sharing from 'expo-sharing';
// Importa alertas nativas
import { Alert } from 'react-native';

// Importa tipo de parámetros de navegación
import { RootStackParamList } from '../../../navigation/AppNavigator';
// Importa el ViewModel para gestionar estado y lógica del regex tester
import { RegexTesterViewModel } from '../../features/regexTester/viewmodels/RegexTesterViewModel';
// Importa la fuente de datos que parsea expresiones regulares
import { RegexParserDataSource } from '../../../data/datasources/RegexParserDataSource';
// Importa implementación concreta del repositorio
import { RegexRepositoryImpl } from '../../../data/repositories_impl/RegexRepositoryImpl';
// Importa el caso de uso para analizar expresiones regulares
import { ParseRegexUseCase } from '../../../domain/usecases/ParseRegexUseCase';
// Importa la plantilla visual del componente
import { RegexTesterTemplate } from '../../components/templates/RegexTesterTemplate';

// Componente principal que representa la pantalla de prueba de expresiones regulares
export const RegexTesterScreen = observer(() => {
  // Hook para acceder a la navegación
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Hook para acceder a los parámetros de ruta
  const route = useRoute<RouteProp<RootStackParamList, 'RegexTester'>>();

  // Memoiza la instancia del ViewModel y sus dependencias
  const viewModel = useMemo(() => {
    const dataSource = new RegexParserDataSource();
    const repository = new RegexRepositoryImpl(dataSource);
    const useCase = new ParseRegexUseCase(repository);
    return new RegexTesterViewModel(useCase);
  }, []);

  // Al enfocarse la pantalla, actualiza los campos si hay parámetros
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.pattern && typeof route.params.flags === 'string') {
        viewModel.setPattern(route.params.pattern);
        viewModel.setFlags(route.params.flags);
      }
    }, [route.params])
  );

  // Función que exporta el AST como archivo .json
  const exportAST = async (ast: any) => {
    try {
      const json = JSON.stringify(ast, null, 2); // Convierte el AST a JSON bonito
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
      const timePart = now.toTimeString().slice(0, 5).replace(':', '');
      const filename = `regex_ast_${datePart}_${timePart}.json`;
      const folder = FileSystem.documentDirectory + 'ASTs/';
      const path = folder + filename;

      // Verifica si la carpeta ASTs existe, si no la crea
      const folderInfo = await FileSystem.getInfoAsync(folder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
      }

      // Muestra opciones para guardar o compartir el archivo
      Alert.alert(
        'Exportar AST',
        '¿Qué deseas hacer con el archivo?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Guardar localmente',
            onPress: async () => {
              await FileSystem.writeAsStringAsync(path, json, {
                encoding: FileSystem.EncodingType.UTF8,
              });
              Alert.alert('Guardado', `Archivo guardado localmente en:\nASTs/${filename}`);
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
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo exportar el AST');
    }
  };

  // Renderiza la plantilla del tester con las propiedades del ViewModel
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
      onExportAST={exportAST}
    />
  );
});
