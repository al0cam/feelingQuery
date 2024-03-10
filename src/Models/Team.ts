import type { DocumentReference } from "firebase/firestore";
import type { Date } from "./Date";

export type Team = {
    teamName: string;
    teamRef: DocumentReference;
    dates: Date[];
}