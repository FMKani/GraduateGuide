import * as React from "react";
import { UploadState, useUploadForm } from "./upload-form.hook";
import { Formik, Form } from "formik";
import UploadFormField from "@modules/upload-page/components/upload-form-field";

export interface UploadFormProps {
  onUploadStateChange?: (s: UploadState) => void;
}

const UploadForm: React.VFC<UploadFormProps> = (props) => {
  const { initialValues, validationSchema, uploadState, onSubmit } =
    useUploadForm();

  React.useEffect(() => {
    props.onUploadStateChange && props.onUploadStateChange(uploadState);
  }, [uploadState, props]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="space-y-6">
          <UploadFormField name="instituicoes" title="Instituições" />
          <UploadFormField name="bolsas" title="Bolsas" />
          <UploadFormField name="programas" title="Programas" />
          <UploadFormField name="producoes" title="Produções" />

          <button
            disabled={formik.isSubmitting}
            className="px-4 py-2 text-sm font-semibold tracking-wide bg-primary text-white rounded-sm disabled:bg-gray-200 disabled:text-gray-400"
            type="submit"
          >
            Fazer upload
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default UploadForm;
