import { parseIesCsv, defaultParse } from "@common/utils/csv";
import { Bolsa, Programa } from "@prisma/client";
import path from "path";

describe("Parse CSV", () => {
  it("should parse ies csv", () => {
    const filepath = path.resolve(__dirname, "fixtures/instituicoes.csv");
    const iess = parseIesCsv(filepath);

    expect(iess).toMatchObject([
      {
        cod_ies: "1",
        cod_municipio: "5101803",
        telefones: null,
        emails: null,
        site: null,
        latitude: "-15.877477645874",
        longitude: "-52.3133163452148",
        local_coordenada: "INSTITUICAO"
      },
      {
        cod_ies: "5",
        cod_municipio: "2211001",
        telefones: "(86)3215-5620,(86)3215-5621,(86)3215-1104",
        emails: "diretoria.avaliacao@ufpi.edu.br,adm.sup@ufpi.edu.br",
        site: "www.ufpi.br",
        latitude: "-5.05852746963501",
        longitude: "-42.798469543457",
        local_coordenada: "INSTITUICAO"
      },
      {
        cod_ies: "271",
        cod_municipio: "3541406",
        telefones: "(18)3229-1000",
        emails: "reitoria@unoeste.br,proacad@unoeste.br,rsantana@unoeste",
        site: "www.unoeste.br",
        latitude: "-22.1332874298096",
        longitude: "-51.4028625488281",
        local_coordenada: "INSTITUICAO"
      },
      {
        cod_ies: "191",
        cod_municipio: "3304557",
        telefones: "(21)3390-6365",
        emails: "ftesm@ism.com.br",
        site: null,
        latitude: "-22.9527282714844",
        longitude: "-43.1740226745605",
        local_coordenada: "INSTITUICAO"
      }
    ]);
  });

  it("should parse bolsas csv", () => {
    const filepath = path.resolve(__dirname, "fixtures/bolsas.csv");
    const bolsas = defaultParse<Bolsa>(filepath);

    expect(bolsas).toMatchObject([
      {
        an_referencia: "2020",
        cd_ies_capes: "33010013",
        cd_programa: "33010013011P0",
        nm_area_conhecimento: "CIÊNCIAS AMBIENTAIS",
        nm_nivel_padrao: "OUTROS",
        qt_bolsas_concedidas: "1"
      },
      {
        an_referencia: "2020",
        cd_ies_capes: "33002010",
        cd_programa: "33002010208P0",
        nm_area_conhecimento:
          "RELAÇÕES INTERNACIONAIS, BILATERAIS E MULTILATERAIS",
        nm_nivel_padrao: "OUTROS",
        qt_bolsas_concedidas: "1"
      },
      {
        an_referencia: "2020",
        cd_ies_capes: "33002029",
        cd_programa: null,
        nm_area_conhecimento: null,
        nm_nivel_padrao: "OUTROS",
        qt_bolsas_concedidas: "1"
      }
    ]);
  });

  it("should parse programas csv", () => {
    const filepath = path.resolve(__dirname, "fixtures/programas.csv");
    const programas = defaultParse<Programa>(filepath);

    expect(programas).toMatchObject([
      {
        an_base: "2019",
        nm_especialidade: null,
        nm_subarea_conhecimento: "CIÊNCIAS CONTÁBEIS",
        cd_programa_ies: "40001016050P0"
      },
      {
        an_base: "2019",
        nm_especialidade: null,
        nm_subarea_conhecimento: null,
        cd_programa_ies: "52001016004P2"
      },
      {
        an_base: "2019",
        nm_especialidade: null,
        nm_subarea_conhecimento: null,
        cd_programa_ies: "52001016048P0",
        sg_entidade_ensino_rede:
          "USP/RP;UNESP-ARAR;UFSM;UFSC;UFRN;UFRGS;UFPE;UFOP;UFMG"
      }
    ]);
  });
});
