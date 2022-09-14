import { MarkersOptions } from 'src/types';
import Actions from './actions';
import { LeafletMouseEvent } from 'leaflet';

export default function ({
  overlay,
  setState,
  state,
  renderer,
  options,
}: {
  overlay: any;
  state: any;
  setState: any;
  renderer: any;
  options: MarkersOptions;
}) {
  const actions = Actions({ state, setState, overlay });
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
  function findMarker(x: number, y: number) {
    return (
      markersInPoint(x, y)
        .map((id) => ({ id, ...state.viewport[id] }))
        // @todo: verify ordering
        .sort((a, b) => {
          if (a.order > b.order) {
            return -1;
          }
          if (a.order < b.order) {
            return -1;
          }

          return 0;
        })[0]?.id || null
    );
  }

  function markersInPoint(x: number, y: number) {
    return Object.keys(state.viewport).reduce((markers, id) => {
      const marker = state.viewport[id];

      const markerPosition = {
        x: marker.x,
        y: marker.y,
      };

      const cursorPosition = { x, y };

      if (options.hasTouch(markerPosition, cursorPosition)) {
        return [...markers, id];
      }

      return markers;
    }, []);
  }

  function handleDragStart({ containerPoint: { x, y } }: LeafletMouseEvent) {
    actions.setDragging(findMarker(x, y));
    setState({
      dragStart: { x, y },
    });
    renderer.renderMarkers();
    renderer.renderDraggingMarker();
  }

  function handleDragMove({ containerPoint: { x, y } }: LeafletMouseEvent) {
    if (!state.dragging) return;

    setState({
      viewport: {
        ...state.viewport,
        [state.dragging]: {
          ...state.viewport[state.dragging],
          x,
          y,
        },
      },
    });
    renderer.renderDraggingMarker();
  }

  function handleDragEnd({ containerPoint: { x, y } }: LeafletMouseEvent) {
    if (!state.dragging) return;

    if (state.dragStart.x === x && state.dragStart.y === y) {
      actions.setDragging(false);
      return;
    }
    const { lat, lng } = overlay._map.containerPointToLatLng({ x, y });

    actions.saveMarkerPosition({ lat, lng });

    options.onMove({
      id: state.dragging,
      ...state.list[state.dragging],
    });

    actions.setDragging(false);
    renderer.renderMarkers();
    renderer.renderDraggingMarker();
  }

  function handleClick({ containerPoint: { x, y } }: LeafletMouseEvent) {
    const id = findMarker(x, y);

    if (id && typeof options.onClick === 'function') {
      options.onClick(id);
    }
  }

  function handleHover({ containerPoint: { x, y } }: LeafletMouseEvent) {
    const id = findMarker(x, y);

    if (id && typeof options.onHover === 'function') {
      options.onHover(id);
    }
  }

  return {
    handleDragEnd,
    handleDragMove,
    handleDragStart,
    handleClick,
    handleHover,
  };
}
