import { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import TextTitle from "../SourceSummary/TextTitle";
import Authorize from "hoc/Authorize";
import FromNodes from "../TextContent/FromNodes";
import lh from "helpers/linkHandler";
import withConfirmation from "hoc/withConfirmation";
import * as Styled from "./styles";

function ResourceAnnotation({ annotation, deleteHandler, confirm, compact }) {
  const { t } = useTranslation();

  const onDelete = useCallback(
    e => {
      e.preventDefault();

      const heading = t("modals.delete_note");
      const message = t("modals.delete_note_body");
      if (confirm)
        confirm(heading, message, async () => {
          await deleteHandler;
        });
    },
    [deleteHandler, confirm, t]
  );

  const {
    textSlug,
    textSectionId,
    textTitleFormatted,
    textSectionTitle
  } = annotation.attributes;

  return (
    <Styled.ResourceLink
      to={lh.link(
        "readerSection",
        textSlug,
        textSectionId,
        `#annotation-${annotation.id}`
      )}
      $compact={compact}
    >
      <Styled.Container $compact={compact}>
        <Styled.Icon
          icon="bookmark32"
          size="default"
          className="annotation-selection__icon"
        />
        <FromNodes
          annotation={annotation}
          selection={annotation.attributes.subject}
          expandable={false}
        />
        <div className="annotation-selection__source-summary annotation-selection__source-summary-link">
          <span className="annotation-selection__source-summary-text">
            <Trans
              i18nKey="messages.annotation_summary.source"
              components={{
                text: <TextTitle title={textTitleFormatted} />
              }}
              values={{ section: textSectionTitle }}
            />
          </span>
          <IconComposer
            icon="arrowLongRight16"
            size={24}
            className="annotation-selection__arrow-icon"
          />
        </div>
        <Authorize entity={annotation} ability={"delete"}>
          <Styled.ButtonWrapper>
            <Styled.Delete
              className="button-secondary button-secondary--dull button-secondary--red button-secondary--sm"
              onClick={onDelete}
              $compact={compact}
            >
              {t("actions.remove")}
            </Styled.Delete>
          </Styled.ButtonWrapper>
        </Authorize>
      </Styled.Container>
    </Styled.ResourceLink>
  );
}

export default withConfirmation(ResourceAnnotation);

ResourceAnnotation.displayName = "Annotation.ResourceAnnotation";

ResourceAnnotation.propTypes = {
  annotation: PropTypes.object.isRequired,
  visitHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired
};
