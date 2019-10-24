require "swagger_helper"

RSpec.describe "Text", type: :request do
  path "/texts" do
    # QUESTION: it seems that only projects are included on this route. Where can I verify this?
    include_examples "an API index request", model: Text, included: [ :project ], partial: true
    # NOTE do not build the create request. This is not a valid route
  end
  path "/texts/{id}" do
    include_examples "an API show request", model: Text, included: [ :project, :category ]
    include_examples "an API update request", model: Text, auth_type: :admin, included: [ :maker, :project ]
    include_examples "an API destroy request", model: Text, auth_type: :admin
  end
end
