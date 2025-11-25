import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { entityStoreActions } from "actions";
import withConfirmation from "hoc/withConfirmation";
import { makersAPI, requests } from "api";
import { useFetch, useApiCallback } from "hooks";
import Form from "./Form";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";

const { flush } = entityStoreActions;

function MakersEdit({ confirm, afterDestroy, refetch }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: maker } = useFetch({
    request: [makersAPI.show, id],
    options: { requestKey: requests.beMaker },
    condition: !!id
  });

  const deleteMaker = useApiCallback(makersAPI.destroy, {
    requestKey: requests.beMakerDestroy
  });

  useEffect(() => {
    return () => {
      flush([requests.beMakerUpdate]);
    };
  }, []);

  const destroyMaker = async () => {
    if (!maker) return;
    await deleteMaker(maker.id);
    if (refetch) refetch();
    if (afterDestroy) {
      afterDestroy();
    } else {
      navigate(lh.link("backendRecordsMakers"));
    }
  };

  const handleMakerDestroy = () => {
    const heading = t("modals.delete_maker");
    const message = t("modals.confirm_body");
    confirm(heading, message, destroyMaker);
  };

  if (!maker) return null;
  const attr = maker.attributes;

  return (
    <div>
      <Layout.DrawerHeader
        title={attr.fullName}
        buttons={[
          {
            onClick: handleMakerDestroy,
            icon: "delete32",
            label: t("actions.delete"),
            entity: maker,
            ability: "delete",
            className: "utility-button__icon--notice"
          }
        ]}
      />
      <Form maker={maker} />
    </div>
  );
}

MakersEdit.displayName = "Makers.Edit";

export default withConfirmation(MakersEdit);
