export type State = {
  list: Array<Marker>;
  viewport: Array<MarkerWithPosition>;
  hovering: string;
  dragging: Marker;
  dragStart: Position;
};

export type setState = (state: { [key: string]: any }) => void;

export type Marker = {
  id: string;
  lat: number;
  lng: number;
  order: number;
};

export type MarkerWithPosition = Marker & {
  x: number;
  y: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Props = {
  list: Array<Marker>;
  onMove?: (marker: Marker) => void;
  onHover?: (id: string) => void;
  onClick?: (id: string) => void;
  preload?: () => Promise<void>;
  isUnderPoint?: (
    markerPosition: Position,
    cursorPosition: Position,
  ) => boolean;
  draw?: (context: CanvasRenderingContext2D, position: Position) => void;
};
