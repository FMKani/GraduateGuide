import * as React from "react";
import {
  courseSearchKeys,
  iesSearchKeys,
  ptBRcapitalize
} from "@common/utils/etc";
import { Ies, Producao, Programa } from "@prisma/client";
import { AsyncLoadOptions } from "./form-dropdown-input/form-dropdown-input.component";
import { FormikHelpers } from "formik";
import { useIES } from "@modules/home-page/contexts/ies.context";
import brazilLocations from "@common/brazil-locations.json";

export interface Option {
  label: string;
  value: string | number;
}

export interface SearchIESFormValues {
  region?: Option;
  state?: Option;
  city?: Option;
  ies_name?: Option;
  ies_type?: Option;
  ies_organization?: Option;
  ies_administration?: Option;
  course_category?: Option;
  course_type?: Option;
  course?: [number, number];
  search_by_course?: boolean;
  nm_area_concentracao?: Option;
  order_by?: Option;
  onlyBolsas?: boolean;
}

const initialValues: SearchIESFormValues = {
  nm_area_concentracao: { label: "Qualquer área", value: "any" },
  region: { label: "Qualquer região", value: "any" },
  state: { label: "Qualquer estado", value: "any" },
  city: { label: "Qualquer cidade", value: "any" },
  ies_name: { label: "Qualquer nome", value: "any" },
  ies_type: { label: "Qualquer rede", value: "any" },
  ies_organization: { label: "Qualquer organização", value: "any" },
  ies_administration: { label: "Qualquer administração", value: "any" },
  course_category: { label: "Qualquer área", value: "any" },
  course_type: { label: "Qualquer modalidade", value: "any" },
  course: [0, 7],
  search_by_course: false,
  order_by: { label: "Nome", value: "nm_programa_ies" },
  onlyBolsas: false
};

const allStates = Object.values(brazilLocations.statesByRegion).flat();
const allCities = Object.values(brazilLocations.citiesByState).flat();

const iesTypeOptions = [
  { label: "Qualquer rede", value: "any" },
  { label: "Pública", value: "Pública" },
  { label: "Privada", value: "Privada" }
];

const iesAdministrationOptions = [
  { label: "Qualquer administração", value: "any" },
  { label: "Federal", value: "Federal" },
  { label: "Estadual", value: "Estadual" },
  { label: "Municipal", value: "Municipal" },
  { label: "Privada", value: "Privada" }
];

const courseOrderByOptions = [
  { label: "Nome", value: "nm_programa_ies:asc" },
  { label: "Quantidade de bolsas", value: "qt_bolsas_concedidas:desc" },
  { label: "Avaliação", value: "cd_conceito_programa:desc" }
];

export function useSearchIesForm() {
  const [_, { setIESs, courseDispatch, productionsDispatch }] = useIES(); // eslint-disable-line @typescript-eslint/no-unused-vars

  const searcheablePaginate = React.useCallback(
    (collection: Option[], search: string, page = 0) => {
      const limit = 50;
      const pageOptions = collection
        .filter(({ label }) =>
          search ? label.toLowerCase().startsWith(search.toLowerCase()) : true
        )
        .slice(page * limit, page * limit + limit);

      return {
        options: pageOptions,
        hasMore: pageOptions.length === 50,
        additional: { cursor: (page + 1).toString() }
      };
    },
    []
  );

  const getStateOptionsBasedOnRegion = React.useCallback(
    (region: Option, search: string, page = 0) => {
      return searcheablePaginate(
        region.value === "any"
          ? allStates
          : brazilLocations.statesByRegion[
              region.value.toString().toLowerCase()
            ],
        search,
        page
      );
    },
    [searcheablePaginate]
  );

  const getCityOptionsBasedOnState = React.useCallback(
    (state: Option, search: string, page = 0) => {
      return searcheablePaginate(
        state.value === "any"
          ? allCities
          : brazilLocations.citiesByState[state.value],
        search,
        page
      );
    },
    [searcheablePaginate]
  );

  const getUniNamesOptions = React.useCallback<AsyncLoadOptions>(
    async (search, options, nav) => {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("distinct", "nome_ies");
      params.set("order_by", "nome_ies");
      params.set("page", nav?.cursor || "0");

      if (search) params.set("ies_name", search);

      return fetch(`/api/instituicoes?${params}`)
        .then((r) => r.json())
        .then((r) => {
          let newoptions = (r.data as Ies[]).map(({ nome_ies }) => ({
            label: ptBRcapitalize(nome_ies),
            value: nome_ies
          }));

          if (!options.find(({ value }) => value === "any") && !search) {
            newoptions = [{ label: "Qualquer nome", value: "any" }].concat(
              newoptions
            );
          }

          return {
            options: newoptions,
            hasMore: newoptions.length >= 50,
            additional: { cursor: r.page }
          };
        })
        .catch((err) => {
          console.error(err);
          return { options: [] };
        });
    },
    []
  );

  const getIESAdministrationOptions = React.useCallback((iesType: string) => {
    if (iesType === "any") return iesAdministrationOptions;
    // prettier-ignore
    if (iesType === "Privada") return [iesAdministrationOptions[0]].concat(iesAdministrationOptions.slice(-1));
    if (iesType === "Pública") return iesAdministrationOptions.slice(0, 4);
    return [];
  }, []);

  const getCourseCategoriesOptions = React.useCallback(
    (search: string, options: Option[], nav) => {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("distinct", "nm_area_basica");
      params.set("order_by", "nm_area_basica");
      params.set("page", nav?.cursor || "0");

      if (search) params.set("course_category", search);

      return fetch(`/api/programas?${params}`)
        .then((r) => r.json())
        .then((r) => {
          let newoptions = (r.data as Programa[]).map(({ nm_area_basica }) => ({
            label: ptBRcapitalize(nm_area_basica),
            value: nm_area_basica
          }));

          if (!options.find(({ value }) => value === "any") && !search) {
            newoptions = [{ label: "Qualquer área", value: "any" }].concat(
              newoptions
            );
          }

          return {
            options: newoptions,
            hasMore: newoptions.length >= 50,
            additional: { cursor: r.page }
          };
        })
        .catch((err) => {
          console.error(err);
          return { options: [] };
        });
    },
    []
  );

  const resetCoursesFilters = React.useCallback(() => {
    courseDispatch({
      filters: {
        rateRange: [0, 7],
        onlyBolsas: false,
        order_by: "nm_programa_ies:asc",
        course_category: undefined,
        course_type: undefined
      }
    });

    productionsDispatch({
      filters: {
        nm_area_concentracao: undefined
      }
    });
  }, [courseDispatch, productionsDispatch]);

  const searchProductionsCategories = React.useCallback<AsyncLoadOptions>(
    (search, options, nav) => {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("page", nav?.cursor || "0");
      params.set("distinct", "nm_area_concentracao");
      params.set("select", "nm_area_concentracao");

      if (search) params.set("nm_area_concentracao", search);

      return fetch(`/api/producoes?${params}`)
        .then((r) => r.json())
        .then((r) => {
          let newoptions = (r.data as Producao[]).map(
            ({ nm_area_concentracao }) => ({
              label: ptBRcapitalize(nm_area_concentracao),
              value: nm_area_concentracao
            })
          );

          if (!options.find(({ value }) => value === "any") && !search) {
            newoptions = [{ label: "Qualquer área", value: "any" }].concat(
              newoptions
            );
          }

          return {
            options: newoptions,
            hasMore: newoptions.length >= 50,
            additional: { cursor: r.page }
          };
        })
        .catch((err) => {
          console.error(err);
          return { options: [] };
        });
    },
    []
  );

  const onSubmit = React.useCallback(
    (
      values: SearchIESFormValues,
      actions: FormikHelpers<SearchIESFormValues>
    ) => {
      const keys = values.search_by_course ? courseSearchKeys : iesSearchKeys;
      const endpoint = values.search_by_course
        ? values.nm_area_concentracao &&
          values.nm_area_concentracao.value !== "any"
          ? "/api/producoes/ies"
          : "/api/programas/ies"
        : "/api/instituicoes";
      const params = new URLSearchParams();

      for (const key of keys) {
        const option = values[key] as Option;
        if (option?.value) {
          if (!option || option.value === "any") continue;
          params.set(key, option.value.toString());
        }
      }

      if (values.search_by_course) {
        courseDispatch({
          filters: {
            course_category: values.course_category.value.toString(),
            course_type: values.course_type.value.toString(),
            onlyBolsas: values.onlyBolsas,
            rateRange: values.course,
            order_by: values.order_by.value as any
          }
        });

        productionsDispatch({
          filters: {
            nm_area_concentracao: values.nm_area_concentracao.value.toString()
          }
        });

        params.set("min_rate", values.course[0].toString());
        params.set("max_rate", values.course[1].toString());

        if (values.onlyBolsas) params.set("has_bolsas", "true");

        if (
          values.nm_area_concentracao &&
          values.nm_area_concentracao.value !== "any"
        ) {
          params.set(
            "nm_area_concentracao",
            values.nm_area_concentracao.value.toString()
          );
        }
      }

      fetch(`${endpoint}?${params}`)
        .then((response) => response.json())
        .then(({ data }) => setIESs(data))
        .catch(console.error)
        .finally(() => actions.setSubmitting(false));
    },
    [setIESs, courseDispatch, productionsDispatch]
  );

  return {
    initialValues,
    regionsOptions: brazilLocations.regions,
    iesTypeOptions,
    iesAdministrationOptions,
    courseOrderByOptions,
    searchProductionsCategories,
    getCourseCategoriesOptions,
    getStateOptionsBasedOnRegion,
    getCityOptionsBasedOnState,
    getIESAdministrationOptions,
    resetCoursesFilters,
    getUniNamesOptions,
    onSubmit
  };
}
