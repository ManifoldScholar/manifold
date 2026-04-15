import { useEffect, useRef, useState } from "react";
import {
  Outlet,
  Link,
  useLocation,
  useMatches,
  useSearchParams
} from "react-router";
import Button from "components/global/atomic/Button";
import IconComposer from "components/global/utility/IconComposer";
import { useBodyClass } from "hooks";
import * as Styled from "./styles";
import { SelectionProvider, useSelection } from "./selectionContext";

export const shouldRevalidate = false;

function labelForType(type) {
  if (type === "project") return "Projects";
  if (type === "text") return "Texts";
  if (type === "section") return "Sections";
  if (type === "resource") return "Resources";
  return type;
}

const SIDEBAR_TYPES = ["project", "text", "section", "resource"];

function SidebarContents({ onClose }) {
  const { items, remove } = useSelection();

  const grouped = items.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {});

  return (
    <>
      <Styled.SidebarHeader>
        <h2>Selected</h2>
        <button type="button" aria-label="Close sidebar" onClick={onClose}>
          <IconComposer icon="arrowRight16" size={20} />
        </button>
      </Styled.SidebarHeader>
      {items.length === 0 ? (
        <Styled.Empty>Nothing selected yet.</Styled.Empty>
      ) : (
        SIDEBAR_TYPES.map(type =>
          grouped[type] ? (
            <Styled.SidebarGroup key={type}>
              <h3>{labelForType(type)}</h3>
              <ul>
                {grouped[type].map(item => (
                  <li key={`${item.type}:${item.id}`}>
                    <span>{item.title}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => remove(item)}
                    >
                      <IconComposer icon="close16" size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </Styled.SidebarGroup>
          ) : null
        )
      )}
      <Styled.AddToCourseButton>
        <Button
          type="button"
          size="md"
          background="accent"
          label="Add to Course"
          disabled={items.length === 0}
        />
      </Styled.AddToCourseButton>
    </>
  );
}

function SidebarDrawer({ open, onOpen, onClose }) {
  const { items } = useSelection();
  const count = items.length;
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count > prevCountRef.current && !open) {
      onOpen();
    }
    prevCountRef.current = count;
  }, [count, open, onOpen]);

  return (
    <>
      {!open && (
        <Styled.SidebarToggle
          type="button"
          onClick={onOpen}
          aria-label={`Open selected (${count})`}
        >
          Selected{count > 0 ? ` (${count})` : ""}
        </Styled.SidebarToggle>
      )}
      <Styled.Sidebar $open={open} aria-hidden={!open}>
        <SidebarContents onClose={onClose} />
      </Styled.Sidebar>
    </>
  );
}

export default function LtiLayout() {
  useBodyClass("browse");

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const matches = useMatches();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLanding =
    location.pathname === "/lti" || location.pathname === "/lti/";
  const isSearch =
    location.pathname === "/lti/search" ||
    location.pathname === "/lti/search/";
  const keyword = searchParams.get("keyword") ?? "";

  const crumbs = matches.flatMap(match => {
    const fn = match.handle?.breadcrumb;
    if (!fn) return [];
    try {
      const result = fn(match, location);
      if (!result) return [];
      return Array.isArray(result) ? result : [result];
    } catch {
      return [];
    }
  });

  return (
    <SelectionProvider>
      <Styled.Wrapper $sidebarOpen={sidebarOpen}>
        <Styled.TopBar>
          <Styled.Breadcrumbs>
            <Link to="/lti">Add Manifold Links</Link>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <span key={`${crumb.to ?? crumb.label}-${i}`}>
                  <Styled.CrumbSep aria-hidden="true">/</Styled.CrumbSep>
                  {isLast || !crumb.to ? (
                    <span aria-current={isLast ? "page" : undefined}>
                      {crumb.label}
                    </span>
                  ) : (
                    <Link to={crumb.to}>{crumb.label}</Link>
                  )}
                </span>
              );
            })}
          </Styled.Breadcrumbs>
          {!isLanding && !isSearch && (
            <form action="/lti/search" method="get" role="search">
              <input
                type="search"
                name="keyword"
                placeholder="Search…"
                defaultValue={keyword}
                aria-label="Search"
              />
              <Button
                type="submit"
                size="sm"
                background="neutral"
                label="Search"
                preIcon="search16"
              />
            </form>
          )}
        </Styled.TopBar>
        <Styled.Body>
          <Styled.Main>
            <Outlet />
          </Styled.Main>
        </Styled.Body>
        <SidebarDrawer
          open={sidebarOpen}
          onOpen={() => setSidebarOpen(true)}
          onClose={() => setSidebarOpen(false)}
        />
      </Styled.Wrapper>
    </SelectionProvider>
  );
}
