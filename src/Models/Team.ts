import type { DocumentReference } from "firebase/firestore";
import type { DateModel } from "./DateModel";

export type Team = {
    teamName: string;
    teamRef: DocumentReference;
    dates: DateModel[];
}