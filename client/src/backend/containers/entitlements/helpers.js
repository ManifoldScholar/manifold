import partition from "lodash/partition";

const isUserGroupEntitlement = e =>
  !!e?.relationships?.entitler?.attributes.metadata?.user_group;

export const filterEntitlements = entitlements => {
  return partition(entitlements, isUserGroupEntitlement);
};

export const getUserGroups = entitlements => {
  return entitlements.reduce((arr, e) => {
    const group = e?.relationships?.entitler?.attributes.metadata?.user_group;
    if (!group) return arr;

    const alreadyAdded = arr.some(g => g.id === group.id);
    if (!alreadyAdded) return [...arr, { ...group, type: "userGroup" }];
    return arr;
  }, []);
};
