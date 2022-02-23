import { useCallback } from "react";
import trim from "lodash/trim";
import qs from "query-string";
import lh from "helpers/linkHandler";
import { useFromStore } from "hooks";

const DEFAULT_WINDOW_OPTIONS = ["", "", "width=600,height=300"];

function buildURI(base, params) {
  return `${base}?${qs.stringify(params)}`;
}

export default function useShareAnnotation({
  text,
  section,
  selectionState,
  windowOptions = DEFAULT_WINDOW_OPTIONS
}) {
  const settings = useFromStore("settings", "select");
  const facebookAppId = settings.attributes.integrations.facebookAppId;

  function getNodeUrl() {
    if (typeof window === "undefined") return null;
    const readerUrl = lh.link(
      "readerSection",
      text.attributes.slug,
      section.id
    );
    const url = `${window.location.hostname}${readerUrl}`;
    const node = selectionState?.selection?.startNode?.dataset.nodeUuid;
    if (!node) return url;
    return `${url}#node-${node}`;
  }

  function getMessage() {
    if (!selectionState?.selection) return null;
    const selectedText = trim(selectionState.selection.text);
    if (selectedText.length === 0) {
      return `Read “${selectedText.attributes.titlePlaintext}” on Manifold:`;
    }
    return `“${selectionState.selection.text}” from Manifold:`;
  }

  function share(url) {
    const options = windowOptions.join(",");
    window.open(url, "_blank", options);
  }

  const shareOnTwitter = useCallback(() => {
    const nodeUrl = getNodeUrl();
    const message = getMessage();
    const params = {
      text: !message || message === "" ? nodeUrl : `${message} ${nodeUrl}`
    };
    const shareUrl = buildURI("https://twitter.com/intent/tweet", params);
    share(shareUrl);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const shareOnFacebook = useCallback(() => {
    const nodeUrl = getNodeUrl();
    const message = getMessage();
    const params = {
      app_id: facebookAppId,
      display: "popup",
      caption: message,
      link: nodeUrl,
      redirect_uri: "https://www.facebook.com"
    };
    const shareUrl = buildURI("https://www.facebook.com/dialog/feed", params);
    share(shareUrl);
  }, [facebookAppId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { facebookAppId, shareOnTwitter, shareOnFacebook };
}
