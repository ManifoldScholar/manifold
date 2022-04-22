import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Trans, withTranslation } from "react-i18next";
import debounce from "lodash/debounce";
import lh from "helpers/linkHandler";
import Collapse from "global/components/Collapse";
import Description from "./Description";
import ToggleText from "./Toggle";
import * as Styled from "./styles";

function ResourceListSlideCaption({
  resource,
  resourceCollection,
  hideDetailUrl = false,
  hideDownload = false,
  t
}) {
  const [isExpandable, setExpandable] = useState(false);
  const descriptRef = useRef();

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
      <Description
        content={content}
        ref={descriptRef}
        isExpandable={isExpandable}
      />
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
          <Trans i18nKey="messages.showing_resource">
            Showing {{ type: attr.type }} resource: {{ title: attr.title }}
          </Trans>
        </span>
      </header>
      <Collapse>
        {renderDescription()}
        <Styled.Utility $expandable={isExpandable}>
          <Styled.UtilityInner>
            {isExpandable && (
              <Styled.MoreLink>
                <ToggleText />
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
          </Styled.UtilityInner>
        </Styled.Utility>
      </Collapse>
    </Styled.Caption>
  );
}

ResourceListSlideCaption.displayName =
  "Components.Frontend.ResourceSlideCaption";

ResourceListSlideCaption.propTypes = {
  resource: PropTypes.object,
  resourceCollection: PropTypes.object,
  hideDetailUrl: PropTypes.bool,
  hideDownload: PropTypes.bool,
  t: PropTypes.func
};

export default withTranslation()(ResourceListSlideCaption);
