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
  dragStart: {
    x: number;
    y: number;
  };
};

export type Marker = {
  lat: number;
  lng: number;
  order: number;
};

export type MarkerWithId = Marker & {
  id: string;
};

export type MarkerWithPosition = Marker & {
  x: number;
  y: number;
};

export type List<Type> = {
  [key: string]: Type;
};

export type Position = {
  x: number;
  y: number;
};

export type MarkersOptions = {
  onMove: (marker: MarkerWithId) => void;
  onHover: (id: string) => void;
  onClick: (id: string) => void;
  markers: List<Marker>;
  preload: () => Promise<void>;
  hasTouch: (markerPosition: Position, cursorPosition: Position) => boolean;
  draw: (context: CanvasRenderingContext2D, position: Position) => void;
};
