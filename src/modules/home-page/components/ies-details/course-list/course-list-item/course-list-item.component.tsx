import * as React from "react";
import { HiLightningBolt, HiStar } from "react-icons/hi";
import { useCourseListItem } from "./course-list-item.hook";
import { ptBRcapitalize } from "@common/utils/etc";
import { Course } from "@common/types";
import slugify from "slugify";

export interface CourseListItemProps {
  course: Course;
}

const CourseListItem: React.FC<CourseListItemProps> = (props) => {
  const { course } = props;
  const { handleClick, handleChange, comparing } = useCourseListItem(props);

  const qtdBolsas = React.useMemo(
    () =>
      course.bolsas.find(
        ({ nm_ies_capes }) =>
          slugify(nm_ies_capes) === slugify(course.nm_entidade_ensino)
      )?.qt_bolsas_concedidas || 0,
    [course]
  );

  return (
    <button
      onClick={handleClick}
      type="button"
      className="flex items-center hover:bg-gray-100 cursor-pointer w-full"
    >
      <div className="pl-6">
        <input
          onChange={handleChange}
          checked={
            !!comparing.find(({ course: { id } }) => id === props.course.id)
          }
          type="checkbox"
        />
      </div>
      <div className="p-6 space-y-3 text-left">
        <div>
          <h4 className="text-xs font-medium tracking-wider uppercase text-gray-500">
            {props.course.nm_area_basica}
          </h4>
          <h3 className="font-semibold">
            {ptBRcapitalize(props.course.nm_programa_ies)}
          </h3>
        </div>

        <div className="flex items-center space-x-6">
          <div>
            <span
              title="Bolsas disponíveis"
              className="flex items-center space-x-1 cursor-pointer"
            >
              <HiLightningBolt size={18} className="text-primary" />
              <p className="text-sm text-primary">{qtdBolsas}</p>
            </span>
          </div>

          <div className="flex items-center space-x-2 cursor-pointer">
            <span title="Avaliação do curso" className="flex items-center">
              {new Array(props.course.cd_conceito_programa)
                .fill("")
                .map((_, i) => (
                  <HiStar size={20} className="text-primary" key={i} />
                ))}

              {new Array(7 - props.course.cd_conceito_programa)
                .fill("")
                .map((_, i) => (
                  <HiStar
                    size={20}
                    className="text-primary text-opacity-30"
                    key={i}
                  />
                ))}
            </span>
            <p className="text-primary">{props.course.cd_conceito_programa}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default CourseListItem;
