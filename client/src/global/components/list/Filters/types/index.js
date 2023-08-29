import { sortFilter as sort } from "./sort";
import { featuredAndSubjectFilter as subjects } from "./featuredAndSubject";
import { membershipFilter as memberships } from "./membership";
import { sectionFilter as sections } from "./section";
import { textFilter as texts } from "./text";
import { kindFilter as kinds } from "./kind";
import { tagFilter as tags } from "./tag";
import { orderCollectionFilter as orderCollection } from "./orderCollection";
import { groupSortFilter as groupSort } from "./groupSort";
import { groupStatusFilter as groupStatus } from "./groupStatus";
import { sortChronFilter as sortChron } from "./sortChron";

export default {
  sort,
  subjects,
  memberships,
  sections,
  texts,
  kinds,
  tags,
  orderCollection,
  groupSort,
  groupStatus,
  sortChron
};
