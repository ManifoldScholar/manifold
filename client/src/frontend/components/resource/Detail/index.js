import PropTypes from "prop-types";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CommentContainer from "global/containers/comment";
import lh from "helpers/linkHandler";
import Meta from "../Meta";
import VariantList from "../VariantList";
import Annotations from "./Annotations";
import * as Styled from "./styles";
import Preview from "../Preview";

export default function ResourceDetail({ resource }) {
  const { t } = useTranslation();

  if (!resource) return null;

  const canEngagePublicly = resource?.attributes?.abilities?.engagePublicly;

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
                  i18nKey="placeholders.comments.unauthenticated_full"
                  components={[<Link to={lh.link("frontendLogin")} />]}
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
