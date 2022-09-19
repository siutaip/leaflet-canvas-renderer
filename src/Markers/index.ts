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

export function Markers(props: Props = { list: [] }) {
  const context: CanvasOverlayContext<State, Marker> = {
    zIndex: 200,

    state: {
      list: [],
      viewport: [],
      dragging: null,
      hovering: null,
      dragStart: null,
    },

    events: function () {
      if (typeof this.props.preload === 'function') {
        this.props.preload().then(() => this.redraw());
      }

      this._map.on('click', handleClick.bind(this));
      this._map.on('mousemove', handleHover.bind(this));
      this._map.on('mousedown', handleDragStart.bind(this));
      this._map.on('mouseup', handleDragEnd.bind(this));
      this._map.on('mousemove', handleDragMove.bind(this));
    },

    actions: {
      add: function (marker) {
        if (Array.isArray(marker)) {
          this.setState({ list: [...this.state.list, ...marker] });
        } else {
          this.setState({ list: [...this.state.list, marker] });
        }
        setupViewport.call(this);
        this.redraw();
      },
    },

    drawPrimary,
    drawSecondary,
    setupViewport,
  };

  const overlay: Overlay<Props> = canvasOverlay(context, props);

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
