import type { DocumentReference } from "firebase/firestore";

export type Team = {
    teamName: string;
    teamRef: DocumentReference;
}