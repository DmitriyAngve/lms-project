import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    // найду все опубликованные главы (publishedChapters) для указанного курса (courseId). Результатом запроса в БД буде тмасисва глав, где каждый объект будет содержать только "id" опубликованной главы
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });
    // Затем создаю массив (publishedChapterIds), который получается путем извлечения "id" из каждой опубликованной главы
    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPrecentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPrecentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
