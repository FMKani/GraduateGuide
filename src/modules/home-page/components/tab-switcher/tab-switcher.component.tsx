import * as React from "react";
import { useTabSwitcher } from "./tab-switcher.hook";

interface ButtonProps {
  text: string;
  selected?: boolean;
  onClick?: () => void;
}

const Button: React.VFC<ButtonProps> = (props) => {
  return (
    <span className="relative flex-1">
      <button
        onClick={props.onClick}
        type="button"
        className={`w-full py-3 font-medium text-sm hover:bg-primary hover:bg-opacity-[0.15] hover:text-primary ${
          props.selected ? "text-primary" : undefined
        }`}
      >
        {props.text}
      </button>
      {props.selected && (
        <div className="absolute left-0 right-0 h-0.5 bg-primary" />
      )}
    </span>
  );
};

// -----------------------------------------------------------------------------------------------

export interface TabSwitcherProps {
  tabs: string[];
  onChange?: (n: number) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = (props) => {
  const { tab, changeTab } = useTabSwitcher();
  const onChangeRef = React.useRef(props.onChange);

  React.useEffect(() => onChangeRef.current && onChangeRef.current(tab), [tab]);

  return (
    <span className="flex items-center border-t border-b divide-x">
      {props.tabs.map((title, i) => (
        <Button
          key={i}
          onClick={changeTab(i)}
          text={title}
          selected={tab === i}
        />
      ))}
      {/* <Button onClick={changeTab(0)} text="Detalhes" selected={tab === 0} />
      <Button onClick={changeTab(1)} text="Cursos" selected={tab === 1} /> */}
    </span>
  );
};

export default TabSwitcher;
