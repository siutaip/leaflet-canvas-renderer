import type { Marker, MarkerWithPosition, Position } from './types';

export function drawPrimary() {
  const canvas = this.canvas();
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  this.state.viewport.forEach((marker: MarkerWithPosition) => {
    if (marker.id === this.state.dragging?.id) return;

    renderMarker.call(this, marker.x, marker.y, context);
  });
}

export function drawSecondary() {
  const canvas = this.secondaryCanvas();
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!this.state.dragging) return;
  const { x, y } = this.state.dragging;
  renderMarker.call(this, x, y, context);
}

function renderMarker(x: number, y: number, context: CanvasRenderingContext2D) {
  if (typeof this.props.draw == 'function') {
    this.props.draw(context, { x, y });
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
