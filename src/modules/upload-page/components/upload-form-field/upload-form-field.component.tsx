import * as React from "react";
import { UploadFormValues } from "../upload-form-form.hook";
import { useFormikContext } from "formik";

export interface UploadFormFieldProps {
  name: keyof UploadFormValues;
  title: string;
}

const UploadFormField: React.VFC<UploadFormFieldProps> = (props) => {
  const formik = useFormikContext<UploadFormValues>();

  return (
    <span className="flex flex-col">
      <h3 className="text-xl font-medium mb-2">{props.title}</h3>
      <input
        id={props.name}
        type="file"
        accept=".csv"
        hidden
        onChange={({ target }) => {
          formik.setFieldValue(props.name, target.files.item(0));
        }}
      />
      <span className="flex items-center space-x-4">
        <label
          htmlFor={props.name}
          className="text-sm py-2 px-4 bg-gray-200 rounded-sm cursor-pointer"
        >
          Escolher arquivo
        </label>
        {formik.values[props.name] && (
          <p className="text-neutral-500">{formik.values[props.name].name}</p>
        )}
      </span>
    </span>
  );
};

export default UploadFormField;
