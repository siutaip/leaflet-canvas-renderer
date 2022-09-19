import type { Polyline } from './types';

export function drawPrimary() {
  const canvas = this.canvas();
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  this.setState({ paths: [] });

  this.state.list.forEach((polyline: Polyline) =>
    drawLine.call(this, context, {
      ...polyline,
      color: polyline.color || this.props.defaultColor || 'white',
    }),
  );
}

export function drawSecondary() {
  const context = this.secondaryCanvas().getContext('2d');
  const { width, height } = this.secondaryCanvas();
  context.clearRect(0, 0, width, height);

  if (this._map._data?.dragging) return;

  const id = this.state.hovering;
  if (!id) return;

  const { points } = this.state.list.find(
    ({ id: _id }: Polyline) => id === _id,
  );
  drawLine.call(
    this,
    context,
    {
      id,
      points,
      color: this.props.hoverColor || 'red',
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
    const { x, y } = this._map.latLngToContainerPoint({ lat, lng });

    if (index === 0) {
      path.moveTo(x, y);
      return;
    }

    path.lineTo(x, y);
  });

  context.stroke(path);

  this.setState({ paths: [...this.state.paths, { id, path }] });
}
