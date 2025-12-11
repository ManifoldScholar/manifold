import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function ResourceDescription({ resource, captionOnly = false, className }) {
  const { t } = useTranslation();

  const { captionFormatted, descriptionFormatted } = resource.attributes;

  if (captionOnly && !captionFormatted) return null;
  if (!captionFormatted || !descriptionFormatted) return null;

  return (
    <Styled.Content className={className}>
      {!!captionFormatted && (
        <div dangerouslySetInnerHTML={{ __html: captionFormatted }} />
      )}
      {!captionOnly && !!descriptionFormatted && (
        <>
          <Styled.DescriptionHeader>
            {t("pages.subheaders.full_description")}
          </Styled.DescriptionHeader>
          <div
            dangerouslySetInnerHTML={{
              __html: descriptionFormatted
            }}
          />
        </>
      )}
    </Styled.Content>
  );
}

ResourceDescription.displayName = "Resource.Description";

ResourceDescription.propTypes = {
  resource: PropTypes.object.isRequired,
  captionOnly: PropTypes.bool,
  className: PropTypes.string
};

export default ResourceDescription;
