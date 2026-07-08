import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDeepLinking } from "lti/contexts";
import Button from "global/components/atomic/Button";
import Group from "./Group";
import Message from "lti/components/atomics/Message";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

// On a successful submission the API returns the LMS return URL and a signed
// JWT. Post it straight back to the LMS as a synchronous form submission, which
// navigates the browser away and completes the deep-linking handshake.
function ReturnForm({ deepLinkReturnUrl, jwt }) {
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) formRef.current.submit();
  }, []);

  return (
    <form ref={formRef} action={deepLinkReturnUrl} method="POST" hidden>
      <input type="hidden" name="JWT" value={jwt} />
    </form>
  );
}

export default function Cart({ dialog }) {
  const { t } = useTranslation();
  const {
    items,
    acceptMultiple,
    submit,
    submitting,
    submitError,
    returnData
  } = useDeepLinking();
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
          {acceptMultiple === false && (
            <Message title={t("lti.cart.single_link_note")} noBorder />
          )}
          {submitError && (
            <Message title={t("lti.cart.submit_error")} noBorder />
          )}
          <Button
            type="button"
            size="md"
            background="accent"
            label={
              submitting ? t("lti.cart.saving") : t("lti.cart.add_to_course")
            }
            onClick={submit}
            disabled={submitting || !!returnData}
          />
        </>
      ) : (
        <Message title={t("lti.cart.empty_heading")} noBorder>
          <p>{t("lti.cart.empty_body")}</p>
        </Message>
      )}
      {returnData && <ReturnForm {...returnData} />}
    </Styled.Cart>
  );
}
