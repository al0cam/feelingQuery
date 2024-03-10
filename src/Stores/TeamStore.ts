
import { writable } from "svelte/store";
import type { Team } from "../Models/Team";



function createStore() {
    const { subscribe, set, update } = writable<Team>();

    return {
        subscribe,
        set,
        update,
    }
}

export const teamStore = createStore();