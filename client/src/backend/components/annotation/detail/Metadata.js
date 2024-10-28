import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import EntityThumbnail from "global/components/entity-thumbnail";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

export default function AnnotationMetadata({
  creator,
  createdAt,
  textTitle,
  readingGroupName
}) {
  const { t } = useTranslation();

  return (
    <>
      <Form.SectionLabel
        headingAs="h3"
        label={t("records.annotations.metadata_header")}
        id="annotation-metadata-header"
      />
      <dl>
        <Styled.Label>{t("common.date")}</Styled.Label>
        <Styled.Item>
          <FormattedDate format="MMMM dd, yyyy" date={createdAt} />
        </Styled.Item>
        <Styled.Label>{t("glossary.text_title_case_one")}</Styled.Label>
        <Styled.Item>
          <span
            dangerouslySetInnerHTML={{
              __html:
                textTitle ?? t("records.annotations.text_title_placeholder")
            }}
          />
        </Styled.Item>
        {readingGroupName && (
          <>
            <Styled.Label>{t("glossary.reading_group_one")}</Styled.Label>
            <Styled.Item>
              <span>{readingGroupName}</span>
            </Styled.Item>
          </>
        )}
        <Styled.Label>{t("glossary.creator_one")}</Styled.Label>
        <Styled.Item>
          {creator && (
            <Styled.Creator>
              <div className="entity-row__figure entity-row__figure--size-normal entity-row__figure--shape-round">
                <EntityThumbnail.User entity={creator} />
              </div>
              <Styled.CreatorName>
                <span>{creator.attributes?.fullName}</span>
                <span>
                  {t(`records.users.role_options.${creator.attributes.role}`)}
                </span>
              </Styled.CreatorName>
            </Styled.Creator>
          )}
        </Styled.Item>
      </dl>
    </>
  );
}

AnnotationMetadata.displayName = "Annotation.Detail.Metadata";

AnnotationMetadata.propTypes = {
  id: PropTypes.string.isRequired,
  creator: PropTypes.object,
  createdAt: PropTypes.string.isRequired,
  textSlug: PropTypes.string,
  textSectionId: PropTypes.string,
  textTitle: PropTypes.string
};
