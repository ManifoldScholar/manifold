import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Title from "frontend/components/resource/Title";
import Badge from "frontend/components/resource/Badge";
import Description from "frontend/components/resource/Description";
import UserActions from "frontend/components/resource/Preview/UserActions";
import PageIcon from "./PageIcon";
import * as Styled from "./styles";

export default function Footer({
  resource,
  resourceCollection,
  position,
  resourceCount,
  totalCount,
  loaded,
  handleSlidePrev,
  handleSlideNext
}) {
  const { t } = useTranslation();

  return (
    <Styled.Footer>
      {loaded && (
        <Badge
          kind={resource.attributes.kind}
          position={position}
          count={totalCount}
        />
      )}
      {resourceCount > 0 && (
        <>
          <Styled.Pagination>
            <Styled.PageButton
              onClick={handleSlidePrev}
              aria-disabled={position === 1}
            >
              <PageIcon />
              <span className="screen-reader-text">
                {t("pagination.previous_slide")}
              </span>
            </Styled.PageButton>
            <Styled.PageButton
              onClick={handleSlideNext}
              aria-disabled={position === totalCount}
              data-direction="right"
            >
              <PageIcon />
              <span className="screen-reader-text">
                {t("pagination.next_slide")}
              </span>
            </Styled.PageButton>
          </Styled.Pagination>
        </>
      )}
      {loaded ? (
        <>
          <Styled.Meta>
            <Title resource={resource} titleAs="h3" hideBadge />
            <Description
              resource={resource}
              captionOnly
              className="resource-preview-description"
            />
          </Styled.Meta>
          <Styled.Actions>
            <UserActions
              resource={resource}
              resourceCollection={resourceCollection}
            />
          </Styled.Actions>
        </>
      ) : (
        <></>
      )}
    </Styled.Footer>
  );
}

Footer.displayName = "ResourceSlideshow.Footer";

Footer.propTypes = {
  resource: PropTypes.object,
  resourceCollection: PropTypes.object,
  position: PropTypes.number,
  resourceCount: PropTypes.number,
  totalCount: PropTypes.number,
  loaded: PropTypes.bool,
  handleSlidePrev: PropTypes.func,
  handleSlideNext: PropTypes.func
};
