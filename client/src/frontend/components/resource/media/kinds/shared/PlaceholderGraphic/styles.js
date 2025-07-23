import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import IconComputed from "global/components/icon-computed";
import { utilityPrimary } from "theme/styles/mixins";

export const Wrapper = styled.div`
  position: relative;
  container-type: inline-size;
  block-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--strong-color);
  ${utilityPrimary}
  font-size: 15px;
`;

export const Image = styled.img`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: 50% 50%;
`;

export const Inner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const CollectionIcon = styled(IconComposer)`
  inline-size: 120px;
  inline-size: min(20cqi, 120px);
  block-size: auto;
`;

export const ResourceIcon = styled(IconComputed.Resource)`
  inline-size: 120px;
  inline-size: min(20cqi, 120px);
  block-size: auto;
`;

export const Kind = styled.span``;
