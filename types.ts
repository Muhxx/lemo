export enum ShapeType {
  Galaxy = 'Galaxy',
  KochCurve = 'Koch Curve',
  Cardioid = 'Cardioid',
  Butterfly = 'Butterfly',
  Archimedean = 'Archimedean Spiral',
  Catenary = 'Catenary',
  Lemniscate = 'Lemniscate',
  Rose = 'Rose Curve',
}

export interface AppState {
  currentShape: ShapeType;
  isAutoPlay: boolean;
  speed: number;
  particleCount: number;
  color: string;
}
