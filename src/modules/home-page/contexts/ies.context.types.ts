import { Course } from "@common/types";
import { Ies } from "@prisma/client";

interface IESContextHelpers {
  setIESs(v: Ies[]): void;
  setIES(v: Ies): void;
  courseDispatch(v: Partial<CourseReducerState>): void;
  productionsDispatch(v: Partial<ProductionsReducerState>): void;
  setComparing(
    c: {
      course: Course;
      ies: Ies;
    }[]
  ): void;
}

interface IESContextValue {
  course: CourseReducerState;
  productions: ProductionsReducerState;
  IESs: Ies[];
  IES: Ies;
  comparing: {
    course: Course;
    ies: Ies;
  }[];
}

export interface ProductionsReducerState {
  filters?: {
    nm_area_concentracao?: string;
  };
}

export interface CourseReducerState {
  filters?: {
    onlyBolsas?: boolean;
    rateRange?: [number, number];
    course_category?: string;
    course_type?: string;
    order_by?:
      | "nm_programa_ies:asc"
      | "qt_bolsas_concedidas:desc"
      | "cd_conceito_programa:desc";
  };
  selected?: Course;
}

export type IESsContextProps = [IESContextValue, IESContextHelpers];
