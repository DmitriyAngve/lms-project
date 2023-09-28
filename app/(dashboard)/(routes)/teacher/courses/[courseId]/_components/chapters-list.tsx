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

  // не показывай ничего, если компонент не в стадии "Mounted". Предотвращает hydration issues
  if (!isMouted) {
    return null;
  }

  return (
    // "DragDropContext" - обёртка. "onDragEnd={() => {}}" - ф-ия, которая будет завершаться после перетаскивания элементов
    <DragDropContext onDragEnd={() => {}}>
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
