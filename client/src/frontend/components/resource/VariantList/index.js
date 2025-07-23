import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Variant from "./Variant";
import * as Styled from "./styles";

const VARIANT_KEYS = ["variantFormatOne", "variantFormatTwo", "highRes"];

function ResourceVariantList({ resource }) {
  const { t } = useTranslation();

  const variants = VARIANT_KEYS.map(variant => {
    const url = resource.attributes[`${variant}Url`];
    const filename = resource.attributes[`${variant}FileName`];

    if (!url || !filename) return null;

    return { url, filename };
  }).filter(Boolean);

  if (!variants.length) return null;

  return (
    <Styled.Container>
      <Styled.Title>{`${t("pages.subheaders.variants")}:`}</Styled.Title>
      <Styled.List>
        {variants.map(({ url, filename }) => (
          <Variant key={filename} url={url} filename={filename} />
        ))}
      </Styled.List>
    </Styled.Container>
  );
}

ResourceVariantList.displayName = "Resource.VariantList";

ResourceVariantList.propTypes = {
  resource: PropTypes.object
};

export default ResourceVariantList;
