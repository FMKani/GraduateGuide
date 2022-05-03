import { NextApiHandler } from "next";
import prisma from "@common/libs/prisma";

const get: NextApiHandler = async (request, response) => {
  const {
    nm_area_concentracao,
    min_rate,
    max_rate,
    has_bolsas,
    course_category,
    course_type
  } = request.query;

  const iess = await prisma.ies.findMany({
    where: {
      programas: {
        some: {
          ...(has_bolsas === "true" ? { bolsas: { some: {} } } : {}),

          nm_area_basica: {
            mode: "insensitive",
            startsWith: course_category?.toString()
          },

          nm_modalidade_programa: {
            mode: "insensitive",
            startsWith: course_type?.toString()
          },

          cd_conceito_programa: {
            gte: +min_rate || 0,
            lte: +max_rate || 7
          },

          producoes: {
            some: {
              nm_area_concentracao: {
                mode: "insensitive",
                startsWith: nm_area_concentracao?.toString()
              }
            }
          }
        }
      }
    }
  });

  response.json({ data: iess, count: iess.length });
};

const methods = { get };

const handler: NextApiHandler = (request, response) => {
  const method = request.method.toLowerCase();
  const methodHandler = methods[method];

  if (!methodHandler) {
    response.setHeader("Allow", "GET");
    response.status(405).end();
    return;
  }

  return methodHandler(request, response);
};

export default handler;

export const config = {
  api: { bodyParser: false }
};
