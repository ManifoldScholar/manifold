require "swagger_helper"

RSpec.describe "Favorites", type: :request do
  context "my favorites" do
    let(:resource) { FactoryBot.create(:favorite, user: admin) }

    path "/me/relationships/favorites" do
      include_examples "an API index request",
                       model: Favorite,
                       authorized_user: :admin

      include_examples "an API create request",
                       model: Favorite,
                       authorized_user: :admin,
                       description: "If the favorite is valid, it will return the current user. "\
                       "If not, it will return the favorite. If the resource has already been "\
                       "favorited, the server will respond with a 422 code and a message that "\
                       "the resource is already taken.",
                       included_relationships: [:creator] do
        let(:comment) { FactoryBot.create(:comment) }
        let(:body) do
          build_json_structure(relationships: {
                           favoritable: {
                             data: {
                               id: comment.id,
                               type: "comment"
                             }
                           }
                         })
        end
      end
    end

    path "/me/relationships/favorites/{id}" do
      include_examples "an API show request",
                       model: Favorite,
                       authorized_user: :admin

      include_examples "an API destroy request",
                       model: Favorite,
                       authorized_user: :admin
    end
  end
end
