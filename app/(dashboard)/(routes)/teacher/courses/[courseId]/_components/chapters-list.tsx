"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void; // функция, которая принимает один аргумент updateDate, который представляет собой массив объектов, в котором каждый объект имеет два свойства: id / position
  onEdit: (id: string) => void;
}

export const ChaptersList = ({
  items,
  onReorder,
  onEdit,
}: ChaptersListProps) => {
  const [isMouted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // проверяем, был ли перетащен элемент в новое местоположение, если нет - ф-ия завершается

    const items = Array.from(chapters); // создается копия массива, чтобы можно было вносить изменения в порядок
    const [reorderedItem] = items.splice(result.source.index, 1); // из массива "items" удаляется элемент, который был перемещен в "result.source.index"
    items.splice(result.destination.index, 0, reorderedItem); // Затем этот элемент из строчки сверху вставляется обратно в массив "items" в позицию "result.destination.index", что позволяет изменить порядок элементов

    // Ниже вычисляю начальный и конечный индексы измененных элементов. Эти индексы нужны для вычисления диапазона изменненных элементов
    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    // Обновленный массив "items" устанавливается с использованием "setChapters", что приводит к обновлению компонента с новым порядком элементов
    setChapters(items);

    // создается массив, который содержит объекты для обновления порядка элементов в БД. Каждый объект содержит "id" элемента и новую "position", которая опеределяется с помощью "items.findIndex"
    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    // Функция "onReorder" вызывается с массивом "bulkUpdateData", чтобы обновить порядок элементов в БД
    onReorder(bulkUpdateData);
  };

  // не показывай ничего, если компонент не в стадии "Mounted". Предотвращает hydration issues
  if (!isMouted) {
    return null;
  }

  return (
    // "DragDropContext" - обёртка. "onDragEnd={() => {}}" - ф-ия, которая будет завершаться после перетаскивания элементов
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Droppable - компонент, определяющий область, в которой можно перетаскивать элементы. "droppableId" - уникальный идентификатор области */}
      <Droppable droppableId="chapters">
        {/* далее ф-ия рендер. Отвечает за отображание самих элементов списка. Стили зависят от "chapter.isPublished" */}
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              // "Draggable" - компонент, представляющий элемент списка, который можно перетаскивать. "index" - позиция элемента в списке.
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      chapter.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef} // этот пропс для отслеживания перетаскиваемых элементов и управлять перемещением
                    {...provided.draggableProps} // Этот атрибут распаковывает все пропсы, предоставленные компонентом "<Draggable>", которые нужны для перемещения эл-та.
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        chapter.isPublished &&
                          "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && <Badge>Free</Badge>}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          chapter.isPublished && "bg-sky-700"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
