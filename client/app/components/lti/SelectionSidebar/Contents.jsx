import { useTranslation } from "react-i18next";
import Button from "components/global/atomic/Button";
import IconComposer from "components/global/utility/IconComposer";
import { useSelection } from "contexts";
import * as Styled from "./styles";

const SIDEBAR_TYPES = [
  "project",
  "text",
  "section",
  "resource",
  "resourceCollection"
];

export default function SelectionSidebarContents({ onClose }) {
  const { t } = useTranslation();
  const { items, remove } = useSelection();

  const grouped = items.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {});

  return (
    <>
      <Styled.SidebarHeader>
        <h2>{t("lti.sidebar.heading")}</h2>
        <button
          type="button"
          aria-label={t("lti.sidebar.close")}
          onClick={onClose}
        >
          <IconComposer icon="arrowRight16" size={20} />
        </button>
      </Styled.SidebarHeader>
      {items.length === 0 ? (
        <Styled.Empty>{t("lti.sidebar.empty")}</Styled.Empty>
      ) : (
        SIDEBAR_TYPES.map(type =>
          grouped[type] ? (
            <Styled.SidebarGroup key={type}>
              <h3>{t(`lti.sidebar.group.${type}`)}</h3>
              <ul>
                {grouped[type].map(item => (
                  <li key={`${item.type}:${item.id}`}>
                    <span>{item.title}</span>
                    <button
                      type="button"
                      aria-label={t("lti.toggle.remove_item", {
                        title: item.title
                      })}
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
          label={t("lti.sidebar.add_to_course")}
          disabled={items.length === 0}
        />
      </Styled.AddToCourseButton>
    </>
  );
}
