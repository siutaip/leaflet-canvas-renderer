import Actions from './actions';

export default function ({
  overlay,
  setState,
  state,
  defaults,
  renderer,
}: {
  overlay: any;
  state: any;
  setState: any;
  defaults: any;
  renderer: any;
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

      const markerStart = {
        x: marker.x - defaults.markerWidth / 2,
        y: marker.y - defaults.markerHeight,
      };
      const markerEnd = {
        x: marker.x + defaults.markerWidth / 2,
        y: marker.y,
      };

      if (x >= markerStart.x && x <= markerEnd.x) {
        if (y >= markerStart.y && y <= markerEnd.y) {
          return [...markers, id];
        }
      }

      return markers;
    }, []);
  }

  type LeafletMouseEvent = {
    containerPoint: {
      x: number;
      y: number;
    };
  };

  function handleDragStart({ containerPoint: { x, y } }: LeafletMouseEvent) {
    actions.setDragging(findMarker(x, y));
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

  function handleDragEnd({ containerPoint }: LeafletMouseEvent) {
    if (!state.dragging) return;

    const { lat, lng } = overlay._map.containerPointToLatLng(containerPoint);
    actions.saveMarkerPosition({ lat, lng });

    actions.setDragging(false);
    renderer.renderMarkers();
    renderer.renderDraggingMarker();
  }
  return { handleDragEnd, handleDragMove, handleDragStart };
}
