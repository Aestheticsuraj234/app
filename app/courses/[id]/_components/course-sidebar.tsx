import { currentUser } from "@/lib/auth/data/auth";
import { db } from "@/lib/db/db";
import { workshop, WorkshopDay, WorkshopDayProgress } from "@prisma/client";
import { redirect } from "next/navigation";

import React from "react";
import CourseSidebarItem from "./course-sidebar-item";
import { Progress } from "@/components/ui/progress";

interface CourseSidebarProps {
  course: workshop & {
    days: (WorkshopDay & {
      userProgress: WorkshopDayProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const subscription = await db.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      subscribedTo: {
        select: {
          endDate: true,
          status: true,
          plan: true,
        },
      },
    },
  });

  const isPremiumActiveUser =
    (subscription?.subscribedTo?.status === "ACTIVE" &&
      subscription?.subscribedTo?.plan === "PREMIUM" &&
      user?.role === "PREMIUM_USER") ||
    user?.role === "ADMIN";

     const totalDays = course.days.length;


  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">
            {course.title}
        </h1>
        <div className="mt-5">
                <Progress
                  value={(progressCount / totalDays) * 100}
                  className="h-2 mb-2"
                  
                />
                <span className="text-xs text-emerald-500 font-semibold">
                 {(progressCount / totalDays) * 100}% Completed
                </span>
              </div>
        </div>

<div className="flex flex-col w-full">
       {
        course.days.map((day)=>{
            // Check if the day is completed for the current user
          const isCompleted = day.userProgress?.some(
            (progress) => progress.markedAsDone
          );
            return (
            <CourseSidebarItem
            key={day.id}
            id={day.id}
            title={day.title}
            isCompleted={isCompleted!}
            courseId={course.id}
            
            />)
})
       } 
</div>

    </div>
  )
};

export default CourseSidebar;
