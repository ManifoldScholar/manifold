require "swagger_helper"

RSpec.describe "Tags", type: :request do
  path "/tags" do
    include_examples "an API index request", model: Tag
  end
end
