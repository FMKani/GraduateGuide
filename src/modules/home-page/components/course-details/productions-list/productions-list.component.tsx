import * as React from "react";
import { useProductionsList } from "./productions-list.hook";
import { ptBRcapitalize } from "@common/utils/etc";

// export interface ProductionsListProps {}

// const ProductionsList: React.FC<ProductionsListProps> = (props) => {
const ProductionsList: React.FC = () => {
  const { productions, page, totalCount, handleScroll } = useProductionsList();

  return (
    <section className="flex flex-col overflow-y-auto">
      <h4 className="text-sm uppercase text-gray-500 px-6 pt-6 pb-4">
        0 - {Math.min(page * 50 + 50, totalCount)} de {totalCount}
      </h4>

      <section onScroll={handleScroll} className="divide-y overflow-y-auto">
        {productions.map((p, k) => (
          <div key={k} className="p-6 space-y-4">
            <span className="block">
              <h4 className="text-xs uppercase mb-2 tracking-wider font-medium text-gray-500">
                {p.nm_area_concentracao}
              </h4>
              <h3 className="font-semibold leading-relaxed">
                {ptBRcapitalize(p.nm_producao)}
              </h3>
            </span>

            <h4 className="text-primary">Publicado {p.an_base}</h4>
          </div>
        ))}
      </section>
    </section>
  );
};

export default ProductionsList;
