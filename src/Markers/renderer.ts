import { MarkersState, MarkersOptions, Position } from '../types';

type Injection = {
  overlay: any;
  state: MarkersState;
  options: MarkersOptions;
};

export default function ({ overlay, state, options }: Injection) {
  function renderMarkers() {
    const canvas = overlay.canvas();
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(state.viewport).forEach((id) => {
      if (id === state.dragging || id === state.hovering) {
        return;
      }
      const { x, y } = state.viewport[id];

      renderMarker(x, y, context);
    });
  }

  function renderDraggingMarker() {
    const canvas = overlay.secondaryCanvas();
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!state.dragging) return;
    const { x, y } = state.viewport[state.dragging];
    renderMarker(x, y, context);
  }

  // function renderHoverMarker() {}

  function renderMarker(
    x: number,
    y: number,
    context: CanvasRenderingContext2D,
  ) {
    if (typeof options.draw == 'function') {
      options.draw(context, { x, y });
    } else {
      drawPin(context, { x, y });
    }
  }

  function drawPin(context: CanvasRenderingContext2D, { x, y }: Position) {
    context.save();
    context.translate(x, y);

    context.beginPath();
    context.moveTo(0, 0);
    context.bezierCurveTo(2, -10, -20, -25, 0, -30);
    context.bezierCurveTo(20, -25, -2, -10, 0, 0);
    context.fillStyle = 'black';
    context.fill();
    context.strokeStyle = 'black';
    context.lineWidth = 1.5;
    context.stroke();
    context.beginPath();
    context.arc(0, -21, 3, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = 'black';
    context.fill();

    context.restore();
  }

  return {
    renderDraggingMarker,
    renderMarker,
    renderMarkers,
  };
}
