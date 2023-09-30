import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    // Проверяем, есть ли значение "videoUrl" в объекте "values". Если оно существует, то это означает, что пользователь пытается загрузить новое видео
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      // Если запись muxData найдена, то код выполняется:
      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId); // Это означает, что предыдущий видео-файл будет удален с Mux
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        }); // В том числе удаляется из БД.
      }

      // После удаления создается новый видео-файл. Он использует "values.videoUrl" в качестве входных данных и настраивает параметры файла (актива), так как политика воспроизведения "public"
      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
