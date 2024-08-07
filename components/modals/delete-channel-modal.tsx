"use client" 
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
    DialogFooter,
}
    from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
export const DeleteChannelModal = () => {
    const {onOpen,isOpen,onClose,type,data}=useModal();
    const isModalOpen=isOpen&&type==="deleteChannel";  
    //serverId
    const {channel,server}=data;
    const [isLoading,setIsLoading]=useState(false);
    const router=useRouter();
     const onClick= async ()=>{
        try{
            setIsLoading(true);
            const url=qs.stringifyUrl({
                url:`/api/channels/${channel?.id}`,
                query:{
                    serverId:server?.id,
                } 
            })
            const res=await axios.delete(url);
            onClose(); 
            router.push(`/servers/${server?.id}`); 
            router.refresh();
        }   
        catch(err){ 
            console.log(err);
        }
        finally{
            setIsLoading(false);
        }
     }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="font-bold text-2xl text-center">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="font-semibold text-black">
                        Are you sure about it ?? <br />
                         <span className="font-bold">
                         {channel?.name} 
                        </span>
                        <span>
                           {" "} will be permanently deleted
                        </span>
                    </DialogDescription>
                </DialogHeader>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <div className="flex items-center justify-between w-full">
                    <Button
                    disabled={isLoading}
                    onClick={()=>onClose()}
                    variant="ghost"
                    >   
                        Cancel
                    </Button>
                    <Button
                    disabled={isLoading}
                    variant="primary"
                    onClick={()=>onClick()}
                    className="bg-rose-600 hover:bg-rose-500"
                    >   
                        Confirm
                    </Button>
                </div>    
              </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}