import { useOutletContext } from "react-router-dom";
import { Navigate } from "react-router-dom";
import lh from "helpers/linkHandler";
import ContentBlock from "backend/components/content-block";
import Form from "./Form";

export default function ContentBlockNewContainer() {
  const { pendingBlock, project, closeCallback } = useOutletContext() || {};

  // This container is dependent on a pendingBlock being placed in the layout.  If no pendingBlock is
  // passed, we assumed nothing has changed in the layout and close the drawer.
  if (!pendingBlock || !project) {
    return (
      <Navigate to={lh.link("backendProjectLayout", project?.id)} replace />
    );
  }

  return (
    <section>
      <ContentBlock.DrawerHeader contentBlock={pendingBlock} />
      <Form
        contentBlock={pendingBlock}
        project={project}
        closeCallback={closeCallback}
      />
    </section>
  );
}

ContentBlockNewContainer.displayName = "ContentBlock.New";
