// export type CanvasEventTarget = {
//   type: 'polyline' | 'marker' | null;
//   id: string | null;
// };

// export type CanvasEvent = {
//   name: string;
//   target: CanvasEventTarget;
// };

export type CanvasOverlayContext<State, Item> = {
  events?: () => void;
  drawPrimary: () => void;
  drawSecondary: () => void;
  setupViewport: () => void;

  zIndex?: number;
  state?: State;
  actions?: {
    add: (polyline: Item | Array<Item>) => void;
  };
};

export type Overlay<Props> = {
  [key: string]: any;
  props: Props;
};
