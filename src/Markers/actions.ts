import { MarkersState } from 'src/types';

export default function ({
  overlay,
  state,
  setState,
}: {
  overlay: any;
  state: MarkersState;
  setState: any;
}) {
  /**
   * @param {string | null | false } dragging  Marker.id or false to stop dragging
   */
  function setDragging(dragging: boolean | string | null = null) {
    console.log('setDragging', typeof dragging, dragging);
    if (!dragging) {
      overlay._map.dragging.enable();
    } else {
      overlay._map.dragging.disable();
    }

    setState({
      dragging,
    });
  }

  function saveMarkerPosition({ lat, lng }: { lat: number; lng: number }) {
    if (!state.dragging) return;

    setState({
      ...state,
      list: {
        ...state.list,
        [state.dragging]: {
          ...state.list[state.dragging],
          lat,
          lng,
        },
      },
      viewport: {
        ...state.viewport,
        [state.dragging]: {
          ...state.viewport[state.dragging],
          lat,
          lng,
        },
      },
    });
  }

  return { saveMarkerPosition, setDragging };
}
