"use client" 
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
}
    from "@/components/ui/dialog";
    import { Label } from "../ui/label";
    import { Input } from "../ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { Copy ,RefreshCw,Check} from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";
export const InviteModal = () => {
    const {onOpen,isOpen,onClose,type,data}=useModal();
    const isModalOpen=isOpen&&type==="invite";  
    const origin=useOrigin();
    //serverId
    const {server}=data;
    const [copied,setCopied]=useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const inviteUrl= `${origin}/invite/${server?.inviteCode}`;
    const onCopy=()=>{  
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(()=>{
            setCopied(false);
        },1000);
    }
    const onNew=async ()=>{
        try{
            setIsLoading(true);
            const res=await axios.patch(`/api/servers/${server?.id}/invite-code`);
            //updating the data
            onOpen("invite",{server:res.data});
        }
        catch(error){
            console.log("[Invite-Modal]: ",error);      
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
                        Invite People
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Invite link
                    </Label>    
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        value={inviteUrl}>
                        </Input>
                        <Button onClick={onCopy} size="icon"
                         disabled={isLoading}
                        >
                            {copied 
                            ?<Check className="w-4 h-4"/>
                            :<Copy  className="w-4 h-4"/>}
                        </Button>
                    </div>
                    <Button
                    disabled={isLoading}
                    onClick={onNew}
                    variant="link"
                    size="sm"
                    className="mt-4 text-zinc-500 dark:text-secondary/70"
                    >
                        Generate new Link
                    <RefreshCw className="w-4 h-4 mx-1"/>
                    </Button>

                </div>
            </DialogContent>
        </Dialog>

    )
}