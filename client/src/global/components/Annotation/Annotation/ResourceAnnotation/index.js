import { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import TextTitle from "../SourceSummary/TextTitle";
import Authorize from "hoc/Authorize";
import FromNodes from "../TextContent/FromNodes";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import withConfirmation from "hoc/withConfirmation";
import * as Styled from "./styles";

function ResourceAnnotation({
  annotation,
  deleteHandler,
  displayFormat,
  confirm
}) {
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

  const wrapperClasses = classNames({
    "annotation-selection__text-container": true,
    "annotation-selection__text-container--light": true,
    "annotation-selection__text-container--link": true,
    "annotation-selection__text-container--rounded-corners":
      displayFormat === "fullPage"
  });

  const {
    textSlug,
    textSectionId,
    textTitleFormatted,
    textSectionTitle
  } = annotation.attributes;

  return (
    <Link
      to={lh.link(
        "readerSection",
        textSlug,
        textSectionId,
        `#annotation-${annotation.id}`
      )}
      className={wrapperClasses}
    >
      <div className="annotation-selection__container">
        <IconComposer
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
            >
              {t("actions.remove")}
            </Styled.Delete>
          </Styled.ButtonWrapper>
        </Authorize>
      </div>
    </Link>
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
