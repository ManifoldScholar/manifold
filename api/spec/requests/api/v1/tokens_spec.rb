require "swagger_helper"

RSpec.describe "Tokens", type: :request do
  include_context("authenticated request")

  before(:each) do
    admin.touch
  end

  let(:email) { admin_email }

  path "/tokens" do
    include_examples "an API create request",
                     model: User,
                     tags: "Token",
                     resource_name: "CurrentUser",
                     exclude: %w(404),
                     additional_parameters: [
                       { name: "email", in: :query, type: :string },
                       { name: "password", in: :query, type: :string }
                     ],
                     included_relationships: [:favorites],
                     request_body: false,
                     success_response_code: "200",
                     description: "Returns all information about the user "\
                     "(as well as a login token) when given the proper username "\
                     "and password.\n\nThe meta tag containing the authToken exists at "\
                     "the top level in the response like so:\n"\
                     '{ "data": {}, "meta": {"authToken": "...."}, "included": [] }',
                     summary: "Retrieve an authentication token"
  end
end
