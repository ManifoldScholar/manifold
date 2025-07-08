import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import { useTranslation } from "react-i18next";
import BrowseButton from "./browse/BrowseButton";
import * as Styled from "./styles";

export default function InsertImageForm({ urlRef, altRef, defaultValues }) {
  const { t } = useTranslation();

  return (
    <>
      <BrowseButton />
      <Styled.Form>
        <Input
          defaultValue={defaultValues?.src}
          ref={urlRef}
          name="url"
          label={t("editor.forms.image_url_label")}
        />
        <Input
          defaultValue={defaultValues?.alt}
          ref={altRef}
          name="alt"
          label={t("editor.forms.alt_text_label")}
        />
      </Styled.Form>
    </>
  );
}
