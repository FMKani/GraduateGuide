import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import * as React from "react";
import * as yup from "yup";

export interface UploadFormValues {
  instituicoes: File;
  bolsas: File;
  programas: File;
  producoes: File;
}

export interface UploadState {
  instituicoes: "pending" | "success" | "error" | null;
  bolsas: "pending" | "success" | "error" | null;
  programas: "pending" | "success" | "error" | null;
  producoes: "pending" | "success" | "error" | null;
}

const initialValues: UploadFormValues = {
  instituicoes: null,
  bolsas: null,
  programas: null,
  producoes: null
};

const validationSchema = yup.object().shape({
  instituicoes: yup.mixed().optional(),
  bolsas: yup.mixed().optional(),
  programas: yup.mixed().optional()
});

const reducer: React.Reducer<UploadState, Partial<UploadState>> = (
  state,
  action
) => ({
  ...state,
  ...action
});

const uplaodStateInitialValues: UploadState = {
  instituicoes: null,
  bolsas: null,
  programas: null,
  producoes: null
};

export function useUploadForm() {
  const router = useRouter();
  const [uploadState, dispatch] = React.useReducer(
    reducer,
    uplaodStateInitialValues
  );

  const onSubmit = React.useCallback(
    async (
      values: UploadFormValues,
      actions: FormikHelpers<UploadFormValues>
    ) => {
      dispatch({
        instituicoes: null,
        bolsas: null,
        programas: null,
        producoes: null
      });

      const endpoins = [
        "instituicoes",
        "programas",
        "bolsas",
        "producoes"
      ].filter((v) => !!values[v]);

      let hasError = false;

      endpoins.forEach((endpoint) => {
        dispatch({ [endpoint]: "pending" });
      });

      for (let i = 0; i < endpoins.length; i++) {
        const endpoint = endpoins[i];
        const form = new FormData();
        form.append("", values[endpoint]);

        await fetch(`/api/${endpoint}`, { method: "post", body: form })
          .then((r) => {
            if (!r.ok) throw r;
          })
          .then(() => dispatch({ [endpoint]: "success" }))
          .catch(() => {
            dispatch({ [endpoint]: "error" });
            hasError = true;
            // throw err;
          });
      }

      if (!hasError) {
        router.push("/");
      }

      actions.setSubmitting(false);

      // Promise.all(uploads)
      //   .then(() => {
      //     router.push("/");
      //   })
      //   .catch(console.error)
      //   .finally(() => actions.setSubmitting(false));
    },
    [router]
  );

  return {
    initialValues,
    validationSchema,
    uploadState,
    onSubmit
  };
}
