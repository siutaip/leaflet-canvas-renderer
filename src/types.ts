export type CanvasEventTarget = {
  type: 'polyline' | 'marker' | null;
  id: string | null;
};

export type CanvasEvent = {
  name: string;
  target: CanvasEventTarget;
};

export type MarkersState = {
  list: List<Marker>;
  viewport: List<MarkerWithPosition>;
  dragging: string;
  hovering: string;
  event: CanvasEvent | null;
};

export type Marker = {
  lat: number;
  lng: number;
  order: number;
};

export type MarkerWithPosition = Marker & {
  x: number;
  y: number;
};

export type List<Type> = {
  [key: string]: Type;
};
