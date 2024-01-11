import { addDoc, collection } from "firebase/firestore";
import db from "./Firebase";

type team = {
    name: string;
    id: string;
}

type day = {
    date: Date;
}

type feeling = {
    feeling: number,
}

function createRepository(){

    let teamRef;
    let dayRef;
    let feelingRef;


    function addTeam(team: team){
        teamRef = addDoc(collection(db, "teams"), {
            name: team.name,
            id: team.id
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
    

    function addDay(day: day){
        dayRef = addDoc(collection(db, "days"), {
            date: day.date
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    function addFeeling(feeling: feeling){
        feelingRef = addDoc(collection(db, "feelings"), {
            feeling: feeling.feeling
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }
        ).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }



}


export const repository = createRepository();