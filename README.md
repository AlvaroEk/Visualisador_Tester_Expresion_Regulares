# 📐 Visualizador y Tester de Expresiones Regulares

Aplicación móvil desarrollada en **React Native con Expo** que permite **probar expresiones regulares en tiempo real**, visualizar su estructura sintáctica (AST) y gestionar un historial persistente de pruebas. Cumple con los criterios de evaluación del curso.

---

## ✨ Características

- 🎯 **Resaltado en tiempo real** de coincidencias en el texto de entrada.
- 🌳 **Visualización del AST** generado desde la expresión regular.
- 🧠 **Análisis sintáctico completo** mediante la librería `regexpp`.
- 💾 **Historial persistente** de las últimas 10 expresiones.
- 🔁 **Compatibilidad con flags**: `g`, `i`, `m`, `u`, `s`, `y`.
- 📤 **Exportación del AST** como archivo `.json`, con opción de compartir o guardar localmente.
- 🌙 **Soporte para modo oscuro** (automático según el sistema operativo).
- ✅ Arquitectura **CLEAN + MVVM + Feature First + Atomic Design**.

---

## 🧱 Estructura del Proyecto

```bash
├── src/
│   ├── data/
│   │   └── db/                 # Persistencia con SQLite
│   │   └── datasources/       # Fuente de datos Regex
│   │   └── repositories_impl/ # Implementaciones de repositorio
│   ├── domain/
│   │   └── entities/          # Entidades Regex
│   │   └── usecases/          # Casos de uso
│   ├── ui/
│   │   ├── components/        # Átomos, Moléculas, Organismos
│   │   ├── screens/           # Pantallas (RegexTester, Historial)
│   │   ├── templates/         # Plantillas
│   │   └── features/          # Feature First (RegexTester)
│   ├── store/                 # Estado global con Zustand
│   ├── theme/                 # Temas y colores
│   └── navigation/            # Navegación

🛠️ Tecnologías y Librerías
| Tecnología             | Uso principal                           |
| ---------------------- | --------------------------------------- |
| React Native + Expo    | Desarrollo móvil multiplataforma        |
| Zustand                | Estado global (historial, tema, input)  |
| SQLite (`expo-sqlite`) | Persistencia local del historial        |
| regexpp / regexp-tree  | Análisis y AST de expresiones regulares |
| `expo-file-system`     | Exportación local del AST               |
| `expo-sharing`         | Compartir archivos AST                  |
| `react-native-fs`      | Guardar archivos en la carpeta pública  |
| `@react-navigation`    | Navegación entre pantallas              |
| TypeScript             | Tipado estricto                         |
📷 Capturas de Pantalla
![image](https://github.com/user-attachments/assets/b6541083-44c5-44d5-92ba-71f05348d0d8)
![image](https://github.com/user-attachments/assets/86be2e34-4576-4837-bf29-9c91c5daeb6c)
![image](https://github.com/user-attachments/assets/d79c5d1d-d190-49c0-a854-8365f4bcfd29)
![image](https://github.com/user-attachments/assets/d5c70aba-2de3-4e88-a82e-d087a9fee0e7)
![image](https://github.com/user-attachments/assets/781d3d52-edff-46ce-8942-c0dcd0c19eb9)
![image](https://github.com/user-attachments/assets/9e8a1adc-b13e-4f21-8df0-73e26b204e99)
![image](https://github.com/user-attachments/assets/5652fb1e-6041-4e50-a8be-f048aa449abf)
![image](https://github.com/user-attachments/assets/7d701c9b-2476-449e-a5e2-b1453d337edf)


📦 Instalación y Uso
# Clona el repositorio
git clone https://github.com/tu-usuario/visualizador-expresiones.git

# Entra al proyecto
cd visualizador-expresiones

# Instala las dependencias
npm install

# Corre en Android o Web
npx expo start

🔐 Permisos Requeridos
Android:

Acceso a almacenamiento para guardar/exportar archivos AST.

iOS:

Soporte para compartir archivos (por ejemplo, vía AirDrop).

📤 Exportación de AST
Cuando una expresión válida genera un AST, puedes:

📁 Guardarlo como .json en la carpeta pública /Download

📤 Compartirlo por WhatsApp, Gmail, Drive, etc.

✅ El archivo tiene nombre automático: regex_ast_YYYYMMDD_HHmm.json
