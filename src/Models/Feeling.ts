import type { DocumentReference } from "firebase/firestore";

export type Feeling = {
    name: string;
    value: number;
    feelingRef: DocumentReference;
};