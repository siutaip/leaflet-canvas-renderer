export type Path = {
  path: Path2D;
  id: string;
};

export type State = {
  list: Array<Polyline>;
  viewport: Array<Polyline>;
  paths: Array<Path>;
  hovering: string;
};

export type setState = (state: { [key: string]: any }) => void;

export type Point = {
  lat: number;
  lng: number;
};

export type Polyline = {
  id: string;
  points: Array<Point>;
  color?: string;
};

export type Props = {
  onHover?: (id: string) => void;
  onClick?: (id: string) => void;
  list?: Array<Polyline>;
  hoverColor?: string;
  defaultColor?: string;
};
