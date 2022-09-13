import { canvasOverlay } from '../CanvasOverlay';
import { setState, state } from '../state';
import Events from './events';
import Renderer from './renderer';
import { List, Marker, MarkerWithPosition, MarkersOptions } from '../types';

export function Markers(options: MarkersOptions) {
  const overlay = canvasOverlay();
  const markers = options.markers;
  const renderer = Renderer({ state, overlay, options });
  const events = Events({ overlay, state, setState, renderer, options });
  options.preload().then(() => render());

  setState({ ...state, markers });

  function update() {
    setupViewport();
  }

  function render() {
    renderer.renderMarkers();
    renderer.renderDraggingMarker();
  }

  function setupViewport() {
    const viewport: List<MarkerWithPosition> = {};

    Object.keys(state.list).forEach((id) => {
      const { lat, lng } = state.list[id];
      if (overlay._map.getBounds().contains({ lat, lng })) {
        const pos = overlay._map.latLngToContainerPoint({ lat, lng });
        viewport[id] = { lat, lng, x: pos.x, y: pos.y } as MarkerWithPosition;
      }
    });

    setState({ viewport });
  }

  return {
    overlay,

    addTo(map: any) {
      overlay.addTo(map);

      setupViewport();

      map.on('mousedown', events.handleDragStart);
      map.on('mouseup', events.handleDragEnd);
      map.on('mousemove', events.handleDragMove);

      map.on('move', () => {
        update();
        render();
      });
    },

    add(list: List<Marker>) {
      setState({
        list: { ...state.list, ...list },
      });
      setupViewport();
      render();
    },
  };
}
