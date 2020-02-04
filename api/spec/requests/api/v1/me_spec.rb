require "swagger_helper"

RSpec.describe "Me", type: :request do
  path "/me" do
    include_examples "an API show request",
                     model: User,
                     resource_name: "CurrentUser",
                     tags: "Me",
                     exclude: %w(404),
                     parameters: [],
                     included_relationships: [:favorites],
                     success_description: "Returns the user currently logged in",
                     authorized_user: :admin

    include_examples "an API update request",
                     model: User,
                     resource_name: "CurrentUser",
                     request_id: false,
                     tags: "Me",
                     success_description: "Returns the updated user",
                     included_relationships: [:favorites],
                     authorized_user: :admin
  end
end
