import Stripe from "stripe";

import { db } from "@/lib/db";

import { currentUser } from "@clerk/nextjs";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthrorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (!purchase) {
      return new NextResponse("Already purchased", { status: 404 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Код для создания сессии платежа в Stripe, чтобы определить что именно пользователь покупает и по какой цене
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!, // "!" для тайпскрипта (чтобы не ругался) - значит, что поле не обязательное
          },
          unit_amount: Math.round(course.price! * 100), // "!" - тут означает, что цена не будет иметь значений null/undefined (чтобы избежать проверок)
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    // создание новой сессии оформления заказа в Stripe.
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items, // это массив товаров
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`, // для перенаплавления
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`, // для перенаплавления
      metadata: {
        courseId: course.id,
        userId: user.id,
      }, // метаданные используются для отслеживания и связывания заказов с конкретными пользователями и курсами
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
