import { useTranslation } from "react-i18next";
import IconComposer from "components/global/utility/IconComposer";
import { useSelection } from "contexts";
import * as Styled from "./styles";

export const ICON_MAP = {
  project: "projects64",
  text: "textsBook64",
  textSection: "toc64",
  resource: "resources64",
  resourceCollection: "resourceCollection64"
};

export default function Group({ type, items }) {
  const { t } = useTranslation();

  const { remove } = useSelection();

  return (
    <Styled.Group key={type}>
      <Styled.Header>
        <IconComposer icon={ICON_MAP[type]} size={20} />
        <h3>{t(`lti.cart.group.${type}`)}</h3>
      </Styled.Header>
      <ul>
        {items.map(item => (
          <Styled.Item key={`${item.type}:${item.id}`}>
            <span>{item.title}</span>
            <button
              type="button"
              aria-label={t("lti.toggle.remove_item", {
                title: item.title
              })}
              onClick={() => remove(item)}
            >
              <IconComposer icon="delete24" size={16} />
            </button>
          </Styled.Item>
        ))}
      </ul>
    </Styled.Group>
  );
}
