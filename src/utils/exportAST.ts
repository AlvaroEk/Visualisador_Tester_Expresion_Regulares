// Importa la librería react-native-fs para manejar archivos del sistema
import RNFS from 'react-native-fs';
// Importa componentes de React Native para alertas y detección de plataforma
import { Alert, Platform } from 'react-native';

// Función asíncrona que exporta un AST (árbol de sintaxis abstracta) como archivo JSON
export const exportASTToDownloads = async (ast: any) => {
  try {
    // Convierte el objeto AST a una cadena JSON formateada
    const json = JSON.stringify(ast, null, 2);

    // Genera la fecha y hora actuales
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timePart = now.toTimeString().slice(0, 5).replace(':', ''); // HHMM

    // Crea un nombre de archivo único con fecha y hora
    const filename = `regex_ast_${datePart}_${timePart}.json`;

    // Define la ruta de descarga dependiendo del sistema operativo
    const downloadPath =
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${filename}`     // Ruta de descargas en Android
        : `${RNFS.DocumentDirectoryPath}/${filename}`     // Ruta de documentos en iOS

    // Escribe el archivo JSON en la ruta determinada
    await RNFS.writeFile(downloadPath, json, 'utf8');

    // Muestra una alerta confirmando que el archivo se guardó
    Alert.alert('Archivo guardado', `El AST se guardó en:\n${downloadPath}`);
  } catch (error) {
    // En caso de error, muestra un mensaje por consola y una alerta al usuario
    console.error('Error al guardar el AST:', error);
    Alert.alert('Error', 'No se pudo guardar el AST localmente.');
  }
};
