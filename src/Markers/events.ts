import type { LeafletMouseEvent } from 'leaflet';
import { MarkerWithPosition, Position } from './types';
import { setDragging, saveMarkerPosition } from './actions';

/**
 * Return id of marker that position match with x and y position
 *
 * in case of multiple markers near by position, return marker
 * with highest order value
 *
 * @param {number} x
 * @param {number} y
 * @returns string | null
 */
export function findMarker(x: number, y: number): MarkerWithPosition {
  return (markersInPoint.call(this, x, y)[0] as MarkerWithPosition) || null;
}

function isUnderPoint(marker: Position, { x, y }: Position) {
  const width = 10;
  const height = 15;

  const markerStart = {
    x: marker.x - width / 2,
    y: marker.y - height,
  };
  const markerEnd = {
    x: marker.x + width / 2,
    y: marker.y,
  };

  if (x >= markerStart.x && x <= markerEnd.x) {
    if (y >= markerStart.y && y <= markerEnd.y) {
      return true;
    }
  }
  return false;
}

export function markersInPoint(x: number, y: number): MarkerWithPosition[] {
  return this.state.viewport.filter((marker: MarkerWithPosition) => {
    if (typeof this.props.draw === 'function') {
      if (typeof this.props.isUnderPoint === 'function') {
        return this.props.isUnderPoint(marker, { x, y });
      }
    } else {
      return isUnderPoint(marker, { x, y });
    }
  });
}

export function handleDragStart({
  containerPoint: { x, y },
}: LeafletMouseEvent) {
  const marker = findMarker.call(this, x, y);
  setDragging.call(this, marker);

  if (!marker) return;

  this.setState({
    dragStart: { x, y },
  });

  this._context.drawPrimary.call(this);
  this._context.drawSecondary.call(this);
}

export function handleDragMove({
  containerPoint: { x, y },
}: LeafletMouseEvent) {
  if (!this.state.dragging) return;

  setDragging.call(this, {
    ...this.state.dragging,
    x,
    y,
  });
  this._context.drawSecondary.call(this);
}

export function handleDragEnd({ containerPoint: { x, y } }: LeafletMouseEvent) {
  if (!this.state.dragging) return;

  if (this.state.dragStart.x === x && this.state.dragStart.y === y) {
    setDragging.call(this, false);
    return;
  }
  const { lat, lng } = this._map.containerPointToLatLng({ x, y });

  saveMarkerPosition.call(this, { lat, lng, x, y });

  if (typeof this.props.onMove === 'function') {
    this.props.onMove(this.state.dragging);
  }

  setDragging.call(this, false);
  this._context.drawPrimary.call(this);
  this._context.drawSecondary.call(this);
}

export function handleClick({ containerPoint: { x, y } }: LeafletMouseEvent) {
  const marker = findMarker.call(this, x, y);

  if (marker && typeof this.props.onClick === 'function') {
    this.props.onClick(marker.id);
  }
}

export function handleHover({ containerPoint: { x, y } }: LeafletMouseEvent) {
  const marker = findMarker.call(this, x, y);
  this._map._data.hovering = marker;

  if (marker && typeof this.props.onHover === 'function') {
    this.props.onHover(marker.id);
  }
}
