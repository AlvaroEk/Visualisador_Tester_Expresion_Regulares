import React from 'react';
// Importa elementos SVG para definir gradientes y marcadores (como flechas)
import { Defs, LinearGradient, Stop, Marker, Path } from 'react-native-svg';

interface ASTDefsProps {
  pathColor: string; // Color que se usará en la flecha del marcador
}

// Componente que define elementos SVG reutilizables como gradientes y flechas
const ASTDefs: React.FC<ASTDefsProps> = ({ pathColor }) => {
  const safeColor = pathColor || '#000000'; // Valor por defecto si no se proporciona color

  return (
    <Defs>
      {/* Gradiente para nodos en modo claro */}
      <LinearGradient id="nodeGradientLight" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#90caf9" />
        <Stop offset="100%" stopColor="#e3f2fd" />
      </LinearGradient>

      {/* Gradiente para nodos en modo oscuro */}
      <LinearGradient id="nodeGradientDark" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#3b82f6" />
        <Stop offset="50%" stopColor="#0ea5e9" />
        <Stop offset="100%" stopColor="#1e3a8a" />
      </LinearGradient>

      {/* Flecha para el final de las conexiones */}
      <Marker
        id="arrow"
        markerWidth="10"
        markerHeight="10"
        refX="6"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <Path d="M0,0 L0,6 L6,3 Z" fill={safeColor} />
      </Marker>
    </Defs>
  );
};

export default ASTDefs; // Exporta el componente para ser usado dentro del SVG principal
