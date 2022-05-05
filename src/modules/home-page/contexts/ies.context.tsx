import * as React from "react";
import {
  IESsContextProps,
  CourseReducerState,
  ProductionsReducerState
} from "./ies.context.types";
import { Course } from "@common/types";
import { Ies } from "@prisma/client";

const IESContext = React.createContext<IESsContextProps>([] as never);

const courseReducer: React.Reducer<
  CourseReducerState,
  Partial<CourseReducerState>
> = (state, action) => ({
  ...state,
  ...action,
  filters: { ...state.filters, ...action.filters }
});

const productionsReducer: React.Reducer<
  ProductionsReducerState,
  Partial<ProductionsReducerState>
> = (state, action) => ({
  ...state,
  ...action,
  filters: { ...state.filters, ...action.filters }
});
export const useIES = () => React.useContext(IESContext);

export const IESProvider: React.FC = (props) => {
  const [IESs, setIESs] = React.useState<Ies[]>([]);
  const [IES, setIES] = React.useState<Ies | null>(null);
  const [comparing, setComparing] = React.useState<
    { course: Course; ies: Ies }[]
  >([]);

  const [counter, setCounter] = React.useState<number>();

  const [courseState, courseDispatch] = React.useReducer(courseReducer, {
    filters: {
      rateRange: [0, 7],
      order_by: "nm_programa_ies:asc",
      onlyBolsas: false
    }
  });

  const [productionsState, productionsDispatch] = React.useReducer(
    productionsReducer,
    { filters: {} }
  );

  const value = React.useMemo<IESsContextProps>(
    () => [
      {
        IES,
        IESs,
        counter,
        course: courseState,
        productions: productionsState,
        comparing
      },
      {
        setIES,
        setIESs,
        courseDispatch,
        setComparing,
        productionsDispatch,
        setCounter
      }
    ],
    [IES, IESs, courseState, comparing, productionsState, counter, setCounter]
  );

  return (
    <IESContext.Provider value={value}>{props.children}</IESContext.Provider>
  );
};
