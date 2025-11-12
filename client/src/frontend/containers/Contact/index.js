import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFromStore } from "hooks";
import { contactsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Form, { Unwrapped } from "global/components/form";

const { request, flush } = entityStoreActions;

export default function ContactContainer() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const response = useFromStore({
    path: `entityStore.responses.${requests.gContactForm}`
  });
  const [contact, setContact] = useState({
    email: "",
    message: "",
    fullName: ""
  });

  useEffect(() => {
    return () => {
      dispatch(flush(requests.gContactForm));
    };
  }, [dispatch]);

  const redirectToHome = () => {
    navigate("/");
  };

  const sendMessage = event => {
    event.preventDefault(event.target);
    dispatch(
      request(
        contactsAPI.create({ attributes: contact }),
        requests.gContactForm
      )
    ).promise.then(() => {
      redirectToHome();
    });
  };

  const handleInputChange = event => {
    const name = event.target.name.replace("attributes[", "").replace("]", "");
    setContact({
      ...contact,
      [name]: event.target.value
    });
  };

  const errors = get(response, "errors") || [];

  return (
    <section>
      <div className="container">
        <form method="post" onSubmit={sendMessage}>
          <Form.Header styleType="primary" label={t("forms.contact.title")} />
          <Form.FieldGroup>
            <Unwrapped.Input
              value={contact.email}
              type="text"
              name="attributes[email]"
              id="create-email"
              idForError="create-email-error"
              errors={errors}
              onChange={handleInputChange}
              placeholder={t("forms.contact.email_placeholder")}
              label={t("forms.contact.email")}
              wide
            />
            <Unwrapped.Input
              value={contact.fullName}
              type="text"
              id="create-name"
              aria-describedby="create-name-error"
              onChange={handleInputChange}
              placeholder={t("forms.contact.name_placeholder")}
              name={"attributes[fullName]"}
              errors={errors}
              idForError="create-name-error"
              wide
              label={t("forms.contact.name")}
            />
            <Unwrapped.TextArea
              label={t("forms.contact.message")}
              name="attributes[message]"
              errors={errors}
              idForError="create-message-error"
              value={contact.message}
              type="message"
              id="create-message"
              onChange={handleInputChange}
              placeholder={t("forms.contact.message_placeholder")}
              aria-describedby="create-message-error"
            />
            <input
              className="button-secondary button-secondary--with-room"
              type="submit"
              value={t("forms.contact.button_label")}
            />
          </Form.FieldGroup>
        </form>
      </div>
    </section>
  );
}
