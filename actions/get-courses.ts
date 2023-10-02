import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  // Запрос к БД, чтобы найти курсы, соответствующие всем заданным критериям: должны быть isPublished, иметь title и включать в себя информацию в категории курса, главах и покупках. сортировка по времени создания в убывающемпорядке
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        // промис олл - чтобы дождаться выполнения всех асинхронных ф-ий
        courses.map(async (course) => {
          // проверяю для каждого курса в массиве "courses", есть ли у пользовател "userId", покупка курса ("courses.purchases"). Если покупок нет (количество покупок course.purchases.length === 0), то этот курс добавляется в итоговый массив "coursesWithProgress", без информации о прогрессе.
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          // Если у пользователя есть покупка для данного курса (course.purchases.length больше 0), то вызывается ф-ия "getProgress(userId, course.id)", чтобы вычислить прогресс пользователя для этого курса.
          const progressPercentage = await getProgress(userId, course.id);

          // Затем создается новый объект, который содержит всю информацию о курсе (...course) и добавляю информацию о прогрессе пользователя ("progress: progressPercentage")
          return {
            ...course,
            progress: progressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
