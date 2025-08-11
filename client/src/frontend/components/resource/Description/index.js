import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function ResourceDescription({ resource }) {
  const { t } = useTranslation();

  const { captionFormatted, descriptionFormatted } = resource.attributes;

  if (!captionFormatted && !descriptionFormatted) return null;

  return (
    <Styled.Content>
      <Styled.Caption dangerouslySetInnerHTML={{ __html: captionFormatted }} />
      {!!descriptionFormatted && (
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
  resource: PropTypes.object.isRequired
};

export default ResourceDescription;
