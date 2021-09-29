CREATE TABLE Bolsa
(
  an_referencia integer,
  nm_municipio_ies_capes character varying(30) NOT NULL,
  sg_uf_ies_capes character varying(5) NOT NULL,
  nm_regiao_ies_capes character varying(30),
  cd_ies_capes character varying(100) NOT NULL,
  nm_ies_capes character varying(100) NOT NULL,
  cod_ies integer NOT NULL,
  nm_natureza_juridica character varying(30),
  sg_programa_fomento character varying(8),
  cd_programa_ies character varying(30) NOT NULL,
  nm_programa character varying(100) NOT NULL,
  nm_grande_area character varying(100) NOT NULL,
  nm_area_avaliacao character varying(100) NOT NULL,
  nm_area_conhecimento character varying(100) NOT NULL,
  nm_nivel_padrao character varying(30),
  qt_bolsas_concedidas integer NOT NULL,
  
  CONSTRAINT fk_cd_programa_ies PRIMARY KEY (cd_programa_ies),
  CONSTRAINT fk_instituicao FOREIGN KEY (cod_ies, cod_municipio)
       REFERENCES instituicao (cod_ies, cod_municipio)
)
