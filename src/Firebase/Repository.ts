import { addDoc, collection } from "firebase/firestore";
import db from "./Firebase";

function createRepository(){

    let teamRef;
    let dayRef;
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
    

    function addDay(date: Date){
        dayRef = addDoc(collection(db, "days"), {
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
        addDay,
        addFeeling
    }
}


export const repository = createRepository();