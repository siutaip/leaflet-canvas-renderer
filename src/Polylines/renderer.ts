import type { State, setState, Polyline, Point, Options } from './types';

export type Dependencies = {
  overlay: any;
  state: State;
  setState: setState;
  options: Options;
};

export default function Render({
  overlay,
  state,
  setState,
  options,
}: Dependencies) {
  function drawLines() {
    const canvas = overlay.canvas();
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    setState({ paths: [] });

    state.list.forEach((route) =>
      drawLine(context, {
        ...route,
        color: route.color || options.defaultColor || 'white',
      }),
    );
  }

  function renderActiveLine() {
    const canvas = overlay.secondaryCanvas();
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (overlay._map._data?.dragging) return;

    const id = state.hovering;
    if (!id) return;
    const { points } = state.list.find(({ id: _id }) => id === _id);
    drawLine(
      context,
      {
        id,
        points,
        color: options.hoverColor || 'red',
      },
      15,
    );
  }

  function drawLine(
    context: CanvasRenderingContext2D,
    { points, id, color }: Polyline,
    size = 4,
  ) {
    const path = new Path2D();
    context.strokeStyle = color;
    context.lineWidth = size;

    points.forEach(({ lat, lng }, index) => {
      const { x, y } = overlay._map.latLngToContainerPoint({ lat, lng });

      if (index === 0) {
        path.moveTo(x, y);
        return;
      }

      path.lineTo(x, y);
    });

    context.stroke(path);

    setState({ paths: [...state.paths, { id, path }] });
  }

  return {
    drawLines,
    renderActiveLine,
    drawLine,
  };
}
