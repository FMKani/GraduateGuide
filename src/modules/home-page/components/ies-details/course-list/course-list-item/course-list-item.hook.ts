import * as React from "react";
import { CourseListItemProps } from "./course-list-item.component";
import { useIES } from "@modules/home-page/contexts/ies.context";

export function useCourseListItem(props: CourseListItemProps) {
  const [{ comparing, IES }, { courseDispatch, setComparing }] = useIES();

  const handleClick = React.useCallback(
    (evt) => {
      if (evt.target instanceof HTMLInputElement) return;
      courseDispatch({ selected: props.course });
    },
    [courseDispatch, props.course]
  );

  const handleChange = React.useCallback(
    (evt) => {
      const target = evt.target as HTMLInputElement;

      if (target.checked) {
        if (comparing.length >= 2) return;
        setComparing(comparing.concat([{ ies: IES, course: props.course }]));
      } else {
        setComparing(
          comparing.filter(({ course: { id } }) => id !== props.course.id)
        );
      }
    },
    [comparing, IES, setComparing, props.course]
  );

  return { handleClick, handleChange, comparing };
}
