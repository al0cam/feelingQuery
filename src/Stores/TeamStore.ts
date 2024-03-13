
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

    function setFeelingsForDate(feelings: string[], date: DateModel) {
        update(team => {
            let newDates = team.dates.map(d => {
                if(d.date === date.date) {
                    return {...d, feelings: feelings};
                }
                return d;
            });
            return {...team, dates: newDates};
        });
    }

    return {
        subscribe,
        set,
        update,
        setDates
    }
}

export const teamStore = createStore();