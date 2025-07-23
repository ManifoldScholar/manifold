import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Button, { stylePropTypes } from "global/components/atomic/Button";
import * as Styled from "./styles";

function ResourceLink({ resource, ...styleProps }) {
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
      <Styled.ExternalLink
        as="a"
        label={t("navigation.visit_page")}
        href={externalUrl}
        target="_blank"
        rel="noreferrer"
        preIcon={styleProps.size === "sm" ? "arrowRight24" : "arrowRight32"}
        {...styleProps}
      />
    );

  return downloadable ? (
    <Button
      as="a"
      label={t("actions.download")}
      href={attachmentStyles.original}
      download={attachmentFilename}
      preIcon={styleProps.size === "sm" ? "download24" : "arrowDown32"}
      {...styleProps}
    />
  ) : null;
}

ResourceLink.displayName = "Resource.Link";

ResourceLink.propTypes = {
  resource: PropTypes.object.isRequired,
  ...stylePropTypes
};

export default ResourceLink;
