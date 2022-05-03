import * as React from "react";
import {
  HiOutlineX,
  HiLocationMarker,
  HiAcademicCap,
  HiPhone,
  HiMail,
  HiGlobeAlt
} from "react-icons/hi";
import { ptBRcapitalize } from "@common/utils/etc";
import { useIesDetails } from "./ies-details.hook";
import { IconType } from "react-icons";
import TabSwitcher from "../tab-switcher";
import CourseList from "./course-list";

interface InfoLineProps {
  text: string | string[] | null | undefined;
  icon: IconType;
}

const InfoLine: React.VFC<InfoLineProps> = (props) => {
  const Icon = React.useRef(props.icon).current;

  return (
    <span className="flex space-x-4">
      <Icon className="transform-gpu translate-y-0.5" size={20} />
      <span className="flex-1 flex flex-col">
        {!Array.isArray(props.text) && (
          <p>
            {props.text?.replaceAll("null", "Não informado") || "Não informado"}
          </p>
        )}

        {Array.isArray(props.text) &&
          props.text.map((t, i) => {
            if (t.includes("@"))
              return (
                <a
                  key={i}
                  className="text-primary hover:underline max-w-max"
                  rel="noreferrer"
                  target="_blank"
                  href={`mailto:${t}`}
                >
                  {t}
                </a>
              );

            if (t.includes("www"))
              return (
                <a
                  key={i}
                  className="text-primary hover:underline max-w-max"
                  rel="noreferrer"
                  target="_blank"
                  href={`https://${t}`}
                >
                  {t}
                </a>
              );

            return <p key={i}>{t}</p>;
          })}
      </span>
    </span>
  );
};

// ----------------------------------------------------------------------------------------------------------------------------

const IesDetails: React.VFC = () => {
  const { IES, courses, coursesLoading, close, handleScroll } = useIesDetails();
  const [tab, setTab] = React.useState<number>();

  if (!IES) return null;

  return (
    <section className="flex flex-col pointer-events-auto bg-white absolute right-6 bottom-6 rounded-md shadow-lg [max-height:calc(100vh-3rem)] [width:460px]">
      <section className="px-6 pt-6 pb-4 flex items-start justify-between space-x-6">
        <span>
          <h4 className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Instituição
          </h4>
          <h3 className="font-semibold text-lg">
            {ptBRcapitalize(IES.nome_ies)}
          </h3>
        </span>
        <button type="button" onClick={close}>
          <HiOutlineX size={20} />
        </button>
      </section>

      <TabSwitcher tabs={["Detalhes", "Cursos"]} onChange={setTab} />

      {tab === 0 && (
        <section className="p-6 space-y-3">
          {/* prettier-ignore */}
          <InfoLine text={`${IES.endereco}, ${IES.numero_endereco} - ${IES.cep}`} icon={HiLocationMarker} />
          {/* prettier-ignore */}
          <InfoLine text={`${IES.organizacao} - ${IES.rede} - ${IES.administracao}`} icon={HiAcademicCap} />
          <InfoLine text={IES.telefones?.split(",")} icon={HiPhone} />
          <InfoLine text={IES.emails?.split(",")} icon={HiMail} />
          <InfoLine text={IES.site?.split(",")} icon={HiGlobeAlt} />
        </section>
      )}

      {tab === 1 && (
        <section onScroll={handleScroll} className="overflow-y-auto">
          {!coursesLoading && <CourseList courses={courses} />}
          {coursesLoading && "Loading..."}
        </section>
      )}
    </section>
  );
};

export default IesDetails;
