import { LatLng } from 'leaflet';
import { MarkerWithPosition, Marker, Position } from './types';

/**
 * @param {string | null | false } dragging  Marker.id or false to stop dragging
 */
export function setDragging(dragging: boolean | Marker = false) {
  if (!this._map._data) {
    this._map._data = {};
  }

  if (!dragging) {
    this._map._data.dragging = null;
    this._map.dragging.enable();
  } else {
    this._map.dragging.disable();
    this._map._data.dragging = dragging;
  }

  if (typeof dragging !== 'boolean') {
    this.setState({
      dragging,
    });
  }
}

export function saveMarkerPosition({ lat, lng, x, y }: Position & LatLng) {
  if (!this.state.dragging) return;

  this.setState({
    list: [
      ...this.state.list.map((marker: Marker) => {
        if (marker.id !== this.state.dragging.id) return marker;

        return { ...marker, lat, lng };
      }),
    ],
    viewport: [
      ...this.state.viewport.map((marker: MarkerWithPosition) => {
        if (marker.id !== this.state.dragging.id) return marker;
        return { ...marker, lat, lng, x, y };
      }),
    ],
    dragging: null,
  });
}
