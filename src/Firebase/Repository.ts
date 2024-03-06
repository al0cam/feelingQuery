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

        setDoc(teamRef, { teamName: teamName, }, { merge: true } )
        .then((docRef) => {
            notificationStore.addSuccessNotification("Team added successfully");
            addDate(new Date());
            return teamRef.id;
        }
        ).catch((error) => {
            notificationStore.addErrorNotification("Error adding team");
            console.error("Error adding document: ", error);
        });
        return;
    }
    
    // add a subcollection for the dates which will then contain feelings
    function addDate(date: Date){
        if(isEmpty(date, "Date") || isEmpty(teamRef, "Team")){
            return;
        }
        setDoc(doc(teamRef, "dates", date.toLocaleDateString("de-DE")), 
            { date: date }, 
            { merge: true })
        .then(() => {
            console.log("Document written successfully");
            dateRef = doc(collection(teamRef, "dates"));
        }).catch((error) => {
            console.error("Error writing document: ", error);
            notificationStore.addErrorNotification("Error adding date");
        });
    }

    function addFeeling(feeling: number){
        if(isEmpty(feeling, "Feeling") || isEmpty(dateRef, "Date") || isEmpty(teamRef, "Team")){
            return;
        }
        addDoc(collection(dateRef, "feelings"), {
            feeling: feeling
        }).then((docRef) => {
            feelingRef = docRef;
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            notificationStore.addErrorNotification("Error adding feeling");
            console.error("Error adding feeling: ", error);
        });
    }

    async function fetchTeamByTeamName(teamName: string) {
        teamName = teamName.trim();
        if(isEmpty(teamName, "Team")){
            return;
        }
        teamRef = doc(db, "teams", teamName);
        if(await docExists(teamRef)){
            notificationStore.addSuccessNotification("Team fetched successfully");
        } else {
            notificationStore.addErrorNotification("Team not found");
        }
    }

    async function fetchTeamDates(){
        if(isEmpty(teamRef, "Team")){
            return;
        }
        dateRef = doc(collection(teamRef, "dates"));
        if(await docExists(dateRef)){
            notificationStore.addSuccessNotification("Dates fetched successfully");
        } else {
            // TODO: maybe add a check for todays date to add it in case its not there
            //  but future dates couldnt be added
            notificationStore.addErrorNotification("No dates found");
        }
    }

    return {
        addTeam,
        addDate,
        addFeeling,
        fetchTeamByTeamName,
        fetchTeamDates,
    }
}


export const repository = createRepository();