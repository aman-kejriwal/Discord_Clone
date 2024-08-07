import { Hash, Menu } from "lucide-react"
import { MobileToggle } from "../mobile-toggle"
import UserAvatar from "../user-avatar"
import { SocketIndicator } from "../socket-indicator"
import { ChatVideoButton } from "./chat-video-button"
import { channel } from "diagnostics_channel"

interface ChatHeaderProps{
    serverId:string,
    name:string ,
    type:"channel" | "conversation",
    imageUrl?:string
}
export const ChatHeader=async (
    {serverId,
        name,
        type,
        imageUrl    
    }:ChatHeaderProps
)=>{
   return (
    <div className="bg-white dark:bg-zinc-800 flex h-12 text-md font-semibold px-3 items-center dark:border-zinc-900 border-b-2">
        <MobileToggle serverId={serverId}/>
        {type==="channel"&&(
            <Hash className="w-5 h-5 text-zinc-500 dark:text-white mr-2"/>
        )}
        {type==="conversation"&&(
         <UserAvatar 
         src={imageUrl+""}
         className="h-6 w-6 md:h-8 mr-2 rounded-full"
         />   
        )
        }
        <p className="dark:text-white font-semibold text-md">
            {name}
        </p>
        <div className="ml-auto flex items-center">
            {type==="conversation"&&(
                <ChatVideoButton/> 
            )}
        <SocketIndicator/>
        </div>
    </div>
   )
}