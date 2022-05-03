import * as React from "react";
import {
  HiSearch,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlineAcademicCap,
  HiOutlineNewspaper
} from "react-icons/hi";
import { Option, useSearchIesForm } from "./search-ies-form.hook";
import { Formik, Form } from "formik";
import FormDropdownInput from "./form-dropdown-input";
import SwitchButton from "./switch-button";
import FormSection from "./form-section";
import FormRange from "./form-range";

export interface SearchIesFormProps {
  courseModalitiesOptions: Option[];
  organizationsOptions: Option[];
}

const SearchIesForm: React.FC<SearchIesFormProps> = (props) => {
  const {
    initialValues,
    regionsOptions,
    iesTypeOptions,
    courseOrderByOptions,
    searchProductionsCategories,
    getCourseCategoriesOptions,
    getStateOptionsBasedOnRegion,
    getCityOptionsBasedOnState,
    getIESAdministrationOptions,
    resetCoursesFilters,
    getUniNamesOptions,
    onSubmit
  } = useSearchIesForm();

  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues}>
      {(formik) => (
        <Form className="flex flex-col justify-between h-full">
          <section className="overflow-auto p-6 space-y-12 flex-1">
            {!formik.values.search_by_course && (
              <>
                <FormSection title="Local" icon={HiOutlineLocationMarker}>
                  <FormDropdownInput
                    label="Região"
                    loadOptions={() => ({ options: regionsOptions })}
                    value={formik.values.region}
                    onChange={(v) => {
                      formik.setFieldValue("region", v);
                      // prettier-ignore
                      formik.setFieldValue("state", { label: "Qualquer estado", value: "any"});
                      // prettier-ignore
                      formik.setFieldValue("city", { label: "Qualquer cidade", value: "any" });
                    }}
                  />

                  <FormDropdownInput
                    label="Estado"
                    loadOptions={(search, _, nav) =>
                      getStateOptionsBasedOnRegion(
                        formik.values.region,
                        search,
                        +nav?.cursor || undefined
                      )
                    }
                    value={formik.values.state}
                    onChange={(v) => {
                      formik.setFieldValue("state", v);
                      // prettier-ignore
                      formik.setFieldValue("city", { label: "Qualquer cidade", value: "any" });
                    }}
                  />

                  <FormDropdownInput
                    label="Cidade"
                    loadOptions={(search, _, nav) =>
                      getCityOptionsBasedOnState(
                        formik.values.state,
                        search,
                        +nav?.cursor || undefined
                      )
                    }
                    value={formik.values.city}
                    onChange={(v) => formik.setFieldValue("city", v)}
                  />
                </FormSection>

                <FormSection title="Insituição" icon={HiOutlineOfficeBuilding}>
                  <FormDropdownInput
                    label="Nome"
                    loadOptions={getUniNamesOptions}
                    value={formik.values.ies_name}
                    onChange={(v) => {
                      formik.setFieldValue("ies_name", v);
                    }}
                  />

                  <FormDropdownInput
                    label="Rede"
                    options={iesTypeOptions}
                    value={formik.values.ies_type}
                    onChange={(v) => {
                      formik.setFieldValue("ies_type", v);
                      formik.setFieldValue("ies_administration", {
                        label: "Qualquer administração",
                        value: "any"
                      });
                    }}
                  />

                  <FormDropdownInput
                    label="Organização"
                    options={props.organizationsOptions}
                    value={formik.values.ies_organization}
                    onChange={(v) =>
                      formik.setFieldValue("ies_organization", v)
                    }
                  />

                  <FormDropdownInput
                    label="Administração"
                    options={getIESAdministrationOptions(
                      formik.values.ies_type.value.toString()
                    )}
                    value={formik.values.ies_administration}
                    onChange={(v) =>
                      formik.setFieldValue("ies_administration", v)
                    }
                  />
                </FormSection>
              </>
            )}

            {formik.values.search_by_course && (
              <>
                <FormSection title="Curso" icon={HiOutlineAcademicCap}>
                  <FormDropdownInput
                    label="Área"
                    // options={props.courseCategoriesOptions}
                    loadOptions={getCourseCategoriesOptions}
                    value={formik.values.course_category}
                    onChange={(v) => formik.setFieldValue("course_category", v)}
                  />

                  <FormDropdownInput
                    label="Modalidade"
                    options={props.courseModalitiesOptions}
                    value={formik.values.course_type}
                    onChange={(v) => formik.setFieldValue("course_type", v)}
                  />

                  <FormDropdownInput
                    label="Ordenar por"
                    options={courseOrderByOptions}
                    value={formik.values.order_by}
                    onChange={(v) => formik.setFieldValue("order_by", v)}
                  />

                  {/* <label className="flex items-center space-x-3 cursor-pointer select-none py-3">
                  <input
                    type="checkbox"
                    checked={formik.values.has_bolsas}
                    onChange={({ target }) =>
                      formik.setFieldValue("has_bolsas", target.checked)
                    }
                  />
                  <p className="text-gray-500">Bolsas disponíveis</p>
                </label> */}

                  <section className="py-3">
                    <label className="cursor-pointer flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formik.values.onlyBolsas}
                        onChange={({ target }) =>
                          formik.setFieldValue("onlyBolsas", target.checked)
                        }
                      />
                      <p>Oferece bolsas</p>
                    </label>
                  </section>

                  <FormRange
                    title="Avaliação"
                    values={formik.values.course}
                    onChange={(v) => formik.setFieldValue("course", v)}
                  />
                </FormSection>

                <FormSection title="Produções" icon={HiOutlineNewspaper}>
                  <FormDropdownInput
                    label="Área"
                    loadOptions={searchProductionsCategories}
                    value={formik.values.nm_area_concentracao}
                    styles={{
                      menu: (style) => ({ ...style, height: 300, top: -320 })
                    }}
                    onChange={(v) =>
                      formik.setFieldValue("nm_area_concentracao", v)
                    }
                  />
                </FormSection>
              </>
            )}
          </section>

          <section className="p-6 space-y-6">
            <label className="flex items-center space-x-4 cursor-pointer ml-3">
              <SwitchButton
                checked={formik.values.search_by_course}
                onChange={(v) => {
                  formik.resetForm();
                  if (!v) {
                    resetCoursesFilters();
                  }
                  formik.setFieldValue("search_by_course", v);
                }}
              />
              <p className="select-none">Buscar por curso</p>
            </label>

            <button
              type="submit"
              className="relative rounded-md w-full px-4 py-2.5 bg-primary"
            >
              <HiSearch className="h-5 w-5 absolute left-4 text-white" />
              <p className="text-white text-sm font-semibold">Buscar</p>
            </button>
          </section>
        </Form>
      )}
    </Formik>
  );
};

export default SearchIesForm;
