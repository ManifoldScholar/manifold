import styled from "@emotion/styled";
import Dialog from "global/components/dialog";
import IconComposer from "global/components/utility/IconComposer";

const lateralPadding = `min(3.158vw, 24px)`;
const maxDialogHeight = `90vh`;
const maxListHeight = `220px`;

export const Wrapper = styled(Dialog.Wrapper)`
  max-height: ${maxDialogHeight};
  overflow: auto;
  font-weight: var(--font-weight-regular);
`;

export const Inner = styled.div`
  padding-block-start: min(6.579vw, 50px);
  padding-inline-end: min(1.974vw, 15px);
  padding-inline-start: min(1.974vw, 15px);
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  padding-inline-end: ${lateralPadding};
  padding-inline-start: ${lateralPadding};
`;

export const Title = styled.h2`
  margin: 0;
  margin-block-start: -8px;
  font-size: 20px;
  font-weight: var(--font-weight-regular);
`;

export const Icon = styled(IconComposer)`
  order: -1;
  margin-inline-end: 16px;
  margin-inline-start: -5px;
`;

export const Fields = styled.fieldset`
  padding: 0;
  margin: 0;
  margin-block-start: 28px;
  border: none;
`;

export const Group = styled.div`
  max-height: ${maxListHeight};
  margin-block-start: 10px;
  overflow: auto;
`;

export const Footer = styled.div`
  padding-inline-end: ${lateralPadding};
  padding-inline-start: ${lateralPadding};
  margin-block-start: 50px;
`;

export const Close = styled.button`
  width: 100%;
`;
