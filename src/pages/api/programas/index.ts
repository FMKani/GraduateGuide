import { NextApiHandler } from "next";
import { defaultParse } from "@common/utils/csv";
import { parseForm } from "@common/utils/formidable";
import { Programa } from "@prisma/client";
import _slugify from "slugify";
import prisma from "@common/libs/prisma";

const slugify = (s: string) => {
  if (!s) return null;
  return _slugify(s, {
    lower: true,
    strict: true,
    locale: "br"
  });
};

const post: NextApiHandler = async (request, response) => {
  try {
    const { files } = await parseForm(request);

    const instituicoes = await prisma.ies.groupBy({
      by: ["id", "nome_ies", "municipio", "sigla_ies"]
    });

    const lookupTable: Record<
      string,
      Record<string, Record<string, string>>
    > = {};

    instituicoes.forEach(({ id, nome_ies, municipio, sigla_ies }) => {
      const nm = slugify(nome_ies);
      const mn = slugify(municipio);
      const sg = slugify(sigla_ies);

      lookupTable[nm] = lookupTable[nm] || {};
      lookupTable[nm][mn] = lookupTable[nm][mn] || {};

      lookupTable[nm] = {
        ...lookupTable[nm],
        [mn]: {
          ...lookupTable[nm][mn],
          [sg]: id
        }
      };
    });

    const programas = defaultParse<Programa>(files[0].filepath).map((p) => {
      const nm = slugify(p.nm_entidade_ensino);
      const mn = slugify(p.nm_municipio_programa_ies);
      const sg = slugify(p.sg_entidade_ensino);

      const l1 = lookupTable[nm] || {};
      const l2 = l1[mn] || {};
      const l3 = l2[sg] || null;

      return {
        ...p,
        cd_conceito_programa: +p.cd_conceito_programa || 0,
        iesId: l3
      };
    });

    await prisma.programa
      .createMany({ data: programas, skipDuplicates: true })
      .then(() => response.json({ code: "success" }));
  } catch (err) {
    console.error(err);
    response.status(err.status || 500).json({ code: err.code, detail: err });
  }
};

const get: NextApiHandler = async (request, response) => {
  const {
    min_rate,
    max_rate,
    limit,
    order_by,
    distinct,
    uni_name,
    uni_city_name,
    page,
    course_category,
    course_type,
    has_bolsas,
    nm_area_concentracao,
    ies_id
  } = request.query;

  let orderBy = {};

  if (order_by) {
    const [orderA = "nm_programa_ies", orderB = "asc"] = order_by
      .toString()
      .split(":");

    switch (orderA) {
      case "nm_programa_ies":
      case "cd_conceito_programa":
        orderBy = { [orderA]: orderB };
        break;

      // case "qt_bolsas_concedidas":
      //   orderBy = { bolsas: {} };
      //   break;
    }
  }

  const courses = await prisma.programa.findMany({
    ...(+limit ? { take: +limit } : {}),
    ...(+page ? { skip: +page * +limit } : {}),

    distinct: (Array.isArray(distinct) ? distinct : [distinct]) as any,

    orderBy,

    include: {
      bolsas: true,
      _count: { select: { producoes: true } }
    },

    where: {
      ies: {
        id: ies_id?.toString(),

        nome_ies: {
          mode: "insensitive",
          startsWith: uni_name?.toString()
        },

        municipio: {
          mode: "insensitive",
          startsWith: uni_city_name?.toString()
        }
      },

      nm_area_basica: {
        mode: "insensitive",
        startsWith: course_category?.toString()
      },

      nm_modalidade_programa: {
        mode: "insensitive",
        startsWith: course_type?.toString()
      },

      cd_conceito_programa: { gte: +min_rate || 0, lte: +max_rate || 7 },

      ...(has_bolsas === "true" ? { bolsas: { some: {} } } : {}),

      ...(nm_area_concentracao
        ? {
            producoes: {
              some: {
                nm_area_concentracao: {
                  mode: "insensitive",
                  startsWith: nm_area_concentracao?.toString()
                }
              }
            }
          }
        : {})
    }
  });

  response.json({
    data: courses,
    page: courses.length === +limit ? +page + 1 : undefined
  });
};

const methods = { get, post };

const handler: NextApiHandler = (request, response) => {
  const method = request.method.toLowerCase();
  const methodHandler = methods[method];

  if (!methodHandler) {
    response.setHeader("Allow", "GET, POST");
    response.status(405).end();
    return;
  }

  return methodHandler(request, response);
};

export default handler;

export const config = {
  api: { bodyParser: false }
};
