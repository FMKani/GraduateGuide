import * as React from "react";
import {
  HiOutlineX,
  HiBookmark,
  HiLightningBolt,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker
} from "react-icons/hi";
import { ptBRcapitalize } from "@common/utils/etc";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { useIES } from "@modules/home-page/contexts/ies.context";
import { Course } from "@common/types";
import { Bolsa, Ies } from "@prisma/client";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import LayerGroup from "ol/layer/Group";
import Geometry from "ol/geom/Geometry";
import slugify from "slugify";
import Style from "ol/style/Style";
import Point from "ol/geom/Point";
import Tile from "ol/layer/Tile";
import View from "ol/View";
import Icon from "ol/style/Icon";
import OSM from "ol/source/OSM";
import Map from "ol/Map";

export interface Comparing {
  course: Course;
  ies: Ies;
}

interface ComparingProps {
  from: Comparing;
  to?: Comparing;
}

// ------------------------------------------------------------------------------------------------------------

const LocCol: React.VFC<ComparingProps> = ({ from }) => {
  const map = React.useRef<Map>();
  const markers = React.useRef<VectorLayer<VectorSource<Geometry>>>();

  const setupOSM = React.useRef(() => {
    map.current = new Map({
      target: `${from.course.cd_programa_ies}-map`,
      view: new View({ center: [0, 0], zoom: 2 })
    });

    const osmStandard = new Tile({ source: new OSM() });

    markers.current = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          src: "/images/marker-on.png"
        })
      })
    });

    const layerGroups = new LayerGroup({
      layers: [osmStandard, markers.current]
    });

    map.current.addLayer(layerGroups);
  });

  React.useEffect(() => {
    setupOSM.current();

    markers.current?.getSource().addFeature(
      new Feature({
        geometry: new Point(
          fromLonLat([+from.ies.longitude, +from.ies.latitude])
        )
      })
    );
  }, [from]);

  return (
    <td className="p-8">
      <span className="flex items-center space-x-3 text-primary mb-6">
        <HiOutlineLocationMarker size={24} />
        <p className="font-semibold">Localização</p>
      </span>
      <div className="space-y-3 mb-6">
        <span className="block">
          <label className="text-xs tracking-wider text-gray-500 font-medium uppercase">
            Enedereço
          </label>
          <p>
            {from.ies.endereco && from.ies.numero_endereco && from.ies.cep
              ? `${from.ies.endereco}, ${from.ies.numero_endereco} - ${from.ies.cep}`
              : "Não informado"}
          </p>
        </span>

        <div className="flex justify-between">
          <span className="inline-block">
            <label className="text-xs tracking-wider text-gray-500 font-medium uppercase">
              Região
            </label>
            <p>{from.ies.regiao}</p>
          </span>
        </div>
      </div>
      <div className="aspect-video [background-color:#aad3df] rounded-md overflow-hidden relative">
        <span
          className="w-full h-full block"
          id={`${from.course.cd_programa_ies}-map`}
        />
      </div>
    </td>
  );
};

// ------------------------------------------------------------------------------------------------------------

const UniCol: React.VFC<ComparingProps> = ({ from }) => {
  return (
    <td className="p-8">
      <span className="flex items-center space-x-3 text-primary mb-6">
        <HiOutlineOfficeBuilding size={24} />
        <p className="font-semibold">Instituição</p>
      </span>
      <div className="space-y-3">
        <span className="block">
          <label className="text-xs tracking-wider text-gray-500 font-medium uppercase">
            Nome
          </label>
          <p>{from.ies.nome_ies}</p>
        </span>

        <div className="flex justify-between">
          <span className="inline-block">
            <label className="text-xs tracking-wider text-gray-500 font-medium uppercase">
              Rede
            </label>
            <p>{from.ies.rede}</p>
          </span>

          <span className="inline-block">
            <label className="text-xs tracking-wider text-gray-500 font-medium uppercase">
              Administração
            </label>
            <p>{from.ies.administracao}</p>
          </span>

          <span className="inline-block">
            <label className="text-xs tracking-wider text-gray-500 font-medium uppercase">
              Modalidade
            </label>
            <p>{ptBRcapitalize(from.course.nm_modalidade_programa)}</p>
          </span>
        </div>
      </div>
    </td>
  );
};

// ------------------------------------------------------------------------------------------------------------

const s = 20;
const sw = 3.2;
const r = s / 2 - sw / 2;
const c = 2 * Math.PI * r;

const RateCol: React.VFC<ComparingProps> = ({ from, to }) => {
  const getQtdBolsas = React.useCallback(
    (bolsas: Bolsa[], nmIes: string) =>
      bolsas.find(
        ({ nm_ies_capes }) => slugify(nm_ies_capes) === slugify(nmIes)
      )?.qt_bolsas_concedidas || 0,
    []
  );

  const fromQtdBolsas = React.useMemo(
    () => getQtdBolsas(from.course.bolsas, from.course.nm_entidade_ensino),
    [from.course, getQtdBolsas]
  );
  const toQtdBolsas = React.useMemo(
    () => getQtdBolsas(to.course.bolsas, to.course.nm_entidade_ensino),
    [to.course, getQtdBolsas]
  );

  const rateDif = React.useMemo(
    () => from.course.cd_conceito_programa - to.course.cd_conceito_programa,
    [from.course.cd_conceito_programa, to.course.cd_conceito_programa]
  );
  const prodDif = React.useMemo(
    () => +from.course._count.producoes - +to.course._count.producoes,
    [from.course._count.producoes, to.course._count.producoes]
  );

  const getDifText = React.useCallback(
    (n: number) => `(${n >= 0 ? "+" : ""}${n})`,
    []
  );

  const getDifStyle = React.useCallback(
    (n: number) =>
      (n >= 0 ? "text-emerald-500" : "text-red-400") + " text-sm font-medium",
    []
  );

  return (
    <td className="border-t border-b py-8 space-y-6">
      <h3 className="font-semibold text-center">
        Avaliação{" "}
        <span className={getDifStyle(rateDif)}>{getDifText(rateDif)}</span>
      </h3>
      <svg
        width={200}
        viewBox={`0 0 ${s} ${s}`}
        className="text-primary mx-auto"
      >
        <circle
          className="transform-gpu -scale-x-100 rotate-90 origin-center"
          cx={s / 2}
          cy={s / 2}
          r={r}
          strokeWidth={sw}
          stroke="currentColor"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={((7 - from.course.cd_conceito_programa) / 7) * c}
        />

        <circle
          cx={s / 2}
          cy={s / 2}
          r={r}
          strokeWidth={sw}
          strokeOpacity={0.35}
          stroke="currentColor"
          fill="none"
        />

        <text
          className="text-primary font-semibold font-sans"
          fontSize={5}
          fill="currentColor"
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {from.course.cd_conceito_programa}
        </text>
      </svg>
      <div className="space-y-2">
        <span className="flex space-x-2 items-center mx-auto max-w-max">
          <HiLightningBolt size={20} />
          <p className="font-medium">
            {fromQtdBolsas} bolsas disponíveis{" "}
            <span className={getDifStyle(fromQtdBolsas - toQtdBolsas)}>
              {getDifText(fromQtdBolsas - toQtdBolsas)}
            </span>
          </p>
        </span>

        <span className="flex space-x-2 items-center mx-auto max-w-max">
          <HiBookmark size={20} />
          <p className="font-medium">
            {from.course._count.producoes} produções acadêmicas{" "}
            <span className={getDifStyle(prodDif)}>{getDifText(prodDif)}</span>
          </p>
        </span>
      </div>
    </td>
  );
};

// ------------------------------------------------------------------------------------------------------------

const TitleCol: React.VFC<ComparingProps> = ({ from }) => {
  return (
    <td className="align-top px-8 pb-6">
      <h4 className="text-xs text-gray-500 font-medium tracking-wider mb-2">
        {from.course.nm_area_basica}
      </h4>
      <h2 className="font-semibold text-xl">
        {ptBRcapitalize(from.course.nm_programa_ies)}
      </h2>
    </td>
  );
};

// ------------------------------------------------------------------------------------------------------------

const CourseCompare: React.VFC = () => {
  const [
    {
      comparing: [first, second]
    },
    { setComparing }
  ] = useIES();

  if (!first || !second) return null;

  return (
    <section className="absolute bg-white shadow-lg rounded-md z-10 bottom-6 right-6 [width:calc(2*460px)] [height:calc(100vh-3rem)] pointer-events-auto flex flex-col">
      <span className="flex justify-between p-6">
        <h1 className="text-center font-extrabold text-3xl flex-1">
          Compare cursos
        </h1>
        <button type="button" onClick={() => setComparing([])}>
          <HiOutlineX size={20} />
        </button>
      </span>
      <div className="overflow-y-auto p-8">
        <table className="w-full table-fixed overflow-x-auto">
          <tbody>
            <tr className="divide-x">
              <TitleCol from={first} />
              <TitleCol from={second} />
            </tr>
            <tr className="divide-x">
              <RateCol from={first} to={second} />
              <RateCol from={second} to={first} />
            </tr>
            <tr className="divide-x">
              <UniCol from={first} />
              <UniCol from={second} />
            </tr>
            <tr className="divide-x border-t">
              <LocCol from={first} />
              <LocCol from={second} />
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CourseCompare;
