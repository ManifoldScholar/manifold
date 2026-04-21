import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { projectsAPI, queryApi } from "api";
import IconComposer from "components/global/utility/IconComposer";
import LtiRow from "components/lti/Row";
import { useSelection } from "contexts";
import ExpandedTexts from "./ExpandedTexts";
import * as Styled from "./styles";

export default function ProjectRow({ project }) {
  const { t } = useTranslation();
  const { add, remove, has } = useSelection();
  const [expanded, setExpanded] = useState(false);
  const { titlePlaintext } = project.attributes ?? {};
  const initialTexts = project.attributes?.textsNav ?? null;
  const [texts, setTexts] = useState(initialTexts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!expanded || texts !== null) return undefined;
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
              ? t("lti.project_row.collapse", { title: titlePlaintext })
              : t("lti.project_row.expand", { title: titlePlaintext })
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
            {t("lti.project_row.texts_in", { title: titlePlaintext })}
            {texts && texts.length > 0 ? (
              <Styled.ExpandedCount>({texts.length})</Styled.ExpandedCount>
            ) : null}
          </Styled.ExpandedLabel>
          {loading && texts === null ? (
            <Styled.Empty>{t("lti.project_row.loading")}</Styled.Empty>
          ) : texts && texts.length > 0 ? (
            <ExpandedTexts
              texts={texts}
              project={{ id: project.id, title: titlePlaintext }}
            />
          ) : (
            <Styled.Empty>{t("lti.project_row.empty")}</Styled.Empty>
          )}
        </Styled.ExpandedChildren>
      )}
    </Styled.ExpandableItem>
  );
}
