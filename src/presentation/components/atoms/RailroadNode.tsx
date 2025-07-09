import React from 'react';
// Importa el componente Circle para dibujar un nodo circular en SVG
import { Circle } from 'react-native-svg';

interface Props {
  cx: number;             // Coordenada X del centro del nodo
  cy: number;             // Coordenada Y del centro del nodo
  type: 'start' | 'end';  // Tipo de nodo: inicio o fin
}

// Componente funcional que representa un nodo circular en el diagrama de ferrocarril
const RailroadNode: React.FC<Props> = ({ cx, cy, type }) => {
  return (
    <Circle
      cx={cx}                                // Posición horizontal del centro del círculo
      cy={cy}                                // Posición vertical del centro del círculo
      r={6}                                  // Radio fijo del nodo
      fill={type === 'start' ? 'green' : 'red'} // Color del nodo: verde para inicio, rojo para fin
    />
  );
};

export default RailroadNode; // Exporta el componente para usarlo en el diagrama
