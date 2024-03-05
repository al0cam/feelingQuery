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

    function docExists(doc: DocumentReference): boolean {
        getDoc(doc)
        .then((doc) => {
            if (doc.exists()) {
                console.log("Document data:", doc.data());
                return true;
            } else {
                console.log("No such document!");
                return false;
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
        console.log("Nije postojao");
        return false;
    }

    function addTeam(teamName: string){
        if(isEmpty(teamName, "Team")){
            return;
        }
        teamRef = doc(db, "teams", teamName);

        if(docExists(teamRef)){
            console.log("Team already exists");
            
            notificationStore.addErrorNotification("Team already exists");
            return;
        }

        setDoc(doc(db, "teams", teamName), { teamName: teamName, }, { merge: true } )
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

    function fetchTeamByTeamName(teamName: string) {
        teamName = teamName.trim();
        if(isEmpty(teamName, "Team")){
            return;
        }
        teamRef = doc(db, "teams", teamName);
        if(docExists(teamRef)){
            notificationStore.addSuccessNotification("Team fetched successfully");
        } else {
            notificationStore.addErrorNotification("Team not found");
        }
    }   

    function fetchTeamDates(){
        if(isEmpty(teamRef, "Team")){
            return;
        }
        getDoc(teamRef).then((doc) => {
            if (doc.exists()) {
                console.log("Document data:", doc.data());
                notificationStore.addSuccessNotification("Team fetched successfully");
            } else {
                console.log("No such document!");
                notificationStore.addErrorNotification("Team not found");
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
            notificationStore.addErrorNotification("Error fetching team");
        });
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