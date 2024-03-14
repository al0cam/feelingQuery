
import { writable } from "svelte/store";
import type { Team } from "../Models/Team";
import type { DateModel } from "../Models/DateModel";
import type { Feeling } from "../Models/Feeling";



function createStore() {
    const { subscribe, set, update } = writable<Team>();

    function setDates(dates: DateModel[]) {
        update(team => {
            return {...team, dates: dates};
        });
    }

    function setFeelingsForDate(feelings: Feeling[], date: DateModel) {
        update(team => {
            let newDates = team.dates.map((d) => {
                if(d.date === date.date){
                    return {...d, feelings: feelings};
                }
                return d;
            });
            return {...team, dates: newDates};
        }
        );
    }

    function addFeelingForDate(feeling: Feeling, date: DateModel) {
        update(team => {
            let newDates = team.dates.map((d) => {
                if(d.date === date.date){
                    return {...d, feelings: [...d.feelings, feeling]};
                }
                return d;
            });
            return {...team, dates: newDates};
        }
        );
    }

    return {
        subscribe,
        set,
        update,
        setDates,
        setFeelingsForDate,
        addFeelingForDate
    }
}

export const teamStore = createStore();