// RegexTesterScreen.tsx

import React, { useMemo } from 'react';
import { useRoute, useFocusEffect, RouteProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

import { RootStackParamList } from '../../../navigation/AppNavigator';
import { RegexTesterViewModel } from '../../features/regexTester/viewmodels/RegexTesterViewModel';
import { RegexParserDataSource } from '../../../data/datasources/RegexParserDataSource';
import { RegexRepositoryImpl } from '../../../data/repositories_impl/RegexRepositoryImpl';
import { ParseRegexUseCase } from '../../../domain/usecases/ParseRegexUseCase';
import { RegexTesterTemplate } from '../../components/templates/RegexTesterTemplate';

export const RegexTesterScreen = observer(() => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RegexTester'>>();

  const viewModel = useMemo(() => {
    const dataSource = new RegexParserDataSource();
    const repository = new RegexRepositoryImpl(dataSource);
    const useCase = new ParseRegexUseCase(repository);
    return new RegexTesterViewModel(useCase);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.pattern && typeof route.params.flags === 'string') {
        viewModel.setPattern(route.params.pattern);
        viewModel.setFlags(route.params.flags);
      }
    }, [route.params])
  );

  const exportAST = async (ast: any) => {
    try {
      const json = JSON.stringify(ast, null, 2);
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
      const timePart = now.toTimeString().slice(0, 5).replace(':', '');
      const filename = `regex_ast_${datePart}_${timePart}.json`;
      const folder = FileSystem.documentDirectory + 'ASTs/';
      const path = folder + filename;

      const folderInfo = await FileSystem.getInfoAsync(folder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
      }

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

  const goToDiagram = () => {
    const { nodes, connections } = viewModel.getVisualASTNodes();
    if (nodes.length === 0) {
      Alert.alert('AST vacío', 'No se ha generado el AST aún.');
      return;
    }
    navigation.navigate('ASTDiagram', { nodes, connections });
  };

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
      onOpenDiagram={goToDiagram} 
    />
  );
});
