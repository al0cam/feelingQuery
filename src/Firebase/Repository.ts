import { DocumentReference, addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import db from "./Firebase";
import { notificationStore } from "../Stores/NotificationStore";
import type { Team } from "../Models/Team";
import { teamStore } from "../Stores/TeamStore";
import type { DateModel } from "../Models/DateModel";
import type { Feeling } from "../Models/Feeling";

function createRepository(){

    let team: Team;
    teamStore.subscribe((teamData) => {
        team = teamData;
    });
    let todayDate: DateModel;

    function getDayDifference(date1: Date, date2: Date): number {
        const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
        const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
        return diffDays;
    }

    function isDateInStore(date: Date): boolean {
        team.dates.forEach((d) => {
            if(d.date === date){
                todayDate = d;
                return true;
            }
        });
        return false;
    }

    function isDateCached(date: Date): boolean {
        return !isEmpty(todayDate, "Date") && todayDate.date === date && isDateInStore(date);
    }

    function isTeamCached(teamName: string): boolean {
        return !isEmpty(team, "Team") && team.teamName === teamName;
    }

    function getFormatedDate(date: Date) {
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

    async function addTeam(teamName: string) {
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
        }
    }

    async function addDate(date: Date){
        if(isEmptyWithNotification(date, "Date") || isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }
        if(isDateCached(date)){
            notificationStore.addInfoNotification("Date was already fetched");
            return;
        }

        let todayDateRef = doc(team.teamRef, "dates", getFormatedDate(date));
        if(await docExists(todayDateRef)){
            notificationStore.addErrorNotification("Date already exists");
            return;
        }

        try {
            await setDoc(todayDateRef,
                { date: date },
                { merge: true });
            todayDate = {date: date, dateRef: todayDateRef} as DateModel;
            console.log("today: " + todayDate.date);

            notificationStore.addSuccessNotification("Date added successfully");
        } catch (error) {
            notificationStore.addErrorNotification("Error adding date");
        }
    }

    async function addFeelingForDate(feeling: Feeling, date: DateModel = todayDate){
        if(isEmptyWithNotification(feeling, "Feeling") || isEmptyWithNotification(todayDate.dateRef, "Date") || isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }

        try {
            feeling.feelingRef = await addDoc(collection(date.dateRef, "feelings"), feeling);
            teamStore.addFeelingForDate(feeling, date);
            notificationStore.addSuccessNotification("Feeling added successfully");
        } catch (error) {
            notificationStore.addErrorNotification("Error adding feeling");
        }
    }

    async function getTeamByName(teamName: string) {
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
                await getDateForTeam(date);
            }
            else {
                await addDate(date);
            }
        } else {
            notificationStore.addErrorNotification("Team not found");
        }
    }

    async function getAllTeams(){
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

    async function getAllDatesForTeam(){
        if(isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }

        let dates: DateModel[] = [];

        const datesRef = collection(team.teamRef, "dates");
        const datesSnapshot = await getDocs(datesRef);
        try {
            datesSnapshot.forEach((doc) => {
                dates.push({date: doc.data().date, dateRef: doc.ref} as DateModel);
            });
            notificationStore.addSuccessNotification("Dates retrieved successfully");
            return dates;
        } catch (error) {
            notificationStore.addErrorNotification("Error getting dates");
        }
    }

    async function getDateIntervalForTeam(datefrom: Date, dateTo: Date){
        if(isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }
        if(isEmpty(datefrom, "Date") || isEmpty(dateTo, "Date")){
            return getAllDatesForTeam();
        }
        if(datefrom > dateTo){
            notificationStore.addErrorNotification("First date is greater than the second date");
            return;
        }

        let dates: DateModel[] = [];

        const datesRef = collection(team.teamRef, "dates");
        const q = query(datesRef, where("date", ">=", datefrom), where("date", "<=", dateTo));
        const datesSnapshot = await getDocs(q);
        try {
            datesSnapshot.forEach((doc) => {
                if(!isDateInStore(doc.data().date))
                    teamStore.addDate({date: doc.data().date, dateRef: doc.ref} as DateModel);
            });
            notificationStore.addSuccessNotification("Dates retrieved successfully");
            return dates;
        } catch (error) {
            notificationStore.addErrorNotification("Error getting dates");
        }
    }

    async function getDateForTeam(date: Date){
        if(isEmpty(date, "Date") || isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }
        if(isDateCached(date)){
            notificationStore.addInfoNotification("Date was already fetched");
            return;
        }

        let dateRef = doc(db, "teams", team.teamName, "dates", getFormatedDate(date));
        const dateSnapshot = await getDoc(dateRef);
        try {
            notificationStore.addSuccessNotification("Date retrieved successfully");
            teamStore.addDate({date: date, dateRef: dateRef} as DateModel);
            return dateSnapshot;
        } catch (error) {
            notificationStore.addErrorNotification("Error getting date");
        }
    }

    async function getFeelingsForDate(date: Date){
        if(isEmpty(date, "Date")){
            return;
        }
        if(isEmptyWithNotification(team.teamRef, "Team")){
            return;
        }

        let dateRef = doc(db, "teams", team.teamName, "dates", getFormatedDate(date));

        let feelings: Feeling[] = [];
        const feelingsRef = collection(dateRef, "feelings");
        const feelingsSnapshot = await getDocs(feelingsRef);
        try {
            feelingsSnapshot.forEach((doc) => {
                feelings.push({name: doc.data().name, value: doc.data().value, feelingRef: doc.ref} as Feeling);
            });
            notificationStore.addSuccessNotification("Feelings retrieved successfully");
            return feelings;
        } catch (error) {
            notificationStore.addErrorNotification("Error getting feelings");
        }
    }

    return {
        addTeam,
        addDate,
        addFeelingForDate,
        getTeamByName,
        getAllTeams,
        getDateIntervalForTeam,
        getFeelingsForDate,
        getDateForTeam,
        getAllDatesForTeam,
    }
}


export const repository = createRepository();