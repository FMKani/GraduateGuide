import { useEffect, useState } from "react";
import { CourseListProps } from "./course-list.component";
import { useIES } from "@modules/home-page/contexts/ies.context";
import slugify from "slugify";

export function useCourseList({ courses }: CourseListProps) {
  const [{ course, IES }] = useIES();
  const [sortedCourses, setSortedCourses] = useState(courses);

  useEffect(() => {
    if (!IES) return;

    if (course.filters.order_by !== "qt_bolsas_concedidas:desc") {
      setSortedCourses(courses);
      return;
    }

    const modified = courses.map((c) => ({
      ...c,
      _count: {
        ...c._count,
        bolsas:
          c.bolsas.find(
            ({ nm_ies_capes }) =>
              slugify(nm_ies_capes) === slugify(c.nm_entidade_ensino)
          )?.qt_bolsas_concedidas || 0
      }
    }));

    modified.sort((a, b) => b._count.bolsas - a._count.bolsas);

    setSortedCourses(modified);
  }, [course.filters, courses, IES]);

  return { courses: sortedCourses };
}
