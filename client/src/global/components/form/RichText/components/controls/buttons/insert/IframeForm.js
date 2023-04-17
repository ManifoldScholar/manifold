import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import * as Styled from "./styles";

export default function InsertIframeForm({ urlRef, titleRef }) {
  return (
    <Styled.Form>
      <Input ref={urlRef} name="url" label="url" />
      <Input ref={titleRef} name="title" label="title" />
    </Styled.Form>
  );
}
