import { useState } from "react";
import Utility from "frontend/components/utility";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import SourceSummary from "../SourceSummary/index";
import Authorize from "hoc/Authorize";
import FromNodes from "../TextContent/FromNodes";

export default function ResourceAnnotation({
  annotation,
  visitHandler,
  deleteHandler,
  displayFormat
}) {
  const { t } = useTranslation();

  const [hovering, setHovering] = useState(false);

  const wrapperClasses = classNames({
    "annotation-selection__text-container": true,
    "annotation-selection__text-container--light": true,
    "annotation-selection__text-container--hovering": hovering,
    "annotation-selection__text-container--rounded-corners":
      displayFormat === "fullPage"
  });

  return (
    <div className={wrapperClasses}>
      <div className="annotation-selection__container">
        <IconComposer
          icon="bookmark32"
          size="default"
          className="annotation-selection__icon"
        />
        <FromNodes
          annotation={annotation}
          selection={annotation.attributes.subject}
          overlayLight
        />
        <SourceSummary
          includeDate
          includeCreator
          annotation={annotation}
          onClick={visitHandler}
          onHover={setHovering}
        />
        <Authorize entity={annotation} ability={"delete"}>
          <div className="annotation-selection__action-buttons">
            <Utility.ConfirmableButton
              label={t("actions.delete")}
              confirmHandler={deleteHandler}
            />
          </div>
        </Authorize>
      </div>
    </div>
  );
}

ResourceAnnotation.displayName = "Annotation.ResourceAnnotation";

ResourceAnnotation.propTypes = {
  annotation: PropTypes.object.isRequired,
  visitHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired
};
