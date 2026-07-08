import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelection } from "lti/contexts";
import Button from "global/components/atomic/Button";
import Group from "./Group";
import Message from "lti/components/atomics/Message";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Cart({ dialog }) {
  const { t } = useTranslation();
  const { items } = useSelection();
  const count = items.length;
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count > prevCountRef.current && !dialog.open) {
      dialog.onToggleClick();
    }
    prevCountRef.current = count;
  }, [count, dialog]);

  const grouped = items.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {});

  const submitSelection = () => {
    // eslint-disable-next-line no-console
    console.warn(
      "[lti] Add to course: deep-linking return not yet implemented.",
      items
    );
  };

  return (
    <Styled.Cart ref={dialog.dialogRef}>
      <Styled.Header>
        <h2>{t("lti.cart.heading")}</h2>
        <button type="button" onClick={dialog.onCloseClick}>
          <span>{t("actions.close")}</span>
          <IconComposer icon="close16" size={16} />
        </button>
      </Styled.Header>
      {items?.length ? (
        <>
          {Object.keys(grouped).map(type =>
            grouped[type] ? <Group type={type} items={grouped[type]} /> : null
          )}
          <Button
            type="button"
            size="md"
            background="accent"
            label={t("lti.cart.add_to_course")}
            onClick={submitSelection}
          />
        </>
      ) : (
        <Message title={t("lti.cart.empty_heading")} noBorder>
          <p>{t("lti.cart.empty_body")}</p>
        </Message>
      )}
    </Styled.Cart>
  );
}
