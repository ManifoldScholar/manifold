const requestNameMap = {
  frontend: {
    me: {
      filtered: "feMyAnnotations",
      default: "feMyAnnotations"
    },
    group: {
      filtered: "feReadingGroupAnnotations",
      default: "feReadingGroupAnnotations"
    }
  },
  reader: {
    me: {
      filtered: "rMyFilteredAnnotationsForText",
      default: "rMyAnnotationsForText"
    },
    group: {
      filtered: "rReadingGroupFilteredAnnotationsForText",
      default: "rReadingGroupAnnotationsForText"
    }
  }
};

function areValidParams(group, context, type) {
  try {
    const findRequestName = requestNameMap[context][group][type]; // eslint-disable-line no-unused-vars
    return true;
  } catch (error) {
    throw new Error(
      `Couldn't map params (group: "${group}", context: "${context}", filtered: "${type}") to a request name. Check the possible values in \`requestNameMap\` and try again.`
    );
  }
}

export function getRequestName(group, context, filtered = false) {
  const type = filtered ? "filtered" : "default";
  if (!areValidParams(group, context, type)) return null;
  return requestNameMap[context][group][type];
}
