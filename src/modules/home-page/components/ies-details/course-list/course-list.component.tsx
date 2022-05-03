import * as React from "react";
import { useCourseList } from "./course-list.hook";
import { Course } from "@common/types";
import CourseListItem from "./course-list-item";

export interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = (props) => {
  const { courses } = useCourseList(props);

  return (
    <section className="divide-y divide-gray-200">
      {courses?.map((course, i) => (
        <CourseListItem key={i} course={course} />
      ))}
    </section>
  );
};

export default CourseList;
