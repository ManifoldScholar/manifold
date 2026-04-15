import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { projectsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import * as Styled from "../styles";
import { useSelection } from "../selectionContext";

function Pager({ meta }) {
  const [searchParams] = useSearchParams();
  const pagination = meta?.pagination ?? {};
  const { currentPage, totalPages, prevPage, nextPage } = pagination;
  if (!totalPages || totalPages < 2) return null;

  const linkFor = page => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    return `?${params.toString()}`;
  };

  return (
    <Styled.Pager aria-label="Pagination">
      {prevPage ? (
        <Link to={linkFor(prevPage)}>← Previous</Link>
      ) : (
        <span className="pager-disabled">← Previous</span>
      )}
      <span className="pager-current">
        Page {currentPage} of {totalPages}
      </span>
      {nextPage ? (
        <Link to={linkFor(nextPage)}>Next →</Link>
      ) : (
        <span className="pager-disabled">Next →</span>
      )}
    </Styled.Pager>
  );
}

export const handle = {
  breadcrumb: () => ({ label: "Projects", to: "/lti/projects" })
};

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: projectsAPI.index
  });
};

function ProjectRow({ project }) {
  const { add, remove, has } = useSelection();
  const [expanded, setExpanded] = useState(false);
  const { titlePlaintext, subtitle } = project.attributes ?? {};
  const initialTexts = project.attributes?.textsNav ?? null;
  const [texts, setTexts] = useState(initialTexts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!expanded || texts !== null) return;
    let cancelled = false;
    setLoading(true);
    queryApi(projectsAPI.show(project.id))
      .then(res => {
        if (cancelled) return;
        setTexts(res?.data?.attributes?.textsNav ?? []);
      })
      .catch(() => {
        if (!cancelled) setTexts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [expanded, texts, project.id]);

  const item = { type: "project", id: project.id, title: titlePlaintext };
  const selected = has(item);

  return (
    <Styled.ExpandableItem $selected={selected}>
      <Styled.RowMain>
        <Styled.ExpandToggle
          type="button"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? `Collapse ${titlePlaintext}`
              : `Expand ${titlePlaintext}`
          }
          $expanded={expanded}
        >
          ›
        </Styled.ExpandToggle>
        <Link to={`/lti/projects/${project.id}`}>
          {titlePlaintext}
          {subtitle ? <Styled.ItemSub>{subtitle}</Styled.ItemSub> : null}
        </Link>
        <Styled.AddButton
          type="button"
          onClick={() => (selected ? remove(item) : add(item))}
          $selected={selected}
          aria-label={
            selected ? `Remove ${titlePlaintext}` : `Add ${titlePlaintext}`
          }
        >
          {selected ? "✓" : "+"}
        </Styled.AddButton>
      </Styled.RowMain>
      {expanded && (
        <Styled.ExpandedChildren>
          <Styled.ExpandedLabel>
            Texts in {titlePlaintext}
            {texts && texts.length > 0 ? (
              <Styled.ExpandedCount>({texts.length})</Styled.ExpandedCount>
            ) : null}
          </Styled.ExpandedLabel>
          {loading && texts === null ? (
            <Styled.Empty>Loading texts…</Styled.Empty>
          ) : texts && texts.length > 0 ? (
            <ExpandedTexts
              texts={texts}
              project={{ id: project.id, title: titlePlaintext }}
            />
          ) : (
            <Styled.Empty>This project has no texts.</Styled.Empty>
          )}
        </Styled.ExpandedChildren>
      )}
    </Styled.ExpandableItem>
  );
}

function ExpandedTexts({ texts, project }) {
  const { add, remove, has } = useSelection();
  const trail = [
    { label: "Projects", to: "/lti/projects" },
    { label: project.title, to: `/lti/projects/${project.id}` }
  ];

  return (
    <ul>
      {texts.map(text => {
        const item = { type: "text", id: text.id, title: text.label };
        const selected = has(item);
        return (
          <li key={text.id}>
            <Link
              to={`/lti/texts/${text.id}`}
              state={{ trail }}
            >
              {text.label}
            </Link>
            <Styled.AddButton
              type="button"
              onClick={() => (selected ? remove(item) : add(item))}
              $selected={selected}
              aria-label={
                selected ? `Remove ${text.label}` : `Add ${text.label}`
              }
            >
              {selected ? "✓" : "+"}
            </Styled.AddButton>
          </li>
        );
      })}
    </ul>
  );
}

export default function LtiProjectsList({ loaderData }) {
  const projects = loaderData?.data ?? [];
  const meta = loaderData?.meta;

  return (
    <>
      <h1>Projects</h1>
      {projects.length === 0 ? (
        <Styled.Empty>No projects.</Styled.Empty>
      ) : (
        <>
          <Styled.SelectableList>
            {projects.map(project => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </Styled.SelectableList>
          <Pager meta={meta} />
        </>
      )}
    </>
  );
}
