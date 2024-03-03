import { writable } from "svelte/store";



function createStore() {
    const { subscribe, set, update } = writable('happy');

    return {
        subscribe,
        set,
        update,
    }
}

export const feelingStore = createStore();