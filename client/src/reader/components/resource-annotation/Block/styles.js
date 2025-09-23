import styled from "@emotion/styled";
import { unselectable } from "../Marker/Sidebar/styles";

export const Block = styled.aside`
  // looks a bit magical, but basically, a value between 0 and ~60px
  // that is ideally a small % of the difference between the viewport and container widths
  --_ideal-inline-overflow: 0.3 * (95vw - 100cqi);
  --_inline-overflow: clamp(0px, var(--_ideal-inline-overflow), 6.77cqi);

  inline-size: calc(100% + 2 * var(--_inline-overflow));
  margin-inline-start: calc(-1 * var(--_inline-overflow));
  // fallback if cqi not supported
  margin-block: min(6vw, 2.5rem);
  margin-block: min(6cqi, 2.5rem);
  // fallback if cqi not supported
  padding-block: clamp(20px, 6vw, 50px);
  padding-block: clamp(20px, 6cqi, 50px);
  padding-inline: clamp(20px, 6.5%, 60px);
  // fallback if light-dark() not supported
  border: 1px solid var(--color-base-neutral40);
  border: 1px solid
    light-dark(var(--color-base-neutral40), var(--color-base-neutral75));
  border-radius: 20px;
  ${unselectable}
`;
