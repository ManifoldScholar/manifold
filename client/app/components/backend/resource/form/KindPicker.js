import { useId } from "react";
import { useTranslation } from "react-i18next";
import { useFormField } from "hooks";
import IconComputed from "global/components/icon-computed";
import Form from "global/components/form";
import FormSelect from "global/components/form/Select/index";
import * as Styled from "./styles";

const KIND_LIST = [
  "Image",
  "Video",
  "Audio",
  "File",
  "Link",
  "PDF",
  "Document",
  "Spreadsheet",
  "Presentation",
  "Interactive"
];

export default function KindPicker({ name, includeButtons }) {
  const { t } = useTranslation();
  const { value: kindValue, set } = useFormField(name);
  const id = useId();

  const renderSelect = () => {
    return (
      <Styled.SelectWrapper $only={!includeButtons}>
        <Form.Label id={id} label={t("resources.new.kind")} />
        <FormSelect
          onChange={event => {
            set(event.target.value);
          }}
          value={kindValue?.toLowerCase()}
          options={KIND_LIST.map(kind => {
            const safeKind = kind.toLowerCase();
            const translatedKind = t(`resources.new.${safeKind}`);
            return {
              value: safeKind,
              label: translatedKind,
              key: safeKind
            };
          })}
        />
      </Styled.SelectWrapper>
    );
  };

  const renderRadios = () => {
    return (
      <Styled.List role="group" aria-label={t("resources.new.resource_kind")}>
        {KIND_LIST.map(kind => {
          const safeKind = kind.toLowerCase();
          const translatedKind = t(`resources.new.${safeKind}`);
          const isActive = safeKind === kindValue;

          return (
            <Styled.Item
              key={safeKind}
              htmlFor={`${id}-${safeKind}`}
              $active={isActive}
            >
              <Styled.Input
                type="radio"
                value={safeKind}
                id={`${id}-${safeKind}`}
                name={id}
                checked={isActive}
                onChange={() => set(safeKind)}
              />
              <Styled.Label>{translatedKind}</Styled.Label>
              <IconComputed.Resource size="default" icon={safeKind} />
            </Styled.Item>
          );
        })}
      </Styled.List>
    );
  };

  return (
    <Styled.KindPicker className="form-secondary">
      <Form.FieldWrapper>
        {renderSelect()}
        {includeButtons ? renderRadios() : null}
      </Form.FieldWrapper>
    </Styled.KindPicker>
  );
}
