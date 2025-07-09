import React from 'react';
// Importa el componente Line para dibujar líneas SVG
import { Line } from 'react-native-svg';

interface Props {
  x1: number; // Coordenada X del punto inicial de la línea
  y1: number; // Coordenada Y del punto inicial de la línea
  x2: number; // Coordenada X del punto final de la línea
  y2: number; // Coordenada Y del punto final de la línea
}

// Componente funcional que dibuja una línea de conexión en el diagrama de ferrocarril
const RailroadConnection: React.FC<Props> = ({ x1, y1, x2, y2 }) => {
  return (
    <Line
      x1={x1}               // Coordenada X del inicio
      y1={y1}               // Coordenada Y del inicio
      x2={x2}               // Coordenada X del final
      y2={y2}               // Coordenada Y del final
      stroke="#000"         // Color de la línea (negro)
      strokeWidth={2}       // Grosor de la línea
    />
  );
};

export default RailroadConnection; // Exporta el componente para ser usado en el diagrama
