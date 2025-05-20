import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CommentContainer from "global/containers/comment";
import IconComposer from "global/components/utility/IconComposer";
import Hero from "../Hero";
import LinkComponent from "../Link";
import Meta from "../Meta";
import Title from "../Title";
import VariantList from "../VariantList";
import Share from "../Share";
import { useSelector } from "react-redux";
import { meta } from "utils/entityUtils";
import * as Styled from "./styles";
import * as StyledLink from "../Link/styles";

export default function ResourceDetail({ resource, projectTitle }) {
  const { t } = useTranslation();
  const commentsMeta = useSelector(state =>
    meta(`comments-for-${resource.id}`, state.entityStore)
  );
  const showComments = !!commentsMeta?.pagination?.totalCount;

  if (!resource) return null;

  const canEngagePublicly = () => {
    return resource.attributes?.abilities?.engagePublicly;
  };

  const attr = resource.attributes;

  const shareTitle = projectTitle
    ? `${attr.title} | ${projectTitle}`
    : attr.title;

  return (
    <Styled.Container>
      <Styled.Grid>
        <Styled.Main>
          <Title resource={resource} showIcon={false} />
          <Hero resource={resource} />
          <Styled.Content>
            <Styled.Caption
              dangerouslySetInnerHTML={{ __html: attr.captionFormatted }}
            />

            {!!attr.descriptionFormatted && (
              <>
                <Styled.DescriptionHeader>
                  {t("pages.subheaders.full_description")}
                </Styled.DescriptionHeader>
                <div
                  dangerouslySetInnerHTML={{
                    __html: attr.descriptionFormatted
                  }}
                />
              </>
            )}
          </Styled.Content>
        </Styled.Main>
        {canEngagePublicly && (
          <Styled.CommentsWrapper>
            {/* This can't be conditionally rendered because the comment fetch happens in CommentContainer. */}
            <Styled.Comments $show={showComments}>
              <CommentContainer.Thread subject={resource} />
            </Styled.Comments>
            <CommentContainer.Editor
              focus={false}
              label={t("actions.add_comment_title_case")}
              subject={resource}
            />
          </Styled.CommentsWrapper>
        )}
        <Styled.MetadataWrapper>
          <LinkComponent attributes={attr} />
          {attr.downloadable && attr.transcriptFileName && (
            <StyledLink.Link
              href={attr.attachmentStyles.original}
              className="button-primary"
              download={attr.transcriptFileName}
            >
              <span className="button-primary__text" aria-hidden>
                {t("resources.new.transcript")}
              </span>
              <IconComposer
                icon="arrowDown16"
                size="default"
                className="button-primary__icon"
              />
            </StyledLink.Link>
          )}
          <Share title={shareTitle} />
          <Meta resource={resource} layout={"secondary"} />
          <VariantList resource={resource} />
        </Styled.MetadataWrapper>
      </Styled.Grid>
    </Styled.Container>
  );
}

ResourceDetail.displayName = "Resource.Detail";

ResourceDetail.propTypes = {
  resource: PropTypes.object,
  projectTitle: PropTypes.string
};
