import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import CommentContainer from "global/containers/comment";
import IconComposer from "global/components/utility/IconComposer";
import Hero from "../Hero";
import LinkComponent from "../Link";
import Meta from "../Meta";
import Title from "../Title";
import VariantList from "../VariantList";
import Share from "../Share";
import Utility from "global/components/utility";
import AnnotationList from "global/components/Annotation/List/Default";
import { useFetch, usePaginationState } from "hooks";
import { resourcesAPI } from "api";
import * as Styled from "./styles";
import * as StyledLink from "../Link/styles";

export default function ResourceDetail({ resource, projectTitle }) {
  const { t } = useTranslation();
  const { resourceId } = useParams();

  const [annotationsPagination, setAnnotationsPage] = usePaginationState(1, 5);

  const {
    data: annotations,
    meta: annotationsMeta,
    refresh: refreshAnnotations
  } = useFetch({
    request: [
      resourcesAPI.annotations,
      resourceId,
      undefined,
      annotationsPagination
    ],
    options: {
      requestKey: "RESOURCE_DETAIL_ANNOTATIONS",
      appends: "RESOURCE_DETAIL_ANNOTATIONS"
    }
  });

  const remainingAnnotations =
    annotationsMeta?.pagination?.totalCount -
    5 * annotationsMeta?.pagination?.currentPage;
  const nextAnnotationsCount =
    remainingAnnotations > 5 ? 5 : remainingAnnotations;

  const canEngagePublicly = resource?.attributes?.abilities?.engagePublicly;

  const [activeTab, setActiveTab] = useState(
    canEngagePublicly ? "comments" : "annotations"
  );

  if (!resource) return null;

  const attr = resource.attributes;

  const shareTitle = projectTitle
    ? `${attr.title} | ${projectTitle}`
    : attr.title;

  const hasListContent = canEngagePublicly || !!annotations?.length;
  const tabbed = canEngagePublicly && !!annotations?.length;
  const staticHeader = annotations?.length
    ? t("glossary.annotation_title_case_other")
    : t("glossary.comment_title_case_other");

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
        {hasListContent && (
          <Styled.CommentsWrapper>
            <Styled.Comments>
              {tabbed ? (
                <Styled.NotesNav $layout="grid" $count={2}>
                  <Styled.Button
                    $isActive={activeTab === "comments"}
                    as="div"
                    onClick={() => setActiveTab("comments")}
                  >
                    <Styled.ButtonText>
                      {t("glossary.comment_title_case_other")}
                    </Styled.ButtonText>
                  </Styled.Button>
                  <Styled.Button
                    $isActive={activeTab === "annotations"}
                    as="div"
                    onClick={() => setActiveTab("annotations")}
                  >
                    <Styled.ButtonText>
                      {t("glossary.annotation_title_case_other")}
                    </Styled.ButtonText>
                  </Styled.Button>
                </Styled.NotesNav>
              ) : (
                <Styled.ListHeader>{staticHeader}</Styled.ListHeader>
              )}
              {canEngagePublicly && activeTab === "comments" && (
                <>
                  <CommentContainer.Thread subject={resource} />
                  <CommentContainer.Editor
                    focus={false}
                    label={t("actions.add_comment_title_case")}
                    subject={resource}
                  />
                </>
              )}
              {activeTab === "annotations" && !!annotations?.length && (
                <>
                  <AnnotationList
                    annotations={annotations}
                    refresh={refreshAnnotations}
                  />
                  {!!annotationsMeta?.pagination?.nextPage && (
                    <button
                      className="comment-more"
                      onClick={() =>
                        setAnnotationsPage(
                          annotationsMeta?.pagination?.nextPage
                        )
                      }
                    >
                      {t("actions.see_next_annotation", {
                        count: nextAnnotationsCount
                      })}
                      <Utility.IconComposer
                        icon="disclosureDown16"
                        size={16}
                        className="comment-more__icon"
                      />
                    </button>
                  )}
                </>
              )}
            </Styled.Comments>
          </Styled.CommentsWrapper>
        )}
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
