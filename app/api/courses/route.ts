import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request,) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json(course);

    } catch (err) {
        console.log("[COURSES]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}