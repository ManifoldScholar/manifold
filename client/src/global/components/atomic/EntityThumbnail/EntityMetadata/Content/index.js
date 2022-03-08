import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function EntityMetadata(props) {
  const {
    title,
    draft,
    bumpDraftDown,
    subtitle,
    additionalData,
    date,
    prefix,
    recentlyUpdated,
    description,
    stack
  } = props;

  const { t } = useTranslation();

  return (
    <Styled.MetadataWrapper $stack={stack}>
      <Styled.TitleWrapper $stack={stack}>
        <Styled.TitleText
          $stack={stack}
          dangerouslySetInnerHTML={{
            __html: title
          }}
        />
        {draft && !bumpDraftDown && (
          <Styled.Tag $stack={stack}>{t("glossary.draft_one")}</Styled.Tag>
        )}
      </Styled.TitleWrapper>
      {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
      {additionalData && (
        <Styled.Creators>
          <span>{additionalData}</span>
        </Styled.Creators>
      )}
      {draft && bumpDraftDown && (
        <Styled.Tag $stack={stack}>{t("glossary.draft_one")}</Styled.Tag>
      )}
      {date && (
        <Styled.Date $recentlyUpdated={recentlyUpdated}>
          <FormattedDate prefix={prefix} format="MMMM, yyyy" date={date} />
        </Styled.Date>
      )}
      {description && <Styled.Description>{description}</Styled.Description>}
    </Styled.MetadataWrapper>
  );
}

EntityMetadata.displayName = "Global.Atomic.EntityThumbnail.Metadata";

EntityMetadata.propTypes = {
  entity: PropTypes.object,
  hideDescription: PropTypes.bool,
  hideDate: PropTypes.bool,
  stack: PropTypes.bool
};
