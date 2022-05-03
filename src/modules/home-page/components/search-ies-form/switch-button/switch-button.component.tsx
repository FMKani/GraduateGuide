import * as React from "react";

export interface SwitchButtonProps {
  checked: boolean;
  onChange?: (v: boolean) => void;
}

const SwitchButton: React.VFC<SwitchButtonProps> = (props) => {
  return (
    <span>
      <input
        hidden
        type="checkbox"
        defaultChecked={props.checked}
        onChange={({ target }) =>
          props.onChange && props.onChange(target.checked)
        }
      />
      <span
        className={`transition-colors ${
          props.checked ? "bg-primary" : "bg-gray-400"
        } relative w-6 h-3 flex items-center rounded-full`}
      >
        <div
          className={`rounded-full border-2 ${
            props.checked ? "border-primary" : "border-gray-400"
          } bg-white h-5 w-5 transition-transform transform-gpu ${
            props.checked ? "translate-x-2.5" : "-translate-x-2.5"
          } `}
        />
      </span>
    </span>
  );
};

export default SwitchButton;
