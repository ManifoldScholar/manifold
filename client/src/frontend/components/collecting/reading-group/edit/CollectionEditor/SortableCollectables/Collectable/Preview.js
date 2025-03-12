import * as React from "react";
import { createPortal } from "react-dom";
import { getCollectableIcon } from "./helpers";
import { Title } from "../parts";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Preview({ id, type, responses, active, container }) {
  return (
    active &&
    createPortal(
      <Styled.Wrapper>
        <Styled.Collectable>
          <Styled.Header>
            <IconComposer icon={getCollectableIcon(type)} size={36} />
            <Styled.Title>
              <Title id={id} responses={responses} />
            </Styled.Title>
          </Styled.Header>
        </Styled.Collectable>
      </Styled.Wrapper>,
      container
    )
  );
}
