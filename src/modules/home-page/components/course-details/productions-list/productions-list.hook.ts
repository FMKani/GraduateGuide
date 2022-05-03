import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { Producao } from "@prisma/client";
import { useIES } from "@modules/home-page/contexts/ies.context";

const fetchProductionsByCourse = (
  course_id: string,
  page?: string,
  nm_area_concentracao?: string
): Promise<{ data: Producao[]; count?: number; page?: number }> => {
  if (!course_id) return Promise.resolve({ data: [] });

  const params = new URLSearchParams();

  params.set("limit", "50");
  params.set("page", page || "0");
  params.set("course_id", course_id);
  params.set("order_by", "nm_producao");

  if (nm_area_concentracao && nm_area_concentracao !== "any") {
    params.set("nm_area_concentracao", nm_area_concentracao);
  }

  return (
    fetch(`/api/producoes?${params}`)
      .then((r) => r.json())
      // .then((ps) => ps)
      .catch((err) => {
        console.error(err);
        return { data: [] };
      })
  );
};

export function useProductionsList() {
  const [{ course, productions: productionsState }] = useIES();
  const [page, setPage] = React.useState<number>(0);

  const productions = useInfiniteQuery(
    [
      "productions",
      course.selected?.cd_programa_ies,
      productionsState.filters?.nm_area_concentracao
    ],
    ({ pageParam }) => {
      setPage(pageParam ?? 0);
      return fetchProductionsByCourse(
        course.selected?.id,
        pageParam,
        productionsState.filters?.nm_area_concentracao
      );
    },
    {
      staleTime: 300000,
      cacheTime: 600000,
      getNextPageParam: (p) => p.page
    }
  );

  const handleScroll = React.useCallback(
    ({ target }) => {
      const section = target as HTMLDivElement;

      if (
        !productions.hasNextPage ||
        section.offsetHeight + section.scrollTop < section.scrollHeight
      ) {
        return;
      }

      productions.fetchNextPage();
    },
    [productions.hasNextPage, productions.fetchNextPage] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    totalCount: productions.data?.pages[0].count,
    page,
    productions: productions.data?.pages.flatMap((p) => p.data) || [],
    handleScroll
  };
}
