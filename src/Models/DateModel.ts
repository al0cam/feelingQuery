import type { DocumentReference } from "firebase/firestore";

export type DateModel = {
    date: Date;
    dateRef: DocumentReference;
}