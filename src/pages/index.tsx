import * as React from "react";
import { GetServerSideProps } from "next";
import { ptBRcapitalize } from "@common/utils/etc";
import { IESProvider } from "@modules/home-page/contexts/ies.context";
import { Option } from "@modules/home-page/components/search-ies-form/search-ies-form.hook";
import CourseCompare from "@modules/home-page/components/course-compare";
import CourseDetails from "@modules/home-page/components/course-details";
import IesDetails from "@modules/home-page/components/ies-details";
import IesCounter from "@modules/home-page/components/ies-counter";
import dynamic from "next/dynamic";

const SearchIESForm = dynamic(
  () => import("@modules/home-page/components/search-ies-form")
);

const OlMap = dynamic(() => import("@modules/home-page/components/ol-map"));

interface HomePageProps {
  courseModalitiesOptions: Option[];
  organizationsOptions: Option[];
}

const HomePage: React.VFC<HomePageProps> = (props) => {
  return (
    <IESProvider>
      <section className="flex items-stretch h-screen">
        <section className="[width:350px]">
          <SearchIESForm
            courseModalitiesOptions={props.courseModalitiesOptions}
            organizationsOptions={props.organizationsOptions}
          />
        </section>

        <section className="flex-1 relative [background-color:#aad3df]">
          <span className="absolute left-0 right-0 bottom-0 top-0 z-10 pointer-events-none">
            <IesCounter />
            <CourseCompare />
            <CourseDetails />
            <IesDetails />
          </span>

          <OlMap />
        </section>
      </section>
    </IESProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = (await import("@common/libs/prisma")).default;

  // Query course modalities
  const courseModalitiesOptions = await prisma.programa
    .groupBy({
      by: ["nm_modalidade_programa"],
      orderBy: { nm_modalidade_programa: "asc" }
    })
    .then((values) =>
      values.map(({ nm_modalidade_programa }) => ({
        label: ptBRcapitalize(nm_modalidade_programa),
        value: nm_modalidade_programa
      }))
    )
    .then((values) =>
      [{ label: "Qualquer modalidade", value: "any" }].concat(values)
    )
    .catch(console.error);

  // Query organizaion type
  const organizationsOptions = await prisma.ies
    .groupBy({
      by: ["organizacao"],
      orderBy: { organizacao: "asc" }
    })
    .then((values) =>
      values.map(({ organizacao }) => ({
        label: ptBRcapitalize(organizacao),
        value: organizacao
      }))
    )
    .then((values) =>
      [{ label: "Qualquer organização", value: "any" }].concat(values)
    )
    .catch(console.error);

  return {
    props: {
      courseModalitiesOptions,
      organizationsOptions
    }
  };
};

export default HomePage;
