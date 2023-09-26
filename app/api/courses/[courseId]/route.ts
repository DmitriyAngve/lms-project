import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { use } from "react";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } } // courseId - это название папки ([courseId])
) {
  try {
    const { userId } = auth();
    const { courseId } = params; // извлекаем courseId из параметров запроса
    const values = await req.json(); // получаем данные из тела HTTP-запроса и разбираем JSON-данные

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course); // возвращается HTTP-ответ с данными обновленного курса в формате JSOn
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
