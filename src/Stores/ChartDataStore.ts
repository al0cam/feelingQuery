import type { ChartData } from "chart.js";
import { writable } from "svelte/store";

let data: ChartData

function createStore() {
    const { subscribe, set, update } = writable(data);

    return {
        subscribe,
        set,
        update,
    }
}

export const feelingStore = createStore();