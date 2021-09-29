CREATE TABLE Producao
(
  cd_programa_ies character varying(30) NOT NULL,
  nm_programa_ies character varying(100) NOT NULL,
  nm_entidade_ensino character varying(100) NOT NULL,
  an_base integer,
  id_add_producao_intelectual character varying(30) NOT NULL,
  id_producao_intelectual character varying(30) NOT NULL,
  nm_producao character varying(30) NOT NULL,
  id_tipo_producao integer
  nm_tipo_producao character varying(30) NOT NULL,
  id_subtipo_producao integer, 
  nm_subtipo_producao character varying(30),
  id_formulario_producao integer,
  nm_formulario character varying(30),
  id_area_concentracao character varying(30),
  nm_area_concentracao character varying(100),
  id_linha_pesquisa character varying(30),
  nm_linha_pesquisa character varying(100),
  id_projeto character varying(30),
  nm_projeto character varying(100),
  dh_inicio_area_conc timestamp,
  dh_fim_area_conc timestamp,
  dh_inicio_linha timestamp,
  dh_fim_linha timestamp,
  in_glosa integer,
  
  CONSTRAINT pk_id_producao_intelectual PRIMARY KEY (id_producao_intelectual),
  CONSTRAINT fk_programa FOREIGN KEY (cd_programa_ies)
      REFERENCES instituicao (cd_programa_ies
)
