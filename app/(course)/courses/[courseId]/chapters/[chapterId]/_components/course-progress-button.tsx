"use client";

import { Button } from "@/components/ui/button";

import { CheckCircle, XCircle } from "lucide-react";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button>
      {isCompleted ? "Not Completed" : "Mark as complete"}
      <Icon className="h-4 w-4" />
    </Button>
  );
};
