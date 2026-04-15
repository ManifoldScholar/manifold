import styled from "@emotion/styled";

export const Wrapper = styled.div`
  font-family: var(--font-family-copy);
  color: var(--color-neutral-text-extra-dark);
  background-color: var(--color-base-neutral05);
  min-height: 100vh;
  padding-right: ${p => (p.$sidebarOpen ? "20rem" : "0")};
  transition: padding-right 0.25s ease;
`;

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 1.25rem;
  align-items: center;
  padding: 12px 24px;
  background-color: var(--background-color, #fff);
  border-bottom: 1px solid var(--color-neutral-ui-dull-dark);
  min-height: 56px;

  form {
    margin-left: auto;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  input[type="search"] {
    padding: 7px 12px;
    border: 1px solid var(--color-neutral-ui-dull-dark);
    border-radius: 3px;
    font-size: 14px;
    font-family: var(--font-family-copy);
    min-width: 18rem;
    background: #fff;
    color: var(--color-neutral-text-extra-dark);

    &:focus {
      outline: 2px solid var(--color-accent-primary);
      outline-offset: 1px;
    }
  }
`;

export const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  font-family: var(--font-family-sans);
  font-size: 13px;
  min-width: 0;

  a {
    color: var(--color-neutral-text-dark);
    text-decoration: none;
    white-space: nowrap;
    max-width: 18rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a:hover {
    color: var(--color-interaction-dark);
    text-decoration: underline;
  }

  > span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
  }

  > span > span[aria-current="page"] {
    color: var(--color-neutral-text-extra-dark);
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;
    max-width: 22rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const CrumbSep = styled.span`
  color: var(--color-neutral-ui-dark);
  user-select: none;
`;

export const Body = styled.div`
  max-width: 920px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const Main = styled.main`
  padding: 40px 0 64px;

  h1 {
    font-family: var(--font-family-sans);
    font-size: 28px;
    font-weight: var(--font-weight-semibold);
    margin: 0 0 8px;
    color: var(--color-neutral-text-extra-dark);
  }

  h2 {
    font-family: var(--font-family-sans);
    font-size: 16px;
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 40px 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-neutral-ui-dull-dark);
    color: var(--color-neutral-text-dark);
  }
`;

export const Subtitle = styled.p`
  color: var(--color-neutral-text-dark);
  margin: 0 0 24px;
  font-size: 16px;
  font-family: var(--font-family-copy);
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 8px;

  h1 {
    margin: 0;
  }
`;

export const Empty = styled.p`
  color: var(--color-neutral-text-dark);
  font-style: italic;
  padding: 16px 4px;
  margin: 0;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background: #fff;
  border: 1px solid var(--color-neutral-ui-dull-dark);
  border-radius: 4px;
  overflow: hidden;
`;

export const ExpandableList = styled(List)``;

export const ExpandableItem = styled.li`
  display: flex;
  flex-direction: column;
  background: ${p =>
    p.$selected
      ? "var(--color-accent-primary-pale-translucent, #e8f9f0)"
      : "transparent"};

  & + & {
    border-top: 1px solid var(--color-neutral-ui-dull-dark);
  }
`;

export const RowMain = styled.div`
  display: flex;
  align-items: stretch;
`;

export const ExpandToggle = styled.button`
  flex: 0 0 auto;
  width: 52px;
  border: none;
  background: transparent;
  color: var(--color-neutral-text-dark);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  svg,
  .icon {
    transition: transform 0.15s ease;
    transform: rotate(${p => (p.$expanded ? "0deg" : "-90deg")});
  }

  &:hover {
    color: var(--color-neutral-text-extra-dark);
    background: var(--color-base-neutral05);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: -2px;
  }
`;

export const RowBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ExpandedChildren = styled.div`
  background: var(--color-base-neutral05);
  box-shadow: inset 0 6px 8px -6px rgba(0, 0, 0, 0.12);
  padding: 20px 20px 16px 60px;

  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

export const ExpandedLabel = styled.div`
  font-family: var(--font-family-sans);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.075em;
  color: var(--color-neutral-text-dark);
  margin-bottom: 12px;
`;

export const ExpandedChildRow = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;

  & + & {
    border-top: 1px solid var(--color-neutral-ui-dull-dark);
  }

  > a {
    flex: 1;
    color: var(--color-interaction-dark);
    text-decoration: none;
    font-family: var(--font-family-sans);
    font-size: 14px;
  }

  > a:hover {
    text-decoration: underline;
  }
`;

export const ExpandedCount = styled.span`
  display: inline-block;
  margin-left: 0.4rem;
  font-weight: var(--font-weight-regular);
  color: var(--color-neutral-ui-dark);
  letter-spacing: 0;
  text-transform: none;
`;

export const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20rem;
  max-width: 20rem;
  background: #fff;
  border-left: 1px solid var(--color-neutral-ui-dull-dark);
  padding: 20px 20px 24px;
  overflow-y: auto;
  z-index: 5;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.04);
  transform: translateX(${p => (p.$open ? "0" : "100%")});
  transition: transform 0.25s ease;
  display: flex;
  flex-direction: column;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    font-family: var(--font-family-sans);
    font-size: 13px;
    font-weight: var(--font-weight-semibold);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    color: var(--color-neutral-text-dark);
  }

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: var(--color-neutral-text-dark);
    padding: 4px;
    border-radius: 3px;

    &:hover {
      color: var(--color-neutral-text-extra-dark);
      background: var(--color-base-neutral05);
    }
  }
`;

export const SidebarToggle = styled.button`
  position: fixed;
  top: 72px;
  right: 0;
  z-index: 6;
  padding: 8px 18px 8px 14px;
  background: #fff;
  border: 1px solid var(--color-neutral-ui-dull-dark);
  border-right: none;
  border-radius: 3px 0 0 3px;
  box-shadow: -1px 1px 4px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  font-family: var(--font-family-sans);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-text-extra-dark);

  &:hover {
    background: var(--color-base-neutral05);
  }
`;

export const SidebarGroup = styled.div`
  margin-bottom: 16px;

  h3 {
    font-family: var(--font-family-sans);
    font-size: 11px;
    font-weight: var(--font-weight-semibold);
    margin: 0 0 6px;
    color: var(--color-neutral-text-dark);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid var(--color-neutral-ui-dull-dark);
    border-radius: 3px;
    margin-bottom: 4px;
    background: #fff;
    font-size: 13px;
    font-family: var(--font-family-copy);
    color: var(--color-neutral-text-extra-dark);
  }

  li > span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  li > button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    color: var(--color-neutral-ui-dark);
    padding: 0 4px;

    &:hover {
      color: var(--color-notification-error);
    }
  }
`;

export const AddToCourseButton = styled.div`
  margin-top: auto;
  padding-top: 16px;

  > * {
    width: 100%;
    justify-content: center;
  }
`;

export const Landing = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0 32px;
  gap: 32px;

  h1 {
    font-family: var(--font-family-sans);
    font-size: 32px;
    font-weight: var(--font-weight-semibold);
    margin: 0;
    color: var(--color-neutral-text-extra-dark);
  }

  form {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    max-width: 560px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--color-neutral-ui-dull-dark);
  border-radius: 3px;
  font-size: 15px;
  font-family: var(--font-family-copy);
  color: var(--color-neutral-text-extra-dark);
  background: #fff;

  &:focus {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: 1px;
  }
`;

export const BrowseButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const PagerWrap = styled.div`
  margin-top: 32px;
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 24px;
  max-width: 560px;
`;

export const ResultsCount = styled.p`
  font-family: var(--font-family-sans);
  font-size: 13px;
  color: var(--color-neutral-text-dark);
  margin: 0 0 16px;
`;

export const DetailText = styled.div`
  font-family: var(--font-family-copy);
  line-height: 1.6;
  color: var(--color-neutral-text-extra-dark);
  font-size: 15px;

  p {
    margin: 0 0 16px;
  }
`;

export const MetaLine = styled.p`
  font-family: var(--font-family-sans);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.075em;
  color: var(--color-neutral-text-dark);
  margin: 4px 0 16px;
`;

const tocBaseInlineStartPadding = "32px";
const tocInlineEndPadding = "140px";
const tocPaddingIncrement = "20px";

export const Toc = styled.nav`
  font-family: var(--font-family-heading);
  background-color: var(--color-base-neutral10);
  color: var(--color-neutral-text-extra-dark);
  border-radius: 4px;
  overflow: hidden;
  padding-block: 10px;
`;

export const TocList = styled.ol`
  --toc-inline-start-padding: ${tocBaseInlineStartPadding};
  --toc-font-size: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--toc-font-size);
`;

export const TocSublist = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  --toc-font-size: 17px;
  font-size: var(--toc-font-size);
  --toc-inline-start-padding: calc(
    ${tocBaseInlineStartPadding} + ${tocPaddingIncrement} * ${p => p.$level ?? 1}
  );
`;

export const TocItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const TocRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--color-base-neutral20);
  }

  ${p =>
    p.$selected &&
    `
      background-color: var(--color-base-neutral20);
    `}
`;

export const TocLabel = styled.span`
  flex: 1;
  padding: 0.773em ${tocInlineEndPadding} 0.773em var(--toc-inline-start-padding);
  hyphens: none;
  line-height: 1.2;
  color: var(--color-neutral-text-extra-dark);
`;

export const TocAddSlot = styled.span`
  position: absolute;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
`;

export const TocEmpty = styled.p`
  font-family: var(--font-family-heading);
  font-style: italic;
  padding: 32px;
  margin: 0;
  color: var(--color-neutral-text-dark);
  background-color: var(--color-base-neutral10);
  border-radius: 4px;
`;
