require "swagger_helper"

RSpec.describe "Contacts", type: :request do
  path "/contacts" do
    post "Sends an email to Manifold's contact address" do
      tags "Contacts"
      consumes "application/json"
      parameter name: :body, in: :body, schema: APIDocumentation::DryTypesParser.convert(
        Types::Hash.schema(
          data: Types::Hash.schema(
            attributes: Types::Hash.schema(
              email: Types::String,
              full_name: Types::String,
              message: Types::String
            )
          )
        )
      )

      response "204", "Sent the email" do
        let(:body) do
          {
            data: {
              attributes: {
                email: "email@email.com",
                full_name: "John Rambo",
                message: "Hello world"
              }
            }
          }
        end
        run_test!
      end

      response "422", "Improper request information" do
        let(:body) do
          {
            data: {
              attributes: {
                full_name: "John Rambo",
                message: "Hello world"
              }
            }
          }
        end
        run_test!
      end
    end
  end
end
