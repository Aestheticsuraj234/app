import { currentUser } from "@/lib/auth/data/auth";
import { db } from "@/lib/db/db";
import { redirect } from "next/navigation";
import React from "react";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const workshop = await db.workshop.findUnique({
    where: {
      id: params.id,
      status: "PUBLISHED",
    },
    select: {
        id: true,
        title: true,
      days: {
        select: {
          id: true,
          dayNumber: true,
          videoLink: true,
          notes: true,
          sourceCodeLink: true,
          title: true,
          userProgress: {
            where: {
              userId: user.id,
            },
            select: {
              markedAsDone: true,
            },
          },
        },
        orderBy: {
          dayNumber: "asc",
        },
      },
    },
  });

  if (!workshop) {
    return redirect("/dashboard");
  }

  const progressCount = await db.workshopDayProgress.count({
    where: {
      userId: user.id,
      day: {
        workshopId: params.id,
      },
      markedAsDone: true,
    },
  });



  return(
    <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
            <CourseNavbar
            course={workshop}
            progressCount={progressCount}
            />
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
            <CourseSidebar
            course={workshop}
            progressCount={progressCount}
            />
        </div>
        <main className="md:pl-80 pt-[80px]  h-full">
{children}
        </main>
    </div>
  )
};

export default CourseLayout;