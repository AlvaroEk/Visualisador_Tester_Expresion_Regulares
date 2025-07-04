// Define un objeto Colors que contiene los esquemas de color para temas claro y oscuro
export const Colors = {
  // Colores usados cuando el tema es claro
  light: {
    background: '#ffffff',       // Fondo general (blanco)
    text: '#000000',             // Texto principal (negro)
    secondaryText: '#555555',    // Texto secundario (gris medio)
    border: '#cccccc',           // Borde de elementos (gris claro)
    highlight: '#f0f0f0',        // Resaltado o fondo de elementos seleccionados (gris muy claro)
    accent: '#4caf50',           // Color de acento (verde)
    chip: '#e0e0e0',             // Fondo de chips o etiquetas inactivas (gris claro)
    chipActive: '#007bff',       // Fondo de chips activos o destacados (azul)
    surface: '#f8f8f8',          // Fondo de superficies o tarjetas (gris casi blanco)
    card: '#f2f2f2',             // Fondo de tarjetas (gris claro)
  },
  // Colores usados cuando el tema es oscuro
  dark: {
    background: '#0f0f0f',       // Fondo general (casi negro)
    text: '#e0e0e0',             // Texto principal (gris claro)
    secondaryText: '#aaaaaa',    // Texto secundario (gris medio claro)
    border: '#333333',           // Borde de elementos (gris oscuro)
    highlight: '#1f1f1f',        // Resaltado o fondo de elementos seleccionados (gris oscuro)
    accent: '#4caf50',           // Color de acento (verde, igual que en modo claro)
    chip: '#1e1e1e',             // Fondo de chips o etiquetas inactivas (gris muy oscuro)
    chipActive: '#00bfff',       // Fondo de chips activos o destacados (azul claro)
    surface: '#181818',          // Fondo de superficies o tarjetas (gris muy oscuro)
    card: '#222222',             // Fondo de tarjetas (gris oscuro)
  },
};
