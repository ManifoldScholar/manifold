import { useEffect, useState } from "react";
import { Link } from "react-router";
import { projectsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import IconComposer from "components/global/utility/IconComposer";
import LinkToggle from "components/lti/LinkToggle";
import LtiRow from "components/lti/Row";
import LtiPager from "components/lti/Pager";
import * as Styled from "../styles";
import { useSelection } from "../selectionContext";

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
  const { titlePlaintext } = project.attributes ?? {};
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
          <IconComposer icon="disclosureDown16" size={16} />
        </Styled.ExpandToggle>
        <Styled.RowBody>
          <LtiRow
            as="div"
            entity={project}
            kind="project"
            to={`/lti/projects/${project.id}`}
            selected={selected}
            onToggle={() => (selected ? remove(item) : add(item))}
          />
        </Styled.RowBody>
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

function ExpandedTextRow({ text, trail, add, remove, has }) {
  const [hovered, setHovered] = useState(false);
  const item = { type: "text", id: text.id, title: text.label };
  const selected = has(item);
  return (
    <Styled.ExpandedChildRow
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <Link to={`/lti/texts/${text.id}`} state={{ trail }}>
        {text.label}
      </Link>
      <LinkToggle
        selected={selected}
        onToggle={() => (selected ? remove(item) : add(item))}
        hiddenIfUnlinked={!hovered}
        srLabel={selected ? `Remove ${text.label}` : `Add ${text.label}`}
      />
    </Styled.ExpandedChildRow>
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
      {texts.map(text => (
        <ExpandedTextRow
          key={text.id}
          text={text}
          trail={trail}
          add={add}
          remove={remove}
          has={has}
        />
      ))}
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
          <Styled.ExpandableList>
            {projects.map(project => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </Styled.ExpandableList>
          <Styled.PagerWrap>
            <LtiPager meta={meta} />
          </Styled.PagerWrap>
        </>
      )}
    </>
  );
}
