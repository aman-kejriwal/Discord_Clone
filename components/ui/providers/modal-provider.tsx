"use client"

//This Modal is to remove the hydration error
import { CreateServerModal } from "@/components/modals/create-server-modal"
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { useEffect, useState } from "react"

export const ModalProvider=()=>{
    const [isMounted,setIsMounted]=useState(false);
    useEffect(()=>{
        setIsMounted(true)
    },[])
    
    if(!isMounted)
        return null;
    return(
        <>
           <InviteModal/>   
           <EditServerModal/>
           <CreateServerModal/>
        </>
    )
}