import { Server } from '@prisma/client';
import { types } from 'util';
import {create} from 'zustand'

export type ModalType="createServer"|"invite";

interface ModalData{
    server?:Server
}
interface ModalStore{
    type:ModalType|null;
    data:ModalData;
    isOpen:boolean;
    onOpen:(types:ModalType,data:ModalData)=> void;
    onClose:()=>void;
}
export const useModal=create<ModalStore>((set)=>({
    type:null,
    data:{},
    isOpen:false,
    onOpen:(type,data:{})=> set({isOpen:true,type,data}),
    onClose:()=> set({type:null,isOpen:false})
}))