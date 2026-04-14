import { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { useFormField } from "hooks";

const Editor = lazy(() => import("./components/Wrapper"));

export default function ContentEditor({ name, ...props }) {
  const { set } = useFormField(name);

  return (
    <Suspense fallback={null}>
      <Editor set={set} {...props} />
    </Suspense>
  );
}

ContentEditor.displayName = "Global.Form.ContentEditor";

ContentEditor.propTypes = {
  name: PropTypes.string.isRequired,
  stylesheets: PropTypes.arrayOf(PropTypes.object),
  initialHtmlValue: PropTypes.string,
  initialSlateValue: PropTypes.array,
  hasErrors: PropTypes.bool,
  setHasErrors: PropTypes.func,
  warnErrors: PropTypes.bool,
  setWarnErrors: PropTypes.func,
  nextRef: PropTypes.object
};
