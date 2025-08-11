import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function ResourceLink({ resource, buttonClass = "button-primary" }) {
  const { t } = useTranslation();

  const {
    kind,
    externalUrl,
    attachmentStyles,
    attachmentFilename,
    downloadable
  } = resource.attributes;

  if (kind === "link")
    return (
      <Styled.Link
        href={externalUrl}
        className={buttonClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="button-primary__text">
          {t("navigation.visit_page")}
        </span>
        <IconComposer
          icon="arrowRight16"
          size="default"
          className="button-primary__icon"
        />
      </Styled.Link>
    );

  return downloadable ? (
    <Styled.Link
      href={attachmentStyles.original}
      className={buttonClass}
      download={attachmentFilename}
    >
      <span className="button-primary__text">{t("actions.download")}</span>
      <IconComposer
        icon="arrowDown16"
        size="default"
        className="button-primary__icon"
      />
    </Styled.Link>
  ) : null;
}

ResourceLink.displayName = "Resource.Link";

ResourceLink.propTypes = {
  resource: PropTypes.object.isRequired,
  buttonClass: PropTypes.string
};

export default ResourceLink;
