"use client"

import { cn } from "@/lib/utils"
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import UserAvatar from "../user-avatar"

interface ServerMemberProps {
    member: Member & { profile: Profile },
    server: Server
}

export const ServerMember = ({
    member,
    server
}: ServerMemberProps) => {
    const roleIcon = {
        [MemberRole.GUEST]: null,
        [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
        [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
    }
    const params = useParams();
    const router = useRouter();
    const icon = roleIcon[member.role];
    const onClick=()=>{
        router.push(`/servers/${params?.serverId}/conversation/${member.id}`)
    }
    return (
        <button 
        onClick={onClick}
        className={cn(
            "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.memberId===member.id&&"bg-zinc-700/20 dark:bg-zinc-700"
        )}>
            <UserAvatar 
            src={member.profile.imageUrl}
            className="h-8 w-8 md:h-8 md:w-8"/>
            <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition dark:text-zinc-400",
            params?.memberId===member.id&&"text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {member.profile.name}
            </p>
            {icon}    
        </button>
    )
}