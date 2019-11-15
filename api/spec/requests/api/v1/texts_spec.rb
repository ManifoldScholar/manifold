require "swagger_helper"

RSpec.describe "Text", type: :request do
  path "/texts" do
    include_examples "an API index request", model: Text, included: %w(project), partial: true
    # NOTE do not build the create request. This is not a valid route
  end
  path "/texts/{id}" do
    include_examples "an API show request", model: Text, included: %w(project category creators contributors stylesheets)
    include_examples "an API update request", model: Text, auth_type: :admin, included: %w(project creators contributors)
    include_examples "an API destroy request", model: Text, auth_type: :admin
  end
end
