import React from "react";
import { FormBaseInput as Input } from "../../../../../BaseInput";
import * as Styled from "./styles";

export default function InsertImageForm({ urlRef, altRef }) {
  return (
    <Styled.Form>
      <Input ref={urlRef} name="url" label="url" />
      <Input ref={altRef} name="alt" label="alt" />
    </Styled.Form>
  );
}
