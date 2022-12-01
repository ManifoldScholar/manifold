import path from "path";
import ace from "ace-builds/src-noconflict/ace";
import editor from "react-ace";
import "./theme";

/* We don't want to use this because it adds every build, but it does fix the basePath error. */
// import "ace-builds/webpack-resolver";

ace.config.set("basePath", path.resolve(__dirname, "../../../../.."));

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";

// import jsWorkerUrl from "ace-builds/src-noconflict/worker-javascript";
// import htmlWorkerUrl from "ace-builds/src-noconflict/worker-html";
import cssWorkerUrl from "ace-builds/src-noconflict/worker-css";

ace.config.setModuleUrl("ace/mode/css_worker", cssWorkerUrl);
// ace.config.setModuleUrl("ace/mode/javascript_worker", jsWorkerUrl);
// ace.config.setModuleUrl("ace/mode/html_worker", htmlWorkerUrl);

export default editor;
