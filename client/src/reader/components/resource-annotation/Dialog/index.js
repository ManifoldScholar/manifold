import Header from "./Header";
import { useTranslation } from "react-i18next";
import { useFromStore } from "hooks";
import { useParams } from "react-router-dom";
import * as Styled from "./styles";

export default function ResourceAnnotationDialog({ children, ...dialog }) {
  const { t } = useTranslation();
  const { sectionId } = useParams();
  const section = useFromStore(
    `entityStore.entities.textSections.${sectionId}`
  );
  const textTitle =
    section?.attributes.textTitle ?? t("glossary.text_title_case_one");

  return (
    <Styled.Dialog ref={dialog.dialogRef} inert={!dialog.open ? "" : undefined}>
      <Header onClose={dialog.onCloseClick} textTitle={textTitle} />
      <div>{children}</div>
    </Styled.Dialog>
  );
}
