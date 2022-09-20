export type CanvasOverlayContext<State> = {
  onAdd?: () => void;
  onRemove?: () => void;
  drawPrimary: () => void;
  drawSecondary: () => void;
  setupViewport: () => void;

  zIndex?: number;
  state?: State;
};

export type Overlay<Props, Item> = {
  [key: string]: any;
  props: Props;
  add: (item: Item | Array<Item>) => void;
};
