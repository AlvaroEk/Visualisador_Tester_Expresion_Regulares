import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';

export const exportASTToDownloads = async (ast: any) => {
  try {
    const json = JSON.stringify(ast, null, 2);
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timePart = now.toTimeString().slice(0, 5).replace(':', '');
    const filename = `regex_ast_${datePart}_${timePart}.json`;

    const downloadPath =
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${filename}`
        : `${RNFS.DocumentDirectoryPath}/${filename}`;

    await RNFS.writeFile(downloadPath, json, 'utf8');

    Alert.alert('Archivo guardado', `El AST se guardó en:\n${downloadPath}`);
  } catch (error) {
    console.error('Error al guardar el AST:', error);
    Alert.alert('Error', 'No se pudo guardar el AST localmente.');
  }
};
