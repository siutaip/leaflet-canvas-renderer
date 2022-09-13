import type { MarkersState } from './types';

export const state: MarkersState = {
  list: {},

  viewport: {},

  event: {
    name: null,
    target: {
      type: null,
      id: null,
    },
  },

  dragging: null,
  hovering: null,

  dragStart: {
    x: 0,
    y: 0,
  },
};

export function setState(newState: { [key: string]: any }) {
  Object.keys(newState).forEach((key: keyof MarkersState) => {
    if (state.hasOwnProperty(key)) {
      state[key] = newState[key];
    }
  });
}
