
# The base application controller
class ApplicationController < ActionController::API
  include Authentication
  include Validation
  include JsonApi
end
