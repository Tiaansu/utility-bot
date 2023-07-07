import type { ModalRunFunction } from "@/Types/ModalTypes"; 

export interface ModalOptions {
    customId: string;
    run: ModalRunFunction;
};