import styled from "@emotion/styled";

export const Wrapper = styled.div`
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #1a1a1a;
  line-height: 1.5;
  margin: 0;
  padding: 0;
  background: #fff;
  padding-right: ${p => (p.$sidebarOpen ? "20rem" : "0")};
  transition: padding-right 0.25s ease;
`;

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;

  a {
    color: #333;
    text-decoration: none;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  }

  form {
    margin-left: auto;
    display: flex;
    gap: 0.5rem;
  }

  input[type="search"] {
    padding: 0.35rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 0.875rem;
    min-width: 16rem;
  }

  button {
    padding: 0.35rem 0.75rem;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    font-size: 0.875rem;
    cursor: pointer;
  }
`;

export const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
  font-size: 0.875rem;
  min-width: 0;

  a {
    color: #555;
    text-decoration: none;
    white-space: nowrap;
    max-width: 16rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a:hover {
    color: #0b5fa3;
    text-decoration: underline;
  }

  > span {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    min-width: 0;
  }

  > span > span[aria-current="page"] {
    color: #222;
    font-weight: 500;
    white-space: nowrap;
    max-width: 20rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const CrumbSep = styled.span`
  color: #aaa;
  user-select: none;
  padding: 0 0.1rem;
`;

export const Body = styled.div`
  max-width: 52rem;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const Main = styled.main`
  padding: 1.5rem 0 3rem;

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.25rem;
  }

  h2 {
    font-size: 1.125rem;
    margin: 1.75rem 0 0.5rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #eee;
  }
`;

export const Subtitle = styled.p`
  color: #666;
  margin: 0 0 1rem;
  font-size: 0.95rem;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  > li {
    border-bottom: 1px solid #eee;
  }

  > li:first-of-type {
    border-top: 1px solid #eee;
  }

  a {
    display: block;
    padding: 0.6rem 0.25rem;
    color: #0b5fa3;
    text-decoration: none;
  }

  a:hover {
    background: #f5f5f5;
  }
`;

export const ItemSub = styled.span`
  display: block;
  color: #777;
  font-size: 0.85rem;
  margin-top: 0.15rem;
`;

export const Empty = styled.p`
  color: #888;
  font-style: italic;
  padding: 0.5rem 0;
`;

export const TocList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;

  ul {
    list-style: none;
    margin: 0;
    padding-left: 1.25rem;
    border-left: 1px solid #eee;
    margin-left: 0.75rem;
  }

  li {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  > li:first-of-type {
    border-top: 1px solid #eee;
  }

  li > details {
    flex: 1;
    min-width: 0;
  }

  details > summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.25rem;
  }

  details > summary::-webkit-details-marker {
    display: none;
  }

  details > summary::before {
    content: "›";
    display: inline-block;
    width: 1rem;
    text-align: center;
    color: #888;
    font-size: 1rem;
    line-height: 1;
    transition: transform 0.15s ease;
  }

  details[open] > summary::before {
    transform: rotate(90deg);
  }

  summary:hover {
    background: #f5f5f5;
  }

  summary > span {
    flex: 1;
  }

  li > span.lti-toc-leaf {
    flex: 1;
    display: block;
    padding: 0.6rem 0.25rem 0.6rem 1.75rem;
  }
`;

export const Back = styled.div`
  margin-bottom: 1rem;

  a {
    color: #555;
    font-size: 0.875rem;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const Meta = styled.p`
  color: #666;
  font-size: 0.85rem;
  margin: 0.25rem 0 1rem;
`;

export const Pager = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.5rem;
  padding: 0.75rem 0;
  border-top: 1px solid #eee;
  font-size: 0.875rem;

  a,
  span {
    color: #333;
    text-decoration: none;
  }

  a:hover {
    color: #0b5fa3;
    text-decoration: underline;
  }

  .pager-current {
    color: #666;
  }

  .pager-disabled {
    color: #bbb;
  }
`;

export const Landing = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;

  h1 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem;
  }

  form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  button {
    padding: 0.45rem 0.85rem;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    font-size: 0.875rem;
    cursor: pointer;
  }
`;

export const SearchInput = styled.input`
  padding: 0.45rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.875rem;
  min-width: 20rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;

  h1 {
    margin: 0;
  }
`;

export const Sidebar = styled.aside`
  position: fixed;
  top: 3rem;
  right: 0;
  bottom: 0;
  width: 20rem;
  max-width: 20rem;
  background: #fff;
  border-left: 1px solid #ddd;
  padding: 1.25rem 1rem 2rem;
  overflow-y: auto;
  z-index: 5;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
  transform: translateX(${p => (p.$open ? "0" : "100%")});
  transition: transform 0.25s ease;

  h3 {
    font-size: 0.8rem;
    margin: 0 0 0.35rem;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  h2 {
    font-size: 1rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #555;
  }

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;
    color: #888;
    padding: 0 0.25rem;

    &:hover {
      color: #333;
    }
  }
`;

export const SidebarToggle = styled.button`
  position: fixed;
  top: 4rem;
  right: 0;
  z-index: 6;
  padding: 0.45rem 0.75rem;
  background: #fff;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 3px 0 0 3px;
  box-shadow: -1px 1px 4px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  font-size: 0.85rem;
  color: #333;

  &:hover {
    background: #f5f5f5;
  }
`;

export const AddToCourseButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid #0b5fa3;
  background: #0b5fa3;
  color: #fff;
  border-radius: 3px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #0a4f89;
    border-color: #0a4f89;
  }

  &:disabled {
    background: #b8cde0;
    border-color: #b8cde0;
    cursor: default;
  }
`;

export const SidebarGroup = styled.div`
  margin-bottom: 1rem;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.5rem;
    border: 1px solid #eee;
    border-radius: 3px;
    margin-bottom: 0.25rem;
    background: #fafafa;
    font-size: 0.85rem;
  }

  li > span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    color: #888;
    padding: 0 0.25rem;

    &:hover {
      color: #c00;
    }
  }
`;

export const SelectableItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #eee;
  background: ${p => (p.$selected ? "#f0f7ee" : "transparent")};

  > a {
    flex: 1;
    display: block;
    padding: 0.6rem 0.5rem;
    color: #0b5fa3;
    text-decoration: none;
  }

  > a:hover {
    background: ${p => (p.$selected ? "#e6f1e3" : "#f5f5f5")};
  }
`;

export const ExpandableItem = styled.li`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #eee;
  background: ${p => (p.$selected ? "#f0f7ee" : "transparent")};
`;

export const RowMain = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > a {
    flex: 1;
    display: block;
    padding: 0.6rem 0.5rem;
    color: #0b5fa3;
    text-decoration: none;
  }

  > a:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;

export const ExpandToggle = styled.button`
  flex: 0 0 auto;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: transparent;
  color: #888;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, color 0.15s ease;
  transform: rotate(${p => (p.$expanded ? "90deg" : "0deg")});

  &:hover {
    color: #333;
  }
`;

export const ExpandSpacer = styled.span`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  flex: 0 0 auto;
`;

export const ExpandedChildren = styled.div`
  padding: 0.5rem 1rem 0.75rem 2.75rem;
  background: #fafafa;
  border-top: 1px solid #eee;
  border-left: 3px solid #d6e3ef;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid #ececec;
  }

  li:last-child {
    border-bottom: none;
  }

  li > a {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.25rem;
    color: #0b5fa3;
    text-decoration: none;
    font-size: 0.875rem;
  }

  li > a:hover {
    background: #f0f0f0;
  }

  li > a::before {
    content: "";
    flex: 0 0 auto;
    width: 0.75rem;
    height: 1rem;
    border: 1px solid #b9c7d4;
    border-radius: 1px;
    background: #fff;
    background-image: linear-gradient(
      to bottom,
      transparent 0.25rem,
      #d1dae3 0.25rem,
      #d1dae3 calc(0.25rem + 1px),
      transparent calc(0.25rem + 1px),
      transparent 0.45rem,
      #d1dae3 0.45rem,
      #d1dae3 calc(0.45rem + 1px),
      transparent calc(0.45rem + 1px)
    );
    display: inline-block;
  }

  li > button {
    padding: 0.1rem 0.45rem;
    font-size: 0.85rem;
  }
`;

export const ExpandedLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #7a7a7a;
  margin-bottom: 0.25rem;
`;

export const ExpandedCount = styled.span`
  display: inline-block;
  margin-left: 0.4rem;
  font-weight: 500;
  color: #999;
  letter-spacing: 0;
  text-transform: none;
`;

export const SelectableList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  > li:first-of-type {
    border-top: 1px solid #eee;
  }
`;

export const AddButton = styled.button`
  flex: 0 0 auto;
  border: 1px solid ${p => (p.$selected ? "#cde0ca" : "#ccc")};
  background: ${p => (p.$selected ? "#f0f7ee" : "#fff")};
  color: ${p => (p.$selected ? "#4a7a42" : "#333")};
  border-radius: 3px;
  padding: 0.2rem 0.55rem;
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${p => (p.$selected ? "#fbeaea" : "#f0f7ee")};
    border-color: ${p => (p.$selected ? "#d08080" : "#7aa870")};
    color: ${p => (p.$selected ? "#a33" : "#333")};
  }
`;

export const BrowseButtons = styled.div`
  display: flex;
  gap: 0.75rem;

  a {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #333;
    text-decoration: none;
    font-size: 0.875rem;

    &:hover {
      background: #f5f5f5;
      border-color: #aaa;
    }
  }
`;
