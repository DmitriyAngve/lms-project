"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void; // "=> void" - это значит, что функция ничего не возвращает
  endpoint: keyof typeof ourFileRouter; // свой-во с типом "keyof typeof" используется для получения всех ключей объекта "ourFileUpload" (это объект из api/uploadthing/core.ts). Пишу так, потому что хочу чтобы тип был ограничен этими ключами. Связано с указанием точки назначения (endpoint) для загрузки файла с использованием "ourFileUpload"
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      // endpoint - это URL-адрес, на который будет отправлен запрос для загрузки файлов. Этот URL-адрес указывает, куда будет направлен запрос на сервере для обработки загруженных файлов
      endpoint={endpoint}
      // Когда загрузка файла с клиента завершена успешно, эта функция вызывается. С помощью "res?.[0].url" она извлекает URL-адрес загруженного файла и передает его в onChange (который обновляет состояние компонента)
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      // для обработки ошибки
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  );
};
