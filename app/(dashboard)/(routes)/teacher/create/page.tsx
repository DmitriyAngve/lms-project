"use client";

import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// схема, которая опеределяет, какие данные ожидаются в моей форме. В данном случае есть одно поле "title", которое должно быть строкой с длиной не менее 1 символа. Если условие не выполняется, то выведется ошибка
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  const router = useRouter();

  // здесь создается форма с использованием хука useForm, форма соответствует схеме данных из "forcmSchema"
  const form = useForm<z.infer<typeof formSchema>>({
    // указываю резольвер формы для интеграции Zod в мою форму. Это гарантия, что данные будут соот-ть схеме "formSchema"
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  // деструктурирую состояние формы для получения информации о том, отправляется ли формы (isSubmitting) и прошла ли валидация (isValid)
  const { isSubmitting, isValid } = form.formState;

  // ф-ия, которая будет вызываться при отправке формы. Она принимает значения, соот-ие схеме "formSchema"
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // если выбираем курс, то редирект на него с помощью router
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course created");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              // form.control - это объект предоставляемый хуком useForm. Содержит информацию о состоянии и методаъ управления полем формы, которые могут быть переданы компоненту <FormField>
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advenced web development'"
                      {...field}
                      /* {...field} === onChange: (...event: any[]) => void;
                      onBlur: Noop;
                      disabled?: boolean;
                      value: FieldPathValue<TFieldValues, TName>;
                      name: TName;
                       ref: RefCallBack;*/
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
