import { DocumentReference, addDoc, collection, doc, getDoc } from "firebase/firestore";
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

    function addTeam(name: string){
        if(isEmpty(name, "Team")){
            return;
        }
        addDoc(collection(db, "teams"), {
            name: name,
        }).then((docRef) => {
            teamRef = docRef;
            console.log("Document written with ID: ", docRef.id);
            notificationStore.addSuccessNotification("Team added successfully");
        }
        ).catch((error) => {
            notificationStore.addErrorNotification("Error adding team");
            console.error("Error adding document: ", error);
        });
    }
    
    // add a subcollection for the dates which will then contain feelings
    function addDate(date: Date){
        if(isEmpty(date, "Date")){
            return;
        }
        addDoc(collection(teamRef, "dates"), {
            date: date
        }).then((docRef) => {
            dateRef = docRef;    
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            notificationStore.addErrorNotification("Error adding date");
            console.error("Error adding document: ", error);
        });
    }

    function addFeeling(feeling: number){
        if(isEmpty(feeling, "Feeling")){
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

    function fetchTeamByName(name: string){
        if(isEmpty(name, "Team")){
            return;
        }
        teamRef = doc(db, "teams", name);
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
        fetchTeamByName,
        fetchTeamDates,
    }
}


export const repository = createRepository();