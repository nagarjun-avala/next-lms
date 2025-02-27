"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import MuxPlayer from '@mux/mux-player-react'

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
    videoUrl: z.string().min(1)
})

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing(current => !current)
    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter Video Updated");
            toggleEdit();
            router.refresh();

        } catch {
            toast.error("Something went wrong!")
        }

    }
    return (
        <div className="mt-6 bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (!initialData.videoUrl ? (
                        <>
                            <PlusCircle className="h-4 w-4  mr-2" />
                            Add an video
                        </>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4  mr-2" />
                            Edit video
                        </>
                    ))}
                </Button>
            </div>
            {!isEditing ? (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}

                        />
                    </div>
                )

            ) : (
                <div className="">
                    <FileUpload
                        endpoint={"chapterVideo"}
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div>
    );
}
