const stateTransformer = {};

function isNoop(action) {
  return !action || !action.payload;
}

function isOp(action) {
  return !isNoop(action);
}

function shouldTouchResponses(action) {
  return isOp(action) && !action.payload.noTouch;
}

function shouldOverwritePartials(action) {
  return isOp(action) && action.payload.force;
}

function isCollectionResponse(action) {
  return isOp(action) && Array.isArray(action.payload.results);
}

function isEntityResponse(action) {
  return !isCollectionResponse(action);
}

const responseHelper = {
  isNoop,
  shouldTouchResponses,
  shouldOverwritePartials,
  isCollectionResponse,
  isEntityResponse
};

export default { stateTransformer, responseHelper };
