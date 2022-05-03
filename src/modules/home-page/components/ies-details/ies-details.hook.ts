import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { useIES } from "@modules/home-page/contexts/ies.context";
import { Course } from "@common/types";

type FetchCoursesBynUniName = (p: {
  iesName?: string;
  iesId: string;
  iesCityName?: string;
  cursor?: string;
  filters?: any;
}) => Promise<{
  data: Course[];
  cursor?: string;
}>;

const fetchCoursesByUniNameAndCityName: FetchCoursesBynUniName = async ({
  iesId,
  iesName,
  iesCityName,
  cursor,
  filters
}) => {
  if (!iesName || !iesId) return { data: [] };

  const params = new URLSearchParams();
  params.set("uni_name", iesName);
  params.set("uni_city_name", iesCityName);
  params.set("min_rate", filters?.rateRange[0].toString());
  params.set("max_rate", filters?.rateRange[1].toString());
  params.set("order_by", filters?.order_by);
  params.set("has_bolsas", filters?.onlyBolsas);
  params.set("limit", "10");
  params.set("page", cursor || "0");
  params.set("distinct", "cd_programa_ies");
  params.set("ies_id", iesId);

  if (filters?.course_category && filters?.course_category !== "any")
    params.set("course_category", filters?.course_category);

  if (filters?.course_type && filters?.course_type !== "any")
    params.set("course_type", filters?.course_type);

  if (
    filters?.nm_area_concentracao &&
    filters?.nm_area_concentracao !== "any"
  ) {
    params.set("nm_area_concentracao", filters?.nm_area_concentracao);
  }

  const url = `/api/programas?${params}`;
  const courses = await fetch(url).then((r) => r.json());

  return { data: courses.data, cursor: courses.page };
};

export function useIesDetails() {
  const [{ IES, course, productions }, { setIES, courseDispatch }] = useIES();
  const [tab, setTab] = React.useState(1);

  const courses = useInfiniteQuery(
    [
      "courses",
      IES?.nome_ies,
      IES?.municipio,
      course?.filters,
      productions?.filters?.nm_area_concentracao
    ],
    ({ pageParam }) =>
      fetchCoursesByUniNameAndCityName({
        iesId: IES?.id,
        iesName: IES?.nome_ies,
        iesCityName: IES?.municipio,
        cursor: pageParam,
        filters: {
          ...course?.filters,
          ...productions?.filters
        }
      }),
    { getNextPageParam: (l) => l.cursor }
  );

  const close = React.useCallback(() => {
    setIES(null);
    courseDispatch({ selected: null });
  }, [setIES, courseDispatch]);

  const changeTab = React.useRef((n: number) => {
    return () => setTab(n);
  });

  const handleScroll = React.useCallback(
    ({ target }) => {
      const section = target as HTMLDivElement;

      if (
        !courses.hasNextPage ||
        section.offsetHeight + section.scrollTop < section.scrollHeight
      ) {
        return;
      }

      courses.fetchNextPage();
    },
    [courses.hasNextPage, courses.fetchNextPage] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    IES,
    tab,
    courses: courses.data?.pages.flatMap(({ data }) => data) || [],
    coursesLoading: courses.status === "loading",
    close,
    changeTab: changeTab.current,
    handleScroll
  };
}
