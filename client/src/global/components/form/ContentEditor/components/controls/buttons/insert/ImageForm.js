import { useState } from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import { useTranslation } from "react-i18next";
import BrowseButton from "./browse/BrowseButton";
import * as Styled from "./styles";

export default function InsertImageForm({ urlRef, altRef, defaultValues }) {
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState({
    url: defaultValues?.src || "",
    alt: defaultValues?.alt
  });

  const onSelect = asset => {
    setFormValues({
      url: `/api/proxy/ingestion_sources/${asset.id}`,
      alt: asset.attributes.attachmentAltText
    });
  };

  return (
    <>
      <Styled.Form>
        <BrowseButton onSelect={onSelect} format="image" />
        <Input
          value={formValues.url}
          ref={urlRef}
          name="url"
          label={t("editor.forms.image_url_label")}
          onChange={e => setFormValues({ ...formValues, url: e.target.value })}
        />
        <Input
          value={formValues.alt}
          ref={altRef}
          name="alt"
          label={t("editor.forms.alt_text_label")}
          onChange={e => setFormValues({ ...formValues, alt: e.target.value })}
        />
      </Styled.Form>
    </>
  );
}
