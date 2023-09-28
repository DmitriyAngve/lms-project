"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";

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

  // не показывай ничего, если компонент не в стадии "Mounted"
  if (!isMouted) {
    return null;
  }

  return <div>Chapter List</div>;
};
