import type { LeafletMouseEvent } from 'leaflet';
import { Path } from './types';

export function handleHover({ containerPoint: { x, y } }: LeafletMouseEvent) {
  if (
    this._map._data?.dragging ||
    this._map._data?.hovering ||
    this._map.isDragging
  ) {
    this.setState({ hovering: null });
    this._context.drawSecondary.call(this);
    return;
  }

  const route = this.state.paths.find(
    ({ id }: Path) => id === this.state.hovering,
  );
  if (
    route &&
    this.secondaryCanvas().getContext('2d').isPointInStroke(route.path, x, y)
  ) {
    return;
  }

  this.setState({ hovering: null });

  this.state.paths.forEach(({ id, path }: Path) => {
    if (this.canvas().getContext('2d').isPointInStroke(path, x, y)) {
      this.setState({ hovering: id });
    }
  });
  this._context.drawSecondary.call(this);

  if (this.state.hovering && typeof this.props.onHover === 'function') {
    this.props.onHover(this.state.hovering);
  }
}

export function handleClick({ containerPoint: { x, y } }: LeafletMouseEvent) {
  if (this._map._data?.dragging) return;

  let clicked = null;

  this.state.paths.forEach(({ id, path }: Path) => {
    if (this.canvas().getContext('2d').isPointInStroke(path, x, y)) {
      clicked = id;
    }
  });

  if (clicked && typeof this.props.onClick === 'function') {
    this.props.onClick(clicked);
  }
}
