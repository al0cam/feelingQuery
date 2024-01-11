import { addDoc, collection } from "firebase/firestore";
import db from "./Firebase";

function createRepository(){

    let teamRef;
    let dateRef;
    let feelingRef;


    function addTeam(name: string){
        teamRef = addDoc(collection(db, "teams"), {
            name: name,
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
    
    // add a subcollection for the dates which will then contain feelings
    function addDate(date: Date){
        
        dateRef = addDoc(collection(db, "users"), {
            date: date
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    function addFeeling(feeling: number){
        feelingRef = addDoc(collection(db, "feelings"), {
            feeling: feeling
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    return {
        addTeam,
        addDate,
        addFeeling
    }
}


export const repository = createRepository();