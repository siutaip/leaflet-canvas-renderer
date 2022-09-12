import { MarkersState } from '../types';

type Injection = {
  overlay: any;
  markerIcon: any;
  markerShadow: any;
  state: MarkersState;
  defaults: any;
};

export default function ({
  overlay,
  state,
  markerIcon,
  markerShadow,
  defaults,
}: Injection) {
  function renderMarkers() {
    console.log('loaded', state.viewport);

    const canvas = overlay.canvas();
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(state.viewport).forEach((id) => {
      if (id === state.dragging || id === state.hovering) {
        return;
      }
      const { x, y } = state.viewport[id];

      renderMarker(x, y, canvas);
    });
  }

  function renderDraggingMarker() {
    const canvas = overlay.secondaryCanvas();
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!state.dragging) return;
    const { x, y } = state.viewport[state.dragging];
    renderMarker(x, y, canvas);
  }

  // function renderHoverMarker() {}

  function renderMarker(x: number, y: number, canvas: any) {
    const context = canvas.getContext('2d');

    context.drawImage(
      markerShadow,
      x - defaults.markerWidth / 2,
      y - defaults.markerHeight,
    );
    context.drawImage(
      markerIcon,
      x - defaults.markerWidth / 2,
      y - defaults.markerHeight,
    );
  }

  return {
    renderDraggingMarker,
    renderMarker,
    renderMarkers,
  };
}
