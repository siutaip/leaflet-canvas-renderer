import { canvasOverlay } from '../CanvasOverlay';
import type { Map } from 'leaflet';
import type { Polyline, Options, Point } from './types';
import { createState } from './state';
import Renderer from './renderer';
import Events from './events';

export function Polylines(options: Options) {
  const overlay = canvasOverlay({
    zIndex: 100,
  });
  const { state, setState } = createState();
  const renderer = Renderer({ state, setState, overlay, options });
  const events = Events({ overlay, state, setState, renderer, options });

  setState({ list: options.list || [] });

  function update() {
    setupViewport();
  }

  function setupViewport() {
    setState({
      viewport: state.list.filter((route: Polyline) => {
        const pointsInViewport = route.points.filter(({ lat, lng }: Point) => {
          overlay._map.getBounds().contains({ lat, lng });
        });

        return pointsInViewport.length > 0;
      }),
    });
  }

  function render() {
    renderer.drawLines();
    renderer.renderActiveLine();
  }

  return {
    overlay,

    addTo(map: any) {
      overlay.addTo(map);

      setupViewport();

      map.on('mousemove', events.handleHover);
      map.on('click', events.handleClick);

      map.on('moveend', () => {
        update();
        render();
      });

      map.on('movestart', () => {
        map.isDragging = true;
      });

      map.on('moveend', () => {
        map.isDragging = false;
      });
    },

    add(list: Array<Polyline>) {
      setState({
        list: [...state.list, ...list],
      });
      setupViewport();
      render();
    },
  };
}
