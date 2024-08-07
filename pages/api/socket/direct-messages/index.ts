import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { conversationId} = req.query;

        const fileURL=!!fileUrl?fileUrl:"Empty";
        if (!profile) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        if(!conversationId){
            return res.status(400).json({message:"Conversation ID is required" })
        }
        if (!content) {
            return res.status(400).json({ message: "Content is Missing" });
        }
        const conversation= await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR:[
                    {
                        MemberOne:{
                            profileId:profile.id
                        }
                        ,
                    },
                    {
                        MemberTwo:{
                            profileId:profile.id
                        }
                    }
                ]
            },
            include:{
                MemberOne:{
                    include:{
                        profile:true
                    }
                },
                MemberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        const member = conversation.MemberOne.profileId===profile.id?conversation.MemberOne:conversation.MemberTwo;

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl:fileURL,
                conversationId:conversationId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true  
                    }
                }
            }
        });
        const channelKey = `chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);
    } catch (err) {
        console.log("[Direct_Messages_POST]", err);
        return res.status(500).json({ message: "Internal Error" });
    }
}