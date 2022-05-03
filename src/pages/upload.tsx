import * as React from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { UploadState } from "@modules/upload-page/components/upload-form/upload-form.hook";
import { FiLoader } from "react-icons/fi";
import dynamic from "next/dynamic";

const UploadForm = dynamic(
  () => import("@modules/upload-page/components/upload-form")
);

const UploadPage: React.VFC = () => {
  const [uploadState, setUploadState] = React.useState<UploadState>(null);

  return (
    <section className="container mx-auto max-w-screen-md py-20">
      <h1 className="text-4xl font-extrabold mb-6">Upload</h1>
      <section className="grid grid-cols-2">
        <UploadForm onUploadStateChange={setUploadState} />
        <section className="border rounded-sm flex flex-col items-center justify-center">
          {!uploadState ||
            (!uploadState.instituicoes &&
              !uploadState.bolsas &&
              !uploadState.programas &&
              !uploadState.producoes && (
                <p>Selecione os arquivos para enviar</p>
              ))}

          <span className="space-y-2">
            {["instituicoes", "bolsas", "programas", "producoes"].map(
              (v, i) => {
                if (!uploadState || !uploadState[v]) return null;

                const name = {
                  instituicoes: "Instituições",
                  bolsas: "Bolsas",
                  programas: "Programas",
                  producoes: "Produções"
                }[v];

                const state = {
                  pending: "Enviando",
                  success: "Enviado",
                  error: "Falha"
                }[uploadState[v]];

                const Icon = {
                  pending: (
                    <FiLoader className="animate-spin w-5 text-gray-500" />
                  ),
                  success: (
                    <HiOutlineCheckCircle className="w-5 text-green-600" />
                  ),
                  error: <HiOutlineXCircle className="w-5 text-red-500" />
                }[uploadState[v]];

                return (
                  <span key={i} className="flex items-center space-x-2">
                    {Icon}
                    <p>
                      {state} {name.toLowerCase()}
                    </p>
                  </span>
                );
              }
            )}
          </span>
        </section>
      </section>
    </section>
  );
};

export default UploadPage;
