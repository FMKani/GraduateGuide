import { Ies, Programa } from "@prisma/client";

export function ptBRcapitalize(str: string) {
  const tokens = str.split(" ");
  const result: string[] = [];

  for (const [index, token] of tokens.entries()) {
    // Se por acaso vir abreviado
    if (/^[a-zA-Z]{1}\.$/.test(token)) {
      result.push(token.toUpperCase());
      continue;
    }

    // Preposicoes em pt-BR sao sempre duas letras ignorando o plural (acho)
    if (
      (token.length - 1 < 3 ||
        (token.length - 1 < 3 && /[sS]$/.test(token)) ||
        ["com"].includes(token.toLowerCase())) &&
      !["são"].includes(token.toLowerCase()) &&
      index > 0
    ) {
      result.push(token.toLowerCase());
      continue;
    }

    // Nenhum dos casos especiais, poe a primeira letra em maiuscula
    result.push(
      `${token.slice(0, 1).toUpperCase()}${token.slice(1).toLocaleLowerCase()}`
    );
  }

  return result.join(" ");
}

export const iesSearchKeys = [
  "region",
  "state",
  "city",
  "ies_type",
  "ies_organization",
  "ies_administration",
  "ies_name"
] as const;

export const courseSearchKeys = [
  "course_category",
  "course_type"
  // "uni_name",
  // "min_rate",
  // "max_rate"
] as const;

export const mapSearchKeyToDatabaseColumn: Partial<
  Record<
    typeof iesSearchKeys[number] | typeof courseSearchKeys[number],
    keyof Ies | keyof Programa
  >
> = {
  region: "regiao",
  state: "estado",
  city: "cod_municipio",
  ies_type: "rede",
  ies_organization: "organizacao",
  ies_administration: "administracao",
  course_category: "nm_area_basica",
  course_type: "nm_modalidade_programa"
  // uni_name: "nm_entidade_ensino"
};

export function apiMapQueryKeysToColumns<
  T extends boolean,
  R = T extends true ? Partial<Programa> : Partial<Ies>
>(obj: Record<string, string | string[]>, isCourse?: T) {
  const keys = isCourse ? courseSearchKeys : iesSearchKeys;
  const result = {} as any;

  for (const key of keys) {
    result[mapSearchKeyToDatabaseColumn[key]] = obj[key];
  }

  return result as R;
}
