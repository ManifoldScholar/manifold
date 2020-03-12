import factory, { collectionFactory } from "./factory";
import entities from "./entities";
import history from "./services/history";
import createStore from "./services/create-store";
import abilities from "./structures/abilities";
import authentication from "./structures/authentication";
import classAbilities from "./structures/class-abilities";
import metadata from "./structures/metadata";
import imageStyles from "./structures/image-styles";
import pagination from "./structures/pagination";
import route from "./structures/route";

export default {
  entities,
  factory,
  collectionFactory,
  history,
  createStore,
  abilities,
  authentication,
  classAbilities,
  metadata,
  imageStyles,
  pagination,
  route
};
