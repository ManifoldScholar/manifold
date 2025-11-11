import Content from "./Content";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import HeadContent from "global/components/HeadContent";

export default function HomeContainer() {
  return (
    <>
      <HeadContent />
      <EventTracker event={EVENTS.VIEW_LIBRARY} />
      <Content />
    </>
  );
}
