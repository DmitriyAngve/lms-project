// Код для группировки покупок по названию соответствующих курсов и суммирвоания цен покупок для каждого уникального курса.
import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

// Ф-ия принимает массив объектов "PurchaseWithCourse" в качестве параметра, и возвращает объект, где ключами явл-ся названия курсов, а значениями - суммы цен покупок для каждого уникального курса
const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  // "grouped" - эт объект, который будет  использоваться для группировки покупок покурсам. В этом объекте ключами будут названия курсов, а значениями будут суммы цен.
  const grouped: {
    [courseTitle: string]: number;
  } = {};

  //   Итерация по массиву "purchase". Извлекаем название соответствующего курса с помощью "purchase.course.title"
  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    // Проверка наличия ключа в объекте "grouped". Если ключ с имененм курса (courseTitle) отсутствует в объекте "grouped", то ключ создается, устанавливая начальное значение на 0
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    // Суммирование цен покупок
    grouped[courseTitle] += purchase.course.price!;
  });
  //  Возвращаю результат в виде объекта, в котором ключами являются названия курсов, а значениями - суммы цен покупок каждого уникального курса
  return grouped;
};

// Аналитика продаж курсов пользователя, подсчитывая общую выручку и количество продаж дял каждого курса.
// "getAnalytics" - ф-ия, принимающая пользователя "userId" и возвращающая аналитические данные о его продажах.
export const getAnalytics = async (userId: string) => {
  try {
    // Обращаюсь к БД, для извлечения данных с помощью "db.purchase.findMany", которые связаны с "userId", все эти данные извлекаются и сохраняются в переменную "purchase"
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: userId,
        },
      },
      include: {
        course: true,
      },
    });

    // Создаю объект "groupedEarnings", представляющий собой функцию "groupByCourse", которая используется для группировки по курсам и подсчета выручки с каждого курса
    const groupedEarnings = groupByCourse(purchases);

    // Преобразую данные для аналитики. "Object.entries(groupedEarnings)" - преобразует объект "groupedEarnings" в массив пар ключ-значение. Создается новый массив объектов, где каждый объект содержит название (name) и общую сумму выручки (total)
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({ name: courseTitle, total: total })
    );
    // Подсчет выручки
    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);

    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return { data: [], totalRevenue: 0, totalSales: 0 };
  }
};
