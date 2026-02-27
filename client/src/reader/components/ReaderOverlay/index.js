import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Overlay from "global/components/Overlay";
import TextMeta from "reader/components/TextMeta";
import ReaderFullNotes from "reader/containers/ReaderFullNotes";
import Toc from "reader/components/Toc";
import Authorize from "hoc/Authorize";
import { useLoaderEntity } from "hooks";

export default function ReaderOverlay() {
  const text = useLoaderEntity("texts");
  const [showMeta, setShowMeta] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const renderOverlay = () => {
    if (showMeta && text) {
      return (
        <Overlay
          open
          closeCallback={() => setShowMeta(false)}
          appearance="overlay-full"
        >
          <TextMeta
            title={text.attributes.titlePlaintext}
            subtitle={text.attributes.subtitle}
            meta={text.attributes.metadataFormatted}
          />
        </Overlay>
      );
    }

    if (location.hash === "#group-annotations") {
      return (
        <Authorize kind="any">
          <ReaderFullNotes
            closeCallback={() => navigate({ hash: "" }, { replace: true })}
          />
        </Authorize>
      );
    }

    return null;
  };

  return (
    <>
      <Toc showMeta={() => setShowMeta(true)} />
      {renderOverlay()}
    </>
  );
}
