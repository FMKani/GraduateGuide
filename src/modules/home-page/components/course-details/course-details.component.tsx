import * as React from "react";
import { useCourseDetails } from "./course-details.hook";
import { ptBRcapitalize } from "@common/utils/etc";
import { HiOutlineX, HiStar } from "react-icons/hi";
import ProductionsList from "./productions-list";
import TabSwitcher from "../tab-switcher";

// export interface CourseProductionsProps {}

const CourseProductions: React.VFC = () => {
  const {
    /*productions, productionsLoading,*/ course,
    close /*handleScroll*/
  } = useCourseDetails();
  const [tab, setTab] = React.useState<number>();

  const containerStyles = React.useMemo(() => {
    const common =
      "flex flex-col pointer-events-auto absolute bottom-6 [max-height:calc(100vh-3rem)] bg-white rounded-md shadow-lg";
    return {
      0: `${common} right-[calc(3rem+460px)] [width:460px]`,
      1: `${common} right-6 h-full [width:calc(2*460px)] z-10`
    }[tab];
  }, [tab]);

  if (!course) return null;

  const filledStars = +course.cd_conceito_programa;
  const unfilledStars = 7 - filledStars;

  return (
    <section className={containerStyles}>
      <section className="px-6 pt-6 pb-4 flex items-start justify-between space-x-6">
        <span>
          <h4 className="text-xs uppercase font-medium text-gray-500 tracking-wide">
            Curso
          </h4>
          <h3 className="font-semibold text-lg">
            {ptBRcapitalize(course.nm_programa_ies)}
          </h3>
        </span>
        <button type="button" onClick={close}>
          <HiOutlineX size={20} />
        </button>
      </section>

      <TabSwitcher onChange={setTab} tabs={["Detalhes", "Produções"]} />

      {tab === 0 && (
        <section className="grid grid-cols-2 gap-y-6 gap-x-3 p-6">
          <div>
            <h3 className="font-semibold mb-1">Ano base</h3>
            <p className="text-gray-500">{ptBRcapitalize(course.an_base)}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Área de avaliação</h3>
            <p className="text-gray-500">
              {ptBRcapitalize(course.nm_area_avaliacao)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Área básica</h3>
            <p className="text-gray-500 break-words">
              {ptBRcapitalize(course.nm_area_basica)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Situação</h3>
            <span>
              <p className="text-gray-500 font-medium mb-1">
                {ptBRcapitalize(course.ds_situacao_programa)}
              </p>
              <p className="text-xs text-gray-400 uppercase font-medium">
                Verificado{" "}
                {course.dt_situacao_programa
                  .split(":")[0]
                  .split("")
                  .map((c, i) => ([1, 4].includes(i) ? `${c} ` : c))}
              </p>
            </span>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Avaliação</h3>
            <div className="flex items-center space-x-2 cursor-pointer">
              <span title="Avaliação do curso" className="flex items-center">
                {new Array(filledStars).fill("").map((_, i) => (
                  <HiStar size={20} className="text-primary" key={i} />
                ))}

                {new Array(unfilledStars).fill("").map((_, i) => (
                  <HiStar
                    size={20}
                    className="text-primary text-opacity-30"
                    key={i}
                  />
                ))}
              </span>
              <p className="text-sm text-primary font-medium">
                {+course.cd_conceito_programa}
              </p>
            </div>
          </div>
        </section>
      )}

      {tab === 1 && <ProductionsList />}
    </section>
  );
};

export default CourseProductions;
