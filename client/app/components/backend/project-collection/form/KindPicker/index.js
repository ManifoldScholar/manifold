import { useTranslation } from "react-i18next";
import Utility from "components/frontend/utility";
import { useFormField } from "hooks";
import * as Styled from "./styles";

export default function KindPicker() {
  const { t } = useTranslation();
  const { value: isSmart, set } = useFormField("attributes[smart]");

  const handleSmartClick = () => set(!isSmart);

  const selected = isSmart
    ? t("project_collections.smart")
    : t("project_collections.manual");

  return (
    <Styled.Wrapper>
      <span className="screen-reader-text">
        {t("project_collections.collection_kind_instructions")}
      </span>
      <Utility.Toggle
        handleToggle={handleSmartClick}
        selected={selected}
        label="kind"
        optionOne={{
          label: t("project_collections.manual"),
          icon: "BECollectionManual64"
        }}
        optionTwo={{
          label: t("project_collections.smart"),
          icon: "BECollectionSmart64"
        }}
      />
    </Styled.Wrapper>
  );
}

KindPicker.displayName = "ProjectCollection.Form.KindPicker";
