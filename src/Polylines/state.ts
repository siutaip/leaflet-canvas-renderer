import type { State } from './types';

export function createState() {
  const state: State = {
    list: [],

    paths: [],

    hovering: null,
  };

  function setState(newState: { [key: string]: any }) {
    Object.keys(newState).forEach((key: keyof State) => {
      if (state.hasOwnProperty(key)) {
        state[key] = newState[key];
      }
    });
  }

  return { state, setState };
}
