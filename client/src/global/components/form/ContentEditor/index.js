import loadable from "@loadable/component";
import setter from "../setter";

const Editor = loadable(() => import("./components/Wrapper"));

export default setter(Editor);

Editor.displayName = "Global.Form.ContentEditor.Loader";
