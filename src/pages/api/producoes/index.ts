import { NextApiHandler } from "next";
import { defaultParse } from "@common/utils/csv";
import { parseForm } from "@common/utils/formidable";
import { Producao } from "@prisma/client";
import prisma from "@common/libs/prisma";

const post: NextApiHandler = async (request, response) => {
  try {
    const { files } = await parseForm(request);

    const programas = await prisma.programa.groupBy({
      by: ["id", "cd_programa_ies"]
    });

    const lookupTable: Record<string, string> = {};

    programas.forEach(
      ({ cd_programa_ies, id }) => (lookupTable[cd_programa_ies] = id)
    );

    const producoes = defaultParse<Producao>(files[0].filepath).map((p) => ({
      ...p,
      programaId: lookupTable[p.cd_programa_ies] || null
    }));

    const size = 10000;
    const slices = Math.ceil(producoes.length / size);

    for (let i = 0; i < slices; i++) {
      const slice = producoes.slice(i * size, i * size + size);

      await prisma.producao.createMany({
        data: slice,
        skipDuplicates: true
      });
    }

    response.json({ code: " success" });
  } catch (err) {
    response.status(err.status || 500).json({ code: err.code, detail: err });
  }
};

const get: NextApiHandler = async (request, response) => {
  const { course_id, nm_area_concentracao, limit, page, select, distinct } =
    request.query;

  const where: any = {
    programa: { id: course_id?.toString() },

    nm_area_concentracao: {
      mode: "insensitive",
      startsWith: nm_area_concentracao?.toString()
    }
  };

  const count = await prisma.producao.count({ where });

  const sel: any = {};

  if (select) {
    (Array.isArray(select) ? select : select.split(",")).forEach(
      (s) => (sel[s] = true)
    );
  }

  const producoes = await prisma.producao.findMany({
    ...(+limit ? { take: +limit } : {}),
    ...(+page ? { skip: +limit * +page } : {}),
    ...(select ? { select: sel, orderBy: { [select.toString()]: "asc" } } : {}),
    ...(distinct
      ? { distinct: (Array.isArray(distinct) ? distinct : [distinct]) as any }
      : {}),
    where
  });

  response.json({
    data: producoes,
    page: producoes.length === +limit ? +page + 1 : undefined,
    count
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
