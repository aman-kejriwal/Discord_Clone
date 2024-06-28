import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 } from "uuid";
export async function PATCH(
    res:Request,
    {params}:{params:{serverId:string}}
){
    try{
        const profile=await currentProfile();
        if(!profile){
            return new NextResponse("Unathorized User",{status:401})
        }
        if(!params?.serverId){
            return new NextResponse("ServerId is Missing",{status:401});
        }
        const server=await db.server.update({
            where:{
                id:params.serverId,
                profileId:profile.id
            },
            data:{
                inviteCode:uuidv4()
            }
        });
      return NextResponse.json(server);
    }
    catch(error){
        console.log("[api/servers/..]",error);
        return new NextResponse("api/servers/.." ,{status:500});
    }
}