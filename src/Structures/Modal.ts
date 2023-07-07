import type { ModalOptions } from "@/Interfaces/ModalOptions";
import type { ModalRunFunction } from "@/Types/ModalTypes";

export class Modal {
    public readonly customId: string;
    public run: ModalRunFunction;

    public constructor({ customId, run }: ModalOptions) {
        this.customId = customId;
        this.run = run;
    }
}