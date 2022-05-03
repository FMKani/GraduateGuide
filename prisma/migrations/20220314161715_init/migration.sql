-- CreateTable
CREATE TABLE "ies" (
    "id" UUID NOT NULL,
    "cod_ies" TEXT,
    "cod_municipio" TEXT,
    "nome_ies" TEXT,
    "sigla_ies" TEXT,
    "municipio" TEXT,
    "regiao" TEXT,
    "estado" TEXT,
    "sigla_estado" TEXT,
    "organizacao" TEXT,
    "rede" TEXT,
    "administracao" TEXT,
    "endereco" TEXT,
    "numero_endereco" TEXT,
    "complemento_endereco" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "telefones" TEXT,
    "emails" TEXT,
    "site" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "local_coordenada" TEXT,

    CONSTRAINT "ies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programas" (
    "id" UUID NOT NULL,
    "ies_id" UUID,
    "an_base" TEXT,
    "nm_grande_area_conhecimento" TEXT,
    "nm_area_conhecimento" TEXT,
    "nm_area_basica" TEXT,
    "nm_subarea_conhecimento" TEXT,
    "nm_especialidade" TEXT,
    "cd_area_avaliacao" TEXT,
    "nm_area_avaliacao" TEXT,
    "sg_entidade_ensino" TEXT,
    "nm_entidade_ensino" TEXT,
    "in_rede" TEXT,
    "sg_entidade_ensino_rede" TEXT,
    "cs_status_juridico" TEXT,
    "ds_dependencia_administrativa" TEXT,
    "ds_organizacao_academica" TEXT,
    "nm_regiao" TEXT,
    "sg_uf_programa" TEXT,
    "nm_municipio_programa_ies" TEXT,
    "nm_modalidade_programa" TEXT,
    "cd_programa_ies" TEXT,
    "nm_programa_ies" TEXT,
    "nm_programa_idioma" TEXT,
    "cd_conceito_programa" INTEGER,
    "an_inicio_programa" TEXT,
    "an_inicio_curso" TEXT,
    "ds_situacao_programa" TEXT,
    "dt_situacao_programa" TEXT,
    "id_add_foto_programa_ies" TEXT,
    "id_add_foto_programa" TEXT,

    CONSTRAINT "programas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bolsas" (
    "id" UUID NOT NULL,
    "programa_id" UUID,
    "an_referencia" TEXT,
    "nm_municipio_ies_capes" TEXT,
    "sg_uf_ies_capes" TEXT,
    "nm_regiao_ies_capes" TEXT,
    "cd_ies_capes" TEXT,
    "nm_ies_capes" TEXT,
    "sg_ies_capes" TEXT,
    "nm_natureza_juridica" TEXT,
    "sg_programa_fomento" TEXT,
    "cd_programa" TEXT,
    "nm_programa" TEXT,
    "nm_grande_area" TEXT,
    "nm_area_avaliacao" TEXT,
    "nm_area_conhecimento" TEXT,
    "nm_nivel_padrao" TEXT,
    "qt_bolsas_concedidas" INTEGER,

    CONSTRAINT "bolsas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producoes" (
    "id" UUID NOT NULL,
    "programa_id" UUID,
    "cd_programa_ies" TEXT,
    "nm_programa_ies" TEXT,
    "sg_entidade_ensino" TEXT,
    "nm_entidade_ensino" TEXT,
    "an_base" TEXT,
    "id_add_producao_intelectual" TEXT,
    "id_producao_intelectual" TEXT,
    "nm_producao" TEXT,
    "id_tipo_producao" TEXT,
    "nm_tipo_producao" TEXT,
    "id_subtipo_producao" TEXT,
    "nm_subtipo_producao" TEXT,
    "id_formulario_producao" TEXT,
    "nm_formulario" TEXT,
    "id_area_concentracao" TEXT,
    "nm_area_concentracao" TEXT,
    "id_linha_pesquisa" TEXT,
    "nm_linha_pesquisa" TEXT,
    "id_projeto" TEXT,
    "nm_projeto" TEXT,
    "dh_inicio_area_conc" TEXT,
    "dh_fim_area_conc" TEXT,
    "dh_inicio_linha" TEXT,
    "dh_fim_linha" TEXT,
    "in_glosa" TEXT,

    CONSTRAINT "producoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ies_nome_ies_municipio_regiao_estado_rede_administracao_idx" ON "ies"("nome_ies", "municipio", "regiao", "estado", "rede", "administracao");

-- CreateIndex
CREATE UNIQUE INDEX "ies_cod_ies_cod_municipio_key" ON "ies"("cod_ies", "cod_municipio");

-- CreateIndex
CREATE INDEX "programas_nm_area_basica_nm_entidade_ensino_cd_programa_ies_idx" ON "programas"("nm_area_basica", "nm_entidade_ensino", "cd_programa_ies", "nm_programa_ies");

-- CreateIndex
CREATE UNIQUE INDEX "programas_cd_programa_ies_key" ON "programas"("cd_programa_ies");

-- CreateIndex
CREATE UNIQUE INDEX "bolsas_an_referencia_cd_programa_sg_ies_capes_key" ON "bolsas"("an_referencia", "cd_programa", "sg_ies_capes");

-- CreateIndex
CREATE INDEX "producoes_cd_programa_ies_nm_area_concentracao_nm_projeto_idx" ON "producoes"("cd_programa_ies", "nm_area_concentracao", "nm_projeto");

-- CreateIndex
CREATE UNIQUE INDEX "producoes_id_producao_intelectual_key" ON "producoes"("id_producao_intelectual");

-- AddForeignKey
ALTER TABLE "programas" ADD CONSTRAINT "programas_ies_id_fkey" FOREIGN KEY ("ies_id") REFERENCES "ies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bolsas" ADD CONSTRAINT "bolsas_programa_id_fkey" FOREIGN KEY ("programa_id") REFERENCES "programas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producoes" ADD CONSTRAINT "producoes_programa_id_fkey" FOREIGN KEY ("programa_id") REFERENCES "programas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
