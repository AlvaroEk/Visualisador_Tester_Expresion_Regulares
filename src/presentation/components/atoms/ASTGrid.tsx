import React from 'react';
// Importa el componente Rect para dibujar rectángulos en SVG
import { Rect } from 'react-native-svg';

interface ASTGridProps {
  width: number;           // Ancho total del área del diagrama
  height: number;          // Alto total del área del diagrama
  backgroundColor: string; // Color de fondo
  gridColor: string;       // Color de las líneas de la cuadrícula
}

// Componente que dibuja un fondo cuadriculado (como una hoja milimétrica)
const ASTGrid: React.FC<ASTGridProps> = ({
  width,
  height,
  backgroundColor,
  gridColor,
}) => {
  if (!width || !height) return null; // Si no hay dimensiones válidas, no se renderiza

  const cellSize = 40; // Tamaño de cada celda de la cuadrícula
  const cellsX = Math.ceil(width / cellSize);  // Número de columnas
  const cellsY = Math.ceil(height / cellSize); // Número de filas

  return (
    <>
      {/* Fondo completo */}
      <Rect width={width} height={height} fill={backgroundColor} />

      {/* Celdas de la cuadrícula */}
      {[...Array(cellsY)].map((_, y) =>
        [...Array(cellsX)].map((_, x) => (
          <Rect
            key={`${x}-${y}`}                 // Clave única para cada celda
            x={x * cellSize}                 // Posición horizontal
            y={y * cellSize}                 // Posición vertical
            width={cellSize}                 // Ancho de celda
            height={cellSize}                // Alto de celda
            fill="none"                      // Sin relleno, solo borde
            stroke={gridColor}               // Color de línea
            strokeWidth={0.3}                // Grosor de línea muy delgado
          />
        ))
      )}
    </>
  );
};

export default ASTGrid; // Exporta el componente para usarlo dentro del SVG principal
