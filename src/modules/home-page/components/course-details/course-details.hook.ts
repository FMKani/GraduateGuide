import * as React from "react";
// import { useInfiniteQuery } from "react-query";
import { useIES } from "@modules/home-page/contexts/ies.context";
// import { Producao } from "@prisma/client";

// const fetchProductionsByCourse = async (
//   courseId?: string,
//   cursor?: string
// ): Promise<{ data: Producao[]; count: number; cursor: string }> => {
//   if (!courseId) return { data: [], count: null, cursor: null };

//   const params = new URLSearchParams();
//   params.set("limit", "10");
//   params.set("cd_programa_ies", courseId);
//   params.set("page", cursor || "0");

//   const url = `/api/producoes?${params}`;
//   const courses = await fetch(url).then((r) => r.json());

//   return { data: courses.data, count: courses.count, cursor: courses.page };
// };

export function useCourseDetails() {
  const [{ course }, { courseDispatch }] = useIES();

  // const productions = useInfiniteQuery(
  //   ["productions", course?.selected?.cd_programa_ies],
  //   ({ pageParam }) =>
  //     fetchProductionsByCourse(course?.selected?.cd_programa_ies, pageParam),
  //   { getNextPageParam: (l) => l.cursor }
  // );

  const close = React.useCallback(
    () => courseDispatch({ selected: undefined }),
    [courseDispatch]
  );

  // const handleScroll = React.useCallback(
  //   ({ target }) => {
  //     const section = target as HTMLDivElement;

  //     if (
  //       !productions.hasNextPage ||
  //       section.offsetHeight + section.scrollTop < section.scrollHeight
  //     ) {
  //       return;
  //     }

  //     productions.fetchNextPage();
  //   },
  //   [productions.hasNextPage, productions.fetchNextPage] // eslint-disable-line react-hooks/exhaustive-deps
  // );

  return {
    course: course?.selected,
    // productions: productions.data?.pages.flatMap((p) => p.data) || [],
    // productionsLoading: productions.isLoading,
    close
    // handleScroll
  };
}
