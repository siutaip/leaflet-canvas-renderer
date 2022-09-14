import type { LeafletMouseEvent } from 'leaflet';
import { Options, setState, State } from './types';

type Dependencies = {
  renderer: any;
  state: State;
  setState: setState;
  overlay: any;
  options: Options;
};

export default function Events({
  renderer,
  state,
  setState,
  overlay,
  options,
}: Dependencies) {
  function handleHover({ containerPoint: { x, y } }: LeafletMouseEvent) {
    renderer.renderActiveLine();

    if (overlay._map._data?.dragging || overlay._map.isDragging) return;

    const route = state.paths.find(({ id }) => id === state.hovering);
    if (
      route &&
      overlay
        .secondaryCanvas()
        .getContext('2d')
        .isPointInStroke(route.path, x, y)
    ) {
      return;
    }

    setState({ hovering: null });

    state.paths.forEach(({ id, path }) => {
      if (overlay.canvas().getContext('2d').isPointInStroke(path, x, y)) {
        setState({ hovering: id });
      }
    });
    renderer.renderActiveLine();

    if (state.hovering && typeof options.onHover === 'function') {
      options.onHover(state.hovering);
    }
  }

  function handleClick({ containerPoint: { x, y } }: LeafletMouseEvent) {
    if (overlay._map._data?.dragging) return;

    let clicked = null;

    state.paths.forEach(({ id, path }) => {
      if (overlay.canvas().getContext('2d').isPointInStroke(path, x, y)) {
        clicked = id;
      }
    });

    if (clicked && typeof options.onClick === 'function') {
      options.onClick(clicked);
    }
  }

  return { handleHover, handleClick };
}
