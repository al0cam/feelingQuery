import { DocumentReference, addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import db from "./Firebase";
import { notificationStore } from "../Stores/NotificationStore";
import type { Team } from "../Models/Team";
import { teamStore } from "../Stores/TeamStore";

function createRepository(){

    let teamRef: DocumentReference;
    let dateRef: DocumentReference;
    let feelingRef: DocumentReference;


    function isEmpty(value: any, type: string){
        if(value === undefined || value === null || value === ""){
            notificationStore.addErrorNotification(type + " cannot be empty!");
            return true;
        }
    }

    async function docExists(doc: DocumentReference): Promise<boolean> {
        let docSnap = await getDoc(doc);
        return docSnap.exists();
    }

    async function addTeam(teamName: string){
        if(isEmpty(teamName, "Team")){
            return;
        }
        teamRef = doc(db, "teams", teamName);

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
        return;
    }
    
    // add a subcollection for the dates which will then contain feelings
    async function addDate(date: Date){
        if(isEmpty(date, "Date") || isEmpty(teamRef, "Team")){
            return;
        }
        try {
            await setDoc(doc(teamRef, "dates", date.toLocaleDateString("de-DE")), 
                { date: date }, 
                { merge: true });
            notificationStore.addSuccessNotification("Date added successfully");
            dateRef = doc(collection(teamRef, "dates"));
        } catch (error) {
            console.error("Error writing document: ", error);
            notificationStore.addErrorNotification("Error adding date");
        }
    }

    async function addFeeling(feeling: number){
        if(isEmpty(feeling, "Feeling") || isEmpty(dateRef, "Date") || isEmpty(teamRef, "Team")){
            return;
        }
        
        if(isEmpty(feeling, "Feeling") || isEmpty(dateRef, "Date") || isEmpty(teamRef, "Team")) {
            return;
        }

        try {
            feelingRef = await addDoc(collection(dateRef, "feelings"), {
                feeling: feeling
            });
            notificationStore.addSuccessNotification("Feeling added successfully");
        } catch (error) {
            notificationStore.addErrorNotification("Error adding feeling");
        }
    }

    async function setTeamByTeamName(teamName: string) {
        teamName = teamName.trim();
        if(isEmpty(teamName, "Team")){
            return;
        }
        teamRef = doc(db, "teams", teamName);
        if(await docExists(teamRef)){
            notificationStore.addSuccessNotification("Team set successfully");
            let date = new Date();
            if(await docExists(doc(teamRef, "dates", date.toLocaleDateString("de-DE")))){
                await setTeamDates();
                console.log("cancer");
                
            }
            else {
                await addDate(date);
            }
        } else {
            notificationStore.addErrorNotification("Team not found");
        }
    }

    async function setTeamDates(date: Date = new Date()){
        if(isEmpty(teamRef, "Team")){
            return;
        }
        dateRef = doc(teamRef, "dates", date.toLocaleDateString("de-DE"));
        if(await docExists(dateRef)){
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
        if(isEmpty(teamRef, "Team")){
            return;
        }
        let dates: Date[] = [];
        let teamName: string = "";
        teamStore.subscribe((team) => {
            teamName = team.teamName;
        });

        // TODO: find a way to get the dates and connect them to the team store.
        // maybe the team store isn't necessary at all though
        teamRef = doc(db, "teams", teamName);
        const datesRef = collection(teamRef, "dates");
        const datesSnapshot = await getDocs(datesRef);
        try {
            datesSnapshot.forEach((doc) => {
                dates.push(doc.data().date);
            });
            notificationStore.addSuccessNotification("Dates retrieved successfully");
            return dates;
        } catch (error) {
            notificationStore.addErrorNotification("Error getting dates");
        }
    }

    return {
        addTeam,
        addDate,
        addFeeling,
        setTeamByTeamName,
        setTeamDates,
        getTeams
    }
}


export const repository = createRepository();