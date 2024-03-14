import type { DocumentReference } from "firebase/firestore";
import type { Feeling } from "./Feeling";

export type DateModel = {
    date: Date;
    dateRef: DocumentReference;
    feelings: Feeling[];
}