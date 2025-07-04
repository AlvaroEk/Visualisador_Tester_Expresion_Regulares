// Define la interfaz RegexExpression que representa una expresión regular
export interface RegexExpression {
  // Patrón de la expresión regular (por ejemplo: "\d+" para números)
  pattern: string;

  // Banderas utilizadas en la expresión regular (por ejemplo: "gi" para global e insensible a mayúsculas)
  flags: string;
}
