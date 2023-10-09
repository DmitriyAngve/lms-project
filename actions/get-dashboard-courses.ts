import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

// Определяю пользовательские типы данных, который объединяет информацию о курсе, главах и категории курса. Этот тип представляет собой объект, содержащий массивы курсы: завершенные курсы и курсы в процессе завершения
type CourseWithProgressCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressCategory[];
  coursesInProgress: CourseWithProgressCategory[];
};

// Фун-ия выполняет запрос к БД, чтобы получить курсы, которые пользователь купил. Для этого ф-ия находит все записи о покупках, связанных с заданным userId. Запрашиваемые данные также включают информацию о соот-их курсах, их категориях и главах.
export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      // использую purchase модель из призмы и её связь, что бы получить соответствующий курс, категорию и главы
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    // Поученные курсы записываю в массив "courses" в виде объектов типа "CourseWithProgressCategory"
    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as CourseWithProgressCategory[];

    // Для каждого курса выполняется запрос на получение прогресса поль-ля с помощью "getProgress". Полученный прогресс добавляется к соответствующему курсу в виде св-ва "progress"
    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }
    // Создается для отдельных массива "completedCourses" и "coursesInProgress" путем фильтрации courses на основе значения "progress". Завершенные курсы имеют "progress" равный 100
    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    // Курсы в процессе имеют "progress" менее 100 или null (если ин-фа о прогрессе недоступна)
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );
    // возвращаю объект "DashboardCourses", содержащий оба массива курсов.
    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
