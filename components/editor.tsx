"use client";

import dynamic from "next/dynamic"; // испоьзуется для динамической загрузки компонентов, которые могут быть разделены на отдельные файлы и подгружены по требованию во время выполнения
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css"; // react quill для создания интерактивных редактирований веб-приложений. Результат редактирования итерактивен.

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  // useMemo() используется для мемоизации (кэширования) вычислений. Позволяет оптимизировать производительность компонента, сохраняя результаты вычислений между рендерами
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  ); // импортирую реакт квилл без сервер сайд рендеринга (только на клиентской стороне) "use client" - не достаточно
};
