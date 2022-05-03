import * as React from "react";
import { defaultTheme, ThemeConfig } from "react-select";
import colors from "@common/utils/colors";
import { FormDropdownInputProps } from "./form-dropdown-input.component";

export function useFormDropdownInput(props: FormDropdownInputProps) {
  const defaultValue = React.useMemo(
    () => ({ label: "any", value: "any" }),
    []
  );

  const theme = React.useMemo<ThemeConfig>(
    () => ({
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        primary: colors.primary,
        primary75: `${colors.primary}75`,
        primary50: `${colors.primary}50`,
        primary25: `${colors.primary}25`
      }
    }),
    []
  );

  const commonProps = React.useMemo(
    () => ({
      defaultValue,
      onChange: props.onChange,
      placeholder: "Selecione...",
      value: props.value,
      theme
    }),
    [props.onChange, props.value, theme, defaultValue]
  );

  return {
    commonProps,
    defaultValue,
    theme
  };
}
