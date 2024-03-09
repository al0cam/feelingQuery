import { DocumentReference, addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import db from "./Firebase";
import { notificationStore } from "../Stores/NotificationStore";

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

    // async function getTeams(){
    //     let teams = [];
    //     const querySnapshot = await getDoc(collection(db, "teams"));
    //     querySnapshot.forEach((doc) => {
    //         teams.push(doc.data());
    //     });
    //     return teams;
    // }

    return {
        addTeam,
        addDate,
        addFeeling,
        setTeamByTeamName,
        setTeamDates,
    }
}


export const repository = createRepository();