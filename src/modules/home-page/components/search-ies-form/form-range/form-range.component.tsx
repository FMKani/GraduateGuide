import * as React from "react";
import { Range } from "react-range";

interface IThumbProps {
  key: number;
  style: React.CSSProperties;
  tabIndex?: number;
  "aria-valuemax": number;
  "aria-valuemin": number;
  "aria-valuenow": number;
  draggable: boolean;
  ref: React.RefObject<any>;
  role: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onKeyUp: (e: React.KeyboardEvent) => void;
}

interface IRenderThumbParams {
  props: IThumbProps;
  value: number;
  index: number;
  isDragged: boolean;
}

const RangeThumb = ({ props }: IRenderThumbParams): React.ReactNode => {
  return (
    <div {...props} className="w-4 h-4 bg-primary rounded-full outline-none" />
  );
};

// --------------------------------------------------------------------------------------------------------------------------

interface ITrackProps {
  style: React.CSSProperties;
  ref: React.RefObject<any>;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

interface IRenderTrackParams {
  props: ITrackProps;
  children: React.ReactNode;
  isDragged: boolean;
  disabled: boolean;
}

const RangeTrack = ({
  props,
  children
}: IRenderTrackParams): React.ReactNode => {
  return (
    <div
      {...props}
      className="w-full h-1 bg-primary bg-opacity-25 rounded-full"
    >
      <span className="select-none pointer-events-none left-0 right-0 absolute flex items-center justify-between transform-gpu -translate-y-[1px]">
        {new Array(8).fill("").map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        ))}
      </span>

      {children}

      <span className="left-0 right-0 flex items-center justify-between py-3 pointer-events-none select-none">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((n, i) => (
          <p className="text-sm text-gray-500" key={i}>
            {n}
          </p>
        ))}
      </span>
    </div>
  );
};

// --------------------------------------------------------------------------------------------------------------------------

export interface FormRangeProps {
  title: string;
  values: [number, number];
  onChange?: (v: [number, number]) => void;
}

const FormRange: React.VFC<FormRangeProps> = (props) => {
  return (
    <section className="pb-8">
      <label className="text-sm text-gray-500 mb-4 block">{props.title}</label>
      <Range
        min={0}
        max={7}
        step={1}
        onChange={props.onChange}
        values={props.values}
        renderThumb={RangeThumb}
        renderTrack={RangeTrack}
      />
    </section>
  );
};

export default FormRange;
