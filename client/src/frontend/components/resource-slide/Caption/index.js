import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function ResourceListSlideCaption({
  resource,
  resourceCollection,
  hideDetailUrl = false,
  hideDownload = false
}) {
  const [isExpandable, setExpandable] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const descriptRef = useRef();
  const { t } = useTranslation();

  const canExpand = () => {
    if (!descriptRef.current) return setExpandable(false);
    return setExpandable(descriptRef.current.scrollHeight > 48);
  };

  useEffect(() => {
    canExpand();
    const debouncedExpand = debounce(canExpand, 120);
    window.addEventListener("resize", debouncedExpand);
    return () => window.removeEventListener("resize", debouncedExpand);
  }, [resource]);

  if (!resource) return null;

  const canDownload = hideDownload ? false : resource?.attributes?.downloadable;

  const detailUrl = () => {
    if (resourceCollection) {
      return lh.link(
        "frontendProjectCollectionResource",
        resource.attributes.projectSlug,
        resourceCollection.attributes.slug,
        resource.attributes.slug
      );
    }
    return lh.link(
      "frontendProjectResource",
      resource.attributes.projectSlug,
      resource.attributes.slug
    );
  };

  const renderDescription = () => {
    if (!resource.attributes.captionFormatted) return null;
    const content = {
      __html: resource.attributes.captionFormatted
    };

    return (
      <Styled.DescriptionWrapper
        $expandable={isExpandable}
        $expanded={expanded}
      >
        <Styled.Description
          dangerouslySetInnerHTML={content}
          $expanded={expanded}
          $maxHeight={descriptRef.current?.scrollHeight ?? 300}
          ref={descriptRef}
        />
      </Styled.DescriptionWrapper>
    );
  };

  const attr = resource.attributes;

  return (
    <Styled.Caption>
      <header>
        <Styled.Title
          dangerouslySetInnerHTML={{
            __html: attr.titleFormatted
          }}
        />
        <span className="screen-reader-text" role="alert">
          <Trans
            i18nKey="messages.showing_resource"
            values={{ type: attr.kind, title: attr.title }}
          />
        </span>
      </header>
      <div>
        {renderDescription()}
        <Styled.Utility $expanded={expanded}>
          {isExpandable && (
            <Styled.MoreLink aria-hidden onClick={() => setExpanded(!expanded)}>
              <span>
                {expanded
                  ? t("actions.hide_description")
                  : t("actions.read_more")}
              </span>
            </Styled.MoreLink>
          )}
          {canDownload ? (
            <Styled.DownloadLink
              href={attr.attachmentStyles.original}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{t("actions.download")}</span>
              <Styled.DownloadIcon icon="arrowDown16" size="default" />
            </Styled.DownloadLink>
          ) : null}
          {detailUrl && !hideDetailUrl ? (
            <Styled.DetailLink to={detailUrl}>
              {t("actions.view_resource")}
            </Styled.DetailLink>
          ) : null}
        </Styled.Utility>
      </div>
    </Styled.Caption>
  );
}

ResourceListSlideCaption.displayName =
  "Components.Frontend.ResourceSlideCaption";

ResourceListSlideCaption.propTypes = {
  resource: PropTypes.object,
  resourceCollection: PropTypes.object,
  hideDetailUrl: PropTypes.bool,
  hideDownload: PropTypes.bool
};
