require "swagger_helper"

RSpec.describe "Me", type: :request do

  path "/me" do
    include_examples "an API show request",
                      model: User,
                      resource_name: "CurrentUser",
                      tags: "Users",
                      exclude: %w(404),
                      parameters: [],
                      included_relationships: [:favorites],
                      success_description: "Returns the user currently logged in",
                      summary: "Update the information associated with the user "\
                      "that is currently logged in based on the provided authorization token",
                      authorized_user: :admin

    include_examples "an API update request",
                      model: User,
                      resource_name: "CurrentUser",
                      request_id: false,
                      tags: "Users",
                      success_description: "Returns the updated user",
                      included_relationships: [:favorites],
                      summary: "Returns information about the user that is currently "\
                      "logged in based on the provided authorization token",
                      authorized_user: :admin
  end
end
