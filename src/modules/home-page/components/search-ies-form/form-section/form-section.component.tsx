import * as React from "react";
// import { useFormSection } from "./form-section.hook";

export interface FormSectionProps {
  title: string;
  icon: React.FC<any>;
}

const FormSection: React.FC<FormSectionProps> = (props) => {
  // const {} = useFormSection();
  const Icon = React.useMemo(() => props.icon, [props.icon]);

  return (
    <section className="space-y-6">
      <span className="flex items-center space-x-2 text-primary">
        <Icon className="w-6 h-6" />
        <p className="font-semibold">{props.title}</p>
      </span>

      {props.children && (
        <span className="block space-y-4">{props.children}</span>
      )}
    </section>
  );
};

export default FormSection;
