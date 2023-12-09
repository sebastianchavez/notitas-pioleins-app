import { TypesNote } from "src/app/common/enums/types-note.enum";

export interface INote {
    idNote?: string;
    title: string;
    idUser: string;
    type: TypesNote;
    checks: {
        value: boolean;
        text: string;
        state?: boolean;
    }[];
    createdAt: number;
    updatedAt: number;
}
