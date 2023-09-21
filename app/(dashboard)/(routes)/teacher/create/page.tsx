"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
}); // схема, которая опеределяет, какие данные ожидаются в моей форме. В данном случае есть одно поле "title", которое должно быть строкой с длиной не менее 1 символа. Если условие не выполняется, то выведется ошибка

const CreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    // здесь создается форма с использованием хука useForm, форма соответствует схеме данных из "forcmSchema"
    resolver: zodResolver(formSchema), // указываю резольвер формы для интеграции Zod в мою форму. Это гарантия, что данные будут соот-ть схеме "formSchema"
    defaultValues: {
      title: "",
    },
  }); //

  const { isSubmitting, isValid } = form.formState; // деструктурирую состояние формы для получения информации о том, отправляется ли формы (isSubmitting) и прошла ли валидация (isValid)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  }; // ф-ия, которая будет вызываться при отправке формы. Она принимает значения, соот-ие схеме "formSchema"

  return <div className="max-w-5xl mx-auto">Create Page!</div>;
};

export default CreatePage;
