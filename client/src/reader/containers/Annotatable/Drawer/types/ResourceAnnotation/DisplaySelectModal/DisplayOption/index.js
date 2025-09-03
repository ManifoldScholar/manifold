import { useId, useEffect, useState } from "react";
import InlineIllustration from "./illustrations/Inline";
import BlockIllustration from "./illustrations/Block";
import * as Styled from "./styles";

export default function DisplayOption({
  value,
  title,
  description,
  defaultChecked,
  onChange,
  disabled
}) {
  const id = useId();

  const Illustration =
    value === "inline" ? InlineIllustration : BlockIllustration;

  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimating(true), 500);
  }, []);

  return (
    <Styled.Option htmlFor={`${id}-${value}`}>
      <Styled.Input
        id={`${id}-${value}`}
        type="radio"
        value={value}
        name="attributes[readerDisplayFormat]"
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
      />
      <Styled.Title>{title}</Styled.Title>
      <Styled.Illustration $animating={animating}>
        <Illustration />
      </Styled.Illustration>
      <Styled.Description $animating={animating}>
        {description}
      </Styled.Description>
    </Styled.Option>
  );
}
