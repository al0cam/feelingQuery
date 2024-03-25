
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

    function addDate(date: DateModel) {
        update(team => {
            return {...team, dates: [...team.dates, date]};
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

    function getAverageFeelingForDate(date: DateModel): number {
        let feelings = date.feelings;
        let sum = 0;
        feelings.forEach(f => {
            sum += f.value;
        });
        return sum / feelings.length;
    }

    function getModeFeelingForDate(date: DateModel): number {
        let feelings = date.feelings;
        let countMap = new Map<number, number>();
        let maxCount = 0;
        let modeFeeling = 0;

        let count;
        feelings.forEach(f => {
            count = countMap.get(f.value) ?? 0;
            count++;
            countMap.set(f.value, count);

            if (count > maxCount) {
                maxCount = count;
                modeFeeling = f.value;
            }
        });

        return modeFeeling;
    }

    // TODO: add methods which interface with the repository to fetch values as required for the teamStore

    return {
        subscribe,
        set,
        update,
        setDates,
        addDate,
        setFeelingsForDate,
        addFeelingForDate,
        getAverageFeelingForDate,
        getModeFeelingForDate
    }
}

export const teamStore = createStore();