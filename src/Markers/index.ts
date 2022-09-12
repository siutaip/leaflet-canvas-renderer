import { canvasOverlay } from '../CanvasOverlay';
import { setState, state } from '../state';
import Events from './events';
import Renderer from './renderer';
import { List, Marker, MarkerWithPosition } from '../types';

const defaults = {
  markerWidth: 25,
  markerHeight: 41,
};

export function Markers(markers = {}) {
  const overlay = canvasOverlay();
  const renderer = Renderer({ state, overlay, ...preloadImages(), defaults });
  const events = Events({ overlay, state, setState, renderer, defaults });

  function preloadImages(): { markerShadow: any; markerIcon: any } {
    const markerIcon = new Image();
    let imagesLoaded = 0;

    const imageLoad = () => {
      imagesLoaded += 1;
      if (imagesLoaded >= 2) render();
    };

    markerIcon.src = '/demo/marker-icon.png';
    markerIcon.onload = imageLoad;

    const markerShadow = new Image();
    markerShadow.src = '/demo/marker-shadow.png';
    markerShadow.onload = imageLoad;

    return { markerIcon, markerShadow };
  }

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
