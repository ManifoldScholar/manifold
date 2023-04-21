import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import * as Styled from "./styles";

export default function InsertImageForm({ urlRef, altRef, defaultValues }) {
  return (
    <Styled.Form>
      <Input
        defaultValue={defaultValues?.src}
        ref={urlRef}
        name="url"
        label="Image Url"
      />
      <Input
        defaultValue={defaultValues?.alt}
        ref={altRef}
        name="alt"
        label="Alt Text"
      />
    </Styled.Form>
  );
}
