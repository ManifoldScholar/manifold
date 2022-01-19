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
  padding-top: min(6.579vw, 50px);
  padding-right: min(1.974vw, 15px);
  padding-left: min(1.974vw, 15px);
`;

export const Header = styled.header`
  display: flex;
  align-items: baseline;
  padding-right: ${lateralPadding};
  padding-left: ${lateralPadding};
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: var(--font-weight-regular);
  transform: translateY(-75%);
`;

export const Icon = styled(IconComposer)`
  order: -1;
  margin-right: 16px;
  margin-left: -5px;
`;

export const Fields = styled.fieldset`
  padding: 0;
  margin: 0;
  margin-top: 28px;
  border: none;
`;

export const Group = styled.div`
  max-height: ${maxListHeight};
  margin-top: 10px;
  overflow: auto;
`;

export const Footer = styled.div`
  padding-right: ${lateralPadding};
  padding-left: ${lateralPadding};
  margin-top: 50px;
`;

export const Close = styled.button`
  width: 100%;
`;
