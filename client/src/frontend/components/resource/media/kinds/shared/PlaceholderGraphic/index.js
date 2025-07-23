import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function ResourceMediaPlaceholderGraphic({ resource, isCollection, loading }) {
  const { t } = useTranslation();

  const src = "/static/images/resource-splash.jpg";

  return (
    <Styled.Wrapper aria-hidden="true" className="bg-neutral90">
      <Styled.Image src={src} width={800} height={450} alt="" loading="lazy" />
      <Styled.Inner>
        {isCollection ? (
          <>
            <Styled.CollectionIcon size={120} icon="resourceCollection64" />
            <Styled.Kind>
              {t("glossary.resource_collection_title_case_one")}
            </Styled.Kind>
          </>
        ) : (
          <>
            <Styled.ResourceIcon
              size={120}
              icon={loading ? "image" : resource.attributes.kind}
            />
            <Styled.Kind>
              {loading ? t("common.loading") : resource.attributes.kind}
            </Styled.Kind>
          </>
        )}
      </Styled.Inner>
    </Styled.Wrapper>
  );
}

ResourceMediaPlaceholderGraphic.displayName =
  "Resource.Media.PlaceholderGraphic";

ResourceMediaPlaceholderGraphic.propTypes = {
  resource: PropTypes.object,
  isCollection: PropTypes.bool,
  loading: PropTypes.bool,
  fixedAspectRatio: PropTypes.bool
};

export default ResourceMediaPlaceholderGraphic;
