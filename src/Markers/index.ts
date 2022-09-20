import { canvasOverlay } from '../CanvasOverlay';
import type { Overlay } from '../types';
import type { Marker, MarkerWithPosition, Props, State } from './types';
import type { CanvasOverlayContext } from '../types';
import { drawPrimary, drawSecondary } from './renderer';
import {
  handleHover,
  handleClick,
  handleDragStart,
  handleDragEnd,
  handleDragMove,
} from './events';
import { LeafletMouseEvent } from 'leaflet';

export function Markers(props: Props = { list: [] }) {
  const context: CanvasOverlayContext<State> = {
    zIndex: 200,

    state: {
      list: [],
      viewport: [],
      dragging: null,
      hovering: null,
      dragStart: null,
    },

    onAdd: function () {
      if (typeof this.props.preload === 'function') {
        this.props.preload().then(() => this.redraw());
      }

      this._map.on('click', handleClick.bind(this));
      this._map.on('mouseup', handleDragEnd.bind(this));
      this._map.on('mousemove', (e: LeafletMouseEvent) => {
        handleDragMove.call(this, e);
        handleHover.call(this, e);
      });
      this._map.on('mousedown', handleDragStart.bind(this));
    },

    onRemove: function () {
      this._map.off('click');
      this._map.off('mousedown');
      this._map.off('mouseup');
      this._map.off('mousemove');
    },

    drawPrimary,
    drawSecondary,
    setupViewport,
  };

  const overlay: Overlay<Props, Marker> = canvasOverlay(context, props);

  function setupViewport() {
    this.setState({
      viewport: this.state.list
        .filter(({ lat, lng }: Marker) =>
          overlay._map.getBounds().contains({ lat, lng }),
        )
        .map((marker: Marker) => {
          const { lat, lng } = marker;
          const { x, y } = overlay._map.latLngToContainerPoint({ lat, lng });
          return { ...marker, x, y } as MarkerWithPosition;
        }),
    });
  }

  return overlay;
}
