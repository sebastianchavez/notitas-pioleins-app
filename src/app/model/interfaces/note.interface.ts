import { TypesNote } from "src/app/common/enums/types-note.enum";

export interface INote {
    idNote?: string;
    title: string;
    description: string;
    idUser: string;
    lists: {
        title: string;
        checks: {
            value: boolean;
            text: string;
            state?: boolean;
        }[];
    }[];
    createdAt: number;
    updatedAt: number;
}
