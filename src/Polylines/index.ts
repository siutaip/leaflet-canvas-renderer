import { canvasOverlay } from '../CanvasOverlay';
import type { Overlay } from '../types';
import type { Polyline, Props, Point, State } from './types';
import type { CanvasOverlayContext } from '../types';
import { drawPrimary, drawSecondary } from './renderer';
import { handleHover, handleClick } from './events';

const defaultProps: Props = {
  list: [],
  hoverColor: 'red',
  defaultColor: 'white',
};

export function Polylines(p: Props = {}) {
  const props = { ...defaultProps, ...p };

  const context: CanvasOverlayContext<State, Polyline> = {
    zIndex: 100,

    state: {
      list: [],
      viewport: [],
      paths: [],
      hovering: null,
    },

    events: function () {
      this._map.on('mousemove', handleHover.bind(this));
      this._map.on('click', handleClick.bind(this));
    },

    actions: {
      add: function (polyline) {
        if (Array.isArray(polyline)) {
          this.setState({ list: [...this.state.list, ...polyline] });
        } else {
          this.setState({ list: [...this.state.list, polyline] });
        }
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
      viewport: this.state.list.filter((route: Polyline) => {
        const pointsInViewport = route.points.filter(({ lat, lng }: Point) => {
          this._map.getBounds().contains({ lat, lng });
        });

        return pointsInViewport.length > 0;
      }),
    });
  }

  return overlay;
}
