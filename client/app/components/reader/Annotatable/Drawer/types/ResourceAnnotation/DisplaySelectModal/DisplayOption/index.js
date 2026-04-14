import { useId, useEffect, useState } from "react";
import InlineIllustration from "./illustrations/Inline";
import BlockIllustration from "./illustrations/Block";
import * as Styled from "./styles";

export default function DisplayOption({
  title,
  description,
  value,
  warningId,
  ...inputProps
}) {
  const id = useId();
  const descriptionId = useId();

  const Illustration =
    value === "inline" ? InlineIllustration : BlockIllustration;

  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimating(true), 500);
  }, []);

  return (
    <Styled.Option>
      <Styled.Input
        id={`${id}-${value}`}
        type="radio"
        value={value}
        name="attributes[readerDisplayFormat]"
        aria-describedby={`${descriptionId} ${warningId}`}
        {...inputProps}
      />
      <Styled.Title htmlFor={`${id}-${value}`}>{title}</Styled.Title>
      <Styled.Illustration aria-hidden $animating={animating}>
        <Illustration />
      </Styled.Illustration>
      <Styled.Description id={descriptionId} $animating={animating}>
        {description}
      </Styled.Description>
    </Styled.Option>
  );
}
