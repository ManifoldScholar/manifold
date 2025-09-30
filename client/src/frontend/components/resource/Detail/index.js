import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CommentContainer from "global/containers/comment";
import IconComposer from "global/components/utility/IconComposer";
import Hero from "../Hero";
import LinkComponent from "../Link";
import Meta from "../Meta";
import Title from "../Title";
import VariantList from "../VariantList";
import Share from "../Share";
import Annotations from "./Annotations";
import { uiVisibilityActions } from "actions";
import * as Styled from "./styles";
import * as StyledLink from "../Link/styles";

export default function ResourceDetail({ resource, projectTitle }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  if (!resource) return null;

  const canEngagePublicly = resource?.attributes?.abilities?.engagePublicly;

  const attr = resource.attributes;

  const shareTitle = projectTitle
    ? `${attr.title} | ${projectTitle}`
    : attr.title;

  const onLoginClick = () =>
    dispatch(uiVisibilityActions.visibilityShow("signInUpOverlay"));

  return (
    <Styled.Container>
      <Styled.Grid>
        <Styled.Main>
          <Title resource={resource} showIcon={false} />
          <Hero resource={resource} />
          {(attr.captionFormatted || attr.descriptionFormatted) && (
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
          )}
        </Styled.Main>
        <Styled.CommentsWrapper>
          <Styled.CommentsSection>
            <Styled.ListHeader>
              {t("glossary.comment_title_case_other")}
            </Styled.ListHeader>
            {canEngagePublicly ? (
              <>
                <CommentContainer.Thread subject={resource} />
                <CommentContainer.Editor
                  focus={false}
                  label={t("actions.add_comment_title_case")}
                  subject={resource}
                />
              </>
            ) : (
              <Styled.EmptyMessage>
                <Trans
                  i18nKey="placeholders.comments.unauthenticated_full"
                  components={[
                    <Styled.LoginButton type="button" onClick={onLoginClick} />
                  ]}
                />
              </Styled.EmptyMessage>
            )}
          </Styled.CommentsSection>
          <Styled.CommentsSection>
            <Styled.ListHeader>
              {t("glossary.annotation_title_case_other")}
            </Styled.ListHeader>
            <Annotations />
          </Styled.CommentsSection>
        </Styled.CommentsWrapper>
        <Styled.MetadataWrapper>
          <Styled.CtaGroup>
            <LinkComponent attributes={attr} />
            {attr.transcriptUrl && attr.transcriptFileName && (
              <StyledLink.Link
                href={attr.transcriptUrl}
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
          </Styled.CtaGroup>
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
