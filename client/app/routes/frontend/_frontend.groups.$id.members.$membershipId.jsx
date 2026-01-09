import { useOutletContext, useSubmit } from "react-router";
import { redirect } from "react-router";
import { readingGroupMembershipsAPI } from "api";
import { routerContext } from "app/contexts";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import { useTranslation } from "react-i18next";
import { useConfirmation } from "hooks";
import Dialog from "global/components/dialog";
import { MemberSettingsForm } from "frontend/components/reading-group/forms";

export const handle = {
  drawer: true
};

export const loader = async ({ params, context }) => {
  const fetchFn = () => readingGroupMembershipsAPI.show(params.membershipId);
  return loadEntity({ context, fetchFn });
};

export async function action({ request, context, params }) {
  const { auth } = context.get(routerContext) ?? {};
  if (!auth?.authToken) {
    return { errors: [{ detail: "Unauthorized" }] };
  }

  const requestData = await request.json();
  const { intent, ...data } = requestData;

  try {
    if (intent === "delete") {
      const result = await queryApi(
        readingGroupMembershipsAPI.destroy(params.membershipId),
        context
      );

      if (result?.errors) {
        return { errors: result.errors };
      }

      // Redirect to members route to close drawer and trigger revalidation
      throw redirect(`/groups/${params.id}/members`);
    } else {
      // Update intent

      const result = await queryApi(
        readingGroupMembershipsAPI.update(params.membershipId, data),
        context
      );

      if (result?.errors) {
        return { errors: result.errors };
      }

      // Redirect to members route to close drawer and trigger revalidation
      throw redirect(`/groups/${params.id}/members`);
    }
  } catch (error) {
    return handleActionError(error, "Failed to update membership");
  }
}

export default function ReadingGroupMemberEdit({
  loaderData: membership,
  actionData
}) {
  const submit = useSubmit();
  const { readingGroup } = useOutletContext();
  const { t } = useTranslation();
  const { confirm, confirmation } = useConfirmation();

  const handleRemove = () => {
    const heading = t("messages.membership.destroy_heading");
    const message = t("messages.membership.destroy_message");
    confirm({
      heading,
      message,
      callback: () => {
        submit(JSON.stringify({ intent: "delete" }), {
          method: "post",
          encType: "application/json"
        });
      }
    });
  };

  if (!membership) return null;

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <section>
        <Layout.DrawerHeader
          title={t("forms.reading_group_member.title")}
          buttons={[
            {
              onClick: handleRemove,
              icon: "delete24",
              label: t("actions.delete"),
              className: "utility-button__icon utility-button__icon--notice"
            }
          ]}
          buttonLayout="inline"
          small
        />
        <MemberSettingsForm
          membership={membership}
          readingGroup={readingGroup}
          confirm={confirm}
          submit={submit}
          errors={actionData?.errors || []}
        />
      </section>
    </>
  );
}
