import { DocumentReference, addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import db from "./Firebase";
import { notificationStore } from "../Stores/NotificationStore";
import type { Team } from "../Models/Team";
import { teamStore } from "../Stores/TeamStore";
import type { DateModel } from "../Models/DateModel";
import type { Feeling } from "../Models/Feeling";
import { FeelingEnum } from "../Enums/FeelingEnum";

function createRepository(){

    let team: Team;
    teamStore.subscribe((teamData) => {
        team = teamData;
    });
    let todayDate: DateModel;

    function isTeamCached(teamName: string) {
        return !isEmpty(team, "Team") && team.teamName === teamName;
    }

    function getOnlyDate(date: Date) {
        return date.toISOString().split("T")[0];
    }

    function isEmptyWithNotification(value: any, type: string){
        if(isEmpty(value, type)){
            notificationStore.addErrorNotification(`${type} is empty`);
            return true;
        }
    }

    function isEmpty(value: any, type: string){
        return value === undefined || value === null || value === "" || value.length === 0;
    }

    async function docExists(doc: DocumentReference): Promise<boolean> {
        let docSnap = await getDoc(doc);
        return docSnap.exists();
    }

    async function addTeam(teamName: string){
        if(isEmptyWithNotification(teamName, "Team")){
            return;
        }
        if(isTeamCached(teamName)){
            notificationStore.addInfoNotification("Team was already fetched");
            return;
        }

        let teamRef = doc(db, "teams", teamName);

        if(await docExists(teamRef)){
            notificationStore.addErrorNotification("Team already exists");
            return;
        }

        try {
            await setDoc(teamRef, { teamName: teamName }, { merge: true });
            notificationStore.addSuccessNotification("Team added successfully");
            await addDate(new Date());

            teamStore.set({teamName: teamName, teamRef: teamRef} as Team);
            return teamRef.id;
        } catch (error) {
            notificationStore.addErrorNotification("Error adding team");
            console.error("Error adding document: ", error);
        }
    }

    async function addDate(date: Date){
        if(isEmptyWithNotification(date, "Date") || isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }

        let todayDateRef = doc(team.teamRef, "dates", getOnlyDate(date));
        if(await docExists(todayDateRef)){
            notificationStore.addErrorNotification("Date already exists");
            return;
        }
        console.log(todayDateRef);

        try {
            await setDoc(todayDateRef,
                { date: date },
                { merge: true });
            todayDate = {date: date, dateRef: todayDateRef} as DateModel;
            console.log("today: " + todayDate.date);

            notificationStore.addSuccessNotification("Date added successfully");
        } catch (error) {
            console.error("Error writing document: ", error);
            notificationStore.addErrorNotification("Error adding date");
        }
    }

    async function addFeelingForDate(feeling: Feeling, date: DateModel = todayDate){
        if(isEmptyWithNotification(feeling, "Feeling") || isEmptyWithNotification(todayDate.dateRef, "Date") || isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }

        if(isEmptyWithNotification(feeling, "Feeling") || isEmptyWithNotification(todayDate.dateRef, "Date") || isEmptyWithNotification(team.teamRef, "Team")) {
            return;
        }

        try {
            feeling.feelingRef = await addDoc(collection(date.dateRef, "feelings"), feeling);
            teamStore.addFeelingForDate(feeling, date);
            notificationStore.addSuccessNotification("Feeling added successfully");
        } catch (error) {
            console.error("Error writing document: ", error);
            notificationStore.addErrorNotification("Error adding feeling");
        }
    }

    async function setTeamByTeamName(teamName: string) {
        teamName = teamName.trim();
        if(isEmpty(teamName, "Team")){
            return;
        }

        if(isTeamCached(teamName)){
            notificationStore.addInfoNotification("Team was already fetched");
            return;
        }

        let teamRef = doc(db, "teams", teamName);
        if(await docExists(teamRef)){
            notificationStore.addSuccessNotification("Team set successfully");
            teamStore.set({teamName: teamName, teamRef: teamRef} as Team);
            let date = new Date();
            if(await docExists(doc(teamRef, "dates", date.toLocaleDateString("de-DE")))){
                await setTeamDates();

            }
            else {
                await addDate(date);
            }
        } else {
            notificationStore.addErrorNotification("Team not found");
        }
    }

    async function setTeamDates(date: Date = new Date()){
        // TODO: add two dates which will be used for displaying of a graph between the two dates
        if(isEmpty(team.teamRef, "Team")){
            return;
        }
        let todayDateRef = doc(team.teamRef, "dates", date.toLocaleDateString("de-DE"));
        if(await docExists(todayDateRef)){
            notificationStore.addSuccessNotification("Dates set successfully");
        } else {
            // TODO: maybe add a check for todays date to add it in case its not there
            //  but future dates couldnt be added
            notificationStore.addErrorNotification("No dates found");
        }
    }

    async function getTeams(){
        let teams: Team[] = [];
        const teamsRef = collection(db, "teams");
        const teamsSnapshot = await getDocs(teamsRef);
        try {
            teamsSnapshot.forEach((doc) => {
                teams.push({teamName: doc.id, teamRef: doc.ref} as Team);
            });
            notificationStore.addSuccessNotification("Teams retrieved successfully");
            return teams;
        } catch (error) {
            notificationStore.addErrorNotification("Error getting teams");
        }
    }

    async function getDatesForTeam(){
        if(isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }
        let dates: DateModel[] = [];
        let teamName: string = "";
        teamStore.subscribe((team) => {
            teamName = team.teamName;
        });

        let teamRef = doc(db, "teams", teamName);
        const datesRef = collection(teamRef, "dates");
        const datesSnapshot = await getDocs(datesRef);
        try {
            datesSnapshot.forEach((doc) => {
                dates.push({date: new Date(doc.id), dateRef: doc.ref} as DateModel);
            });
            teamStore.setDates(dates);
            notificationStore.addSuccessNotification("Dates retrieved successfully");
            return dates;
        } catch (error) {
            notificationStore.addErrorNotification("Error getting dates");
        }
    }

    // async function getFeelingsForDate(date: DateModel){
    //     if(isEmpty(date, "Date")){
    //         return;
    //     }

    //     let feelings: Feeling[] = [];
    //     const feelingsRef = collection(date.dateRef, "feelings");
    //     const feelingsSnapshot = await getDocs(feelingsRef);
    //     try {
    //         feelingsSnapshot.forEach((doc) => {
    //             feelings.push({name: doc.data(), value: doc.data().value, feelingRef: doc.ref} as Feeling);
    //         });
    //         notificationStore.addSuccessNotification("Feelings retrieved successfully");
    //         return feelings;
    //     } catch (error) {
    //         notificationStore.addErrorNotification("Error getting feelings");
    //     }
    // }

    return {
        addTeam,
        addDate,
        addFeelingForDate,
        setTeamByTeamName,
        setTeamDates,
        getTeams,
        getDatesForTeam
    }
}


export const repository = createRepository();