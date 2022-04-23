import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CommentContainer from "global/containers/comment";
import Utility from "frontend/components/utility";
import Hero from "../Hero";
import LinkComponent from "../Link";
import Meta from "../Meta";
import Title from "../Title";
import VariantList from "../VariantList";
import { useSelector } from "react-redux";
import { meta } from "utils/entityUtils";
import * as Styled from "./styles";

export default function ResourceDetail({ resourceUrl, resource }) {
  const { t } = useTranslation();
  const commentsMeta = useSelector(state =>
    meta(`comments-for-${resource.id}`, state.entityStore)
  );
  const showComments = !!commentsMeta?.pagination?.totalCount;

  if (!resource) return null;

  const createDescription = description => {
    if (!description) return { __html: t("errors.no_content") };
    return {
      __html: description
    };
  };

  const canEngagePublicly = () => {
    return resource.attributes?.abilities?.engagePublicly;
  };

  const attr = resource.attributes;

  return (
    <Styled.Container>
      <Styled.ColumnWrapper>
        <Styled.Left>
          <Title resource={resource} showIcon={false} />
          <Hero resource={resource} />
          <Styled.Content>
            <Styled.Caption
              dangerouslySetInnerHTML={{ __html: attr.captionFormatted }}
            />

            <Styled.DescriptionHeader>
              {t("pages.subheaders.full_description")}
            </Styled.DescriptionHeader>
            <div
              dangerouslySetInnerHTML={createDescription(
                attr.descriptionFormatted
              )}
            />
          </Styled.Content>
        </Styled.Left>
        <Styled.Right>
          <LinkComponent attributes={attr} />
          <Utility.ShareBar url={resourceUrl} />
          <Meta resource={resource} layout={"secondary"} />
          <VariantList resource={resource} />
        </Styled.Right>
      </Styled.ColumnWrapper>
      {canEngagePublicly && (
        <>
          {/* This can't be conditionally rendered because the comment fetch happens in CommentContainer. */}
          <Styled.Comments $show={showComments}>
            <CommentContainer.Thread subject={resource} />
          </Styled.Comments>
          <CommentContainer.Editor
            focus={false}
            label={t("actions.add_comment_title_case")}
            subject={resource}
          />
        </>
      )}
    </Styled.Container>
  );
}

ResourceDetail.displayName = "Resource.Detail";

ResourceDetail.propTypes = {
  projectUrl: PropTypes.string,
  resourceUrl: PropTypes.string.isRequired,
  resource: PropTypes.object
};
