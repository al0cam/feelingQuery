import { DocumentReference, addDoc, collection } from "firebase/firestore";
import db from "./Firebase";
import { set } from "firebase/database";

function createRepository(){

    let teamRef: DocumentReference;
    let dateRef: DocumentReference;
    let feelingRef: DocumentReference;


    function addTeam(name: string){
        addDoc(collection(db, "teams"), {
            name: name,
        }).then((docRef) => {
            teamRef = docRef;
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
    
    // add a subcollection for the dates which will then contain feelings
    function addDate(date: Date){
        addDoc(collection(teamRef, "dates"), {
            date: date
        }).then((docRef) => {
            dateRef = docRef;    
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    function addFeeling(feeling: number){
        addDoc(collection(dateRef, "feelings"), {
            feeling: feeling
        }).then((docRef) => {
            feelingRef = docRef;
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    return {
        addTeam,
        addDate,
        addFeeling,
        setTeamRef: (ref: DocumentReference) => teamRef = ref,
        setDateRef: (ref: DocumentReference) => dateRef = ref,
    }
}


export const repository = createRepository();