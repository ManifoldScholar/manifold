import * as Kinds from "./kinds";

export default function getKindComponent(kind) {
  switch (kind) {
    case "audio":
      return Kinds.Audio;
    case "image":
      return Kinds.Image;
    case "interactive":
      return Kinds.Interactive;
    case "video":
      return Kinds.Video;
    default:
      return Kinds.Default;
  }
}
