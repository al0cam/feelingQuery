
import { writable } from "svelte/store";
import type { Team } from "../Models/Team";
import type { DateModel } from "../Models/DateModel";



function createStore() {
    const { subscribe, set, update } = writable<Team>();

    function setDates(dates: DateModel[]) {
        update(team => {
            return {...team, dates: dates};
        });
    }

    return {
        subscribe,
        set,
        update,
    }
}

export const teamStore = createStore();