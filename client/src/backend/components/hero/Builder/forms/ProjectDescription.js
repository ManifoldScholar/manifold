import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

function ProjectDescription({
  modelLabel,
  failureRedirectRoute,
  api,
  headerId,
  withDarkMode = true,
  model,
  closeDrawer
}) {
  const maybeCloseDrawer = useCallback(() => {
    if (!closeDrawer) return;
    closeDrawer();
  }, [closeDrawer]);

  return (
    <Authorize
      entity={model}
      ability="update"
      failureNotification
      failureRedirect={lh.link(failureRedirectRoute, model.id)}
    >
      <section>
        <Navigation.DrawerHeader
          icon="projects64"
          title="Description + Images"
          headerId={headerId}
        />
        <FormContainer.Form
          model={model}
          name="backend-hero-update"
          update={api.update}
          create={api.create}
          className="form-secondary"
          onSuccess={maybeCloseDrawer}
        >
          {withDarkMode && (
            <Form.Switch label="Dark Mode" name="attributes[darkMode]" />
          )}
          <Form.TextArea
            wide
            focusOnMount
            height={250}
            label="Description"
            name="attributes[description]"
            placeholder={`Describe the ${modelLabel}`}
            instructions={`Enter a brief description of your ${modelLabel}. This field accepts basic Markdown.`}
          />
          <Form.Upload
            layout="landscape"
            accepts="images"
            label="Background Image"
            readFrom="attributes[heroStyles][small]"
            name="attributes[hero]"
            remove="attributes[removeHero]"
            instructions={
              "Images will be resized to 1280x800 and cropped along the bottom edge."
            }
          />
          <Form.Upload
            layout="portrait"
            label="Cover Image"
            accepts="images"
            readFrom="attributes[coverStyles][small]"
            name="attributes[cover]"
            remove="attributes[removeCover]"
            instructions={`If a cover is set for the ${modelLabel}, it will appear over the hero, to the right of the description.`}
          />
          <Form.TextArea
            label="Image Credits"
            name="attributes[imageCredits]"
            placeholder="Add image credits"
            instructions="Enter image credits for hero and cover. This field accepts basic Markdown."
            height={250}
            wide
          />
          <Form.Save text="Save" />
        </FormContainer.Form>
      </section>
    </Authorize>
  );
}

ProjectDescription.propTypes = {
  model: PropTypes.object.isRequired,
  modelLabel: PropTypes.string.isRequired,
  api: PropTypes.object.isRequired,
  failureRedirectRoute: PropTypes.string.isRequired,
  closeDrawer: PropTypes.func,
  withDarkMode: PropTypes.bool,
  headerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ProjectDescription;
