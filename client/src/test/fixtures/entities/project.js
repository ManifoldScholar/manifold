import abilities from "../structures/abilities";
import metadata from "../structures/metadata";

const project = () => ({
  type: "projects",
  attributes: {
    slug: "",
    title: "Rowan Test",
    titleFormatted: "Rowan Test",
    titlePlaintext: "Rowan Test",
    description:
      "The look in your eyes, I recognize it. You used to have it for me. I guess it's better to be lucky than good. Mr. Crusher, ready a collision course with the Borg ship. My oath is between Captain Kargan and myself. Your only concern is with how you obey my orders. Or do you prefer the rank of prisoner to that of lieutenant? That might've been one of the shortest assignments in the history of Starfleet. I'll alert the crew.",
    descriptionFormatted:
      "The look in your eyes, I recognize it. You used to have it for me. I guess it's better to be lucky than good. Mr. Crusher, ready a collision course with the Borg ship. My oath is between Captain Kargan and myself. Your only concern is with how you obey my orders. Or do you prefer the rank of prisoner to that of lieutenant? That might've been one of the shortest assignments in the history of Starfleet. I'll alert the crew.",
    subtitle: "World's Greatest Dog",
    darkMode: false,
    heroStyles: {},
    coverStyles: {},
    avatarStyles: {},
    avatarMeta: {},
    avatarColor: "primary",
    hashtag: "cute_dog",
    hideActivity: false,
    downloadCallToAction: "Download the greatest dog",
    abilities: abilities(),
    metadataProperties: Object.keys(metadata()),
    metadata: metadata(),
    metadataFormatted: metadata(),
    imageCreditsFormatted: "<p>Rowan, <em>The Dog</em></p>",
    restrictedAccessHeading: "Test heading",
    restrictedAccessBody: "Test body"
  },
  relationships: {
    resources: ["resource"],
    actionCallouts: ["actionCallout"],
    makers: ["maker"],
    texts: ["text"]
  }
});

export default project;
