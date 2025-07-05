export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
  label?: string;
}
