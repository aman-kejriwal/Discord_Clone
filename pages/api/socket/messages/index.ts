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
        const { serverId, channelId } = req.query;
        const fileURL=!!fileUrl?fileUrl:"Empty";
        if (!profile) {
            return res.status(401).json({ message: "Unauthorized User" });
        }

        if (typeof serverId !== 'string') {
            return res.status(400).json({ message: "ServerId is Missing" });
        }

        if (typeof channelId !== 'string') {
            return res.status(400).json({ message: "ChannelId is Missing" });
        }

        if (!content) {
            return res.status(400).json({ message: "Content is Missing" });
        }
        const server = await db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true,
            }
        });

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }
        const channel = await db.channel.findFirst({
            where: {
                id: channelId,
                serverId: serverId
            }
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }
        const member = server.members.find((member) => profile.id === member.profileId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        const message = await db.message.create({
            data: {
                content,
                fileUrl:fileURL,
                channelId: channel.id,
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
        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);
    } catch (err) {
        console.log("[Messages_POST]", err);
        return res.status(500).json({ message: "Internal Error" });
    }
}