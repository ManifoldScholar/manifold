import { useState } from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function InsertIframeForm({ urlRef, titleRef, defaultValues }) {
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState({
    url: defaultValues?.src || "",
    title: defaultValues?.title
  });

  return (
    <Styled.Form>
      <Input
        value={formValues.url}
        ref={urlRef}
        name="url"
        label={t("editor.forms.iframe_url_label")}
        onChange={e => setFormValues({ ...formValues, url: e.target.value })}
      />
      <Input
        value={formValues.title}
        defaultValue={defaultValues?.title}
        ref={titleRef}
        name="title"
        label={t("editor.forms.title_label")}
        onChange={e => setFormValues({ ...formValues, title: e.target.value })}
      />
    </Styled.Form>
  );
}
