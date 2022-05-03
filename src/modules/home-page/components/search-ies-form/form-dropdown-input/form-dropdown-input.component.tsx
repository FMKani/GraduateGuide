import * as React from "react";
import { useFormDropdownInput } from "./form-dropdown-input.hook";
import { AsyncPaginate } from "react-select-async-paginate";
import { Option } from "../search-ies-form.hook";
import Select from "react-select";

type PaginatedOptions = {
  options: Option[];
  hasMore?: boolean;
  additional?: { cursor?: string };
};

export type AsyncLoadOptions = (
  search: string,
  options: Option[],
  props: { cursor?: string }
) => Promise<PaginatedOptions> | PaginatedOptions;

export interface FormDropdownInputProps {
  label: string;
  value: Option;
  options?: Option[];
  styles?: any;
  loadOptions?: AsyncLoadOptions;
  // options: { label: string; value: string }[];
  // isLoading?: boolean;
  // loadOptions: () => Promise<PaginatedOptions> | PaginatedOptions;
  onChange?: (newValue: { label: string; value: string }) => void;
}

const FormDropdownInput: React.FC<FormDropdownInputProps> = (props) => {
  const { commonProps } = useFormDropdownInput(props);

  return (
    <section>
      <label className="text-sm text-gray-500 mb-2 block">{props.label}</label>

      {props.options && <Select {...commonProps} options={props.options} />}

      {props.loadOptions && (
        <AsyncPaginate
          {...commonProps}
          loadOptions={props.loadOptions}
          cacheUniqs={[props.loadOptions]}
          styles={props.styles}
        />
      )}
    </section>
  );
};

export default FormDropdownInput;
