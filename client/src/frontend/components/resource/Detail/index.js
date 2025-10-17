import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CommentContainer from "global/containers/comment";
import Meta from "../Meta";
import VariantList from "../VariantList";
import Annotations from "./Annotations";
import { uiVisibilityActions } from "actions";
import { useAuthentication } from "hooks";
import * as Styled from "./styles";
import Preview from "../Preview";

export default function ResourceDetail({ resource }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const authentication = useAuthentication();

  if (!resource) return null;

  const canEngagePublicly = resource?.attributes?.abilities?.engagePublicly;

  const onLoginClick = () =>
    dispatch(uiVisibilityActions.visibilityShow("signInUpOverlay"));

  return (
    <Styled.Container>
      <Styled.Grid>
        <Preview resource={resource} titleAs="h1" hideDetailLink enableZoom />
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
                  i18nKey={
                    authentication?.authenticated
                      ? "placeholders.comments.unverified"
                      : "placeholders.comments.unauthenticated_full"
                  }
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
          <Meta resource={resource} layout={"secondary"} />
          <VariantList resource={resource} />
        </Styled.MetadataWrapper>
      </Styled.Grid>
    </Styled.Container>
  );
}

ResourceDetail.displayName = "Resource.Detail";

ResourceDetail.propTypes = {
  resource: PropTypes.object
};
