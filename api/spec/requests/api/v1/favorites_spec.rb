require "swagger_helper"

RSpec.describe "Favorites", type: :request do
  context "my favorites" do
    let(:user_collected_project) { FactoryBot.create :user_collected_project, user: admin }
    let(:resource) { user_collected_project && Favorite.where(favoritable: user_collected_project.project, user: admin).first! }

    path "/me/relationships/favorites" do
      include_examples "an API index request",
                       parent: "current user",
                       tags: "Me",
                       model: Favorite,
                       authorized_user: :admin

      include_examples "an API create request",
                       parent: "current user",
                       model: Favorite,
                       tags: "Me",
                       authorized_user: :admin,
                       description: "If the favorite is valid, it will return the current user. "\
                       "If not, it will return the favorite. If the resource has already been "\
                       "favorited, the server will respond with a 422 code and a message that "\
                       "the resource is already taken.",
                       included_relationships: [:creator] do
        let(:project) { FactoryBot.create(:project) }
        let(:body) do
          build_json_structure(relationships: {
                                 favoritable: {
                                   data: {
                                     id: project.id,
                                     type: "project"
                                   }
                                 }
                               })
        end
      end
    end

    path "/me/relationships/favorites/{id}" do
      include_examples "an API show request",
                       tags: "Me",
                       parent: "current user",
                       model: Favorite,
                       authorized_user: :admin

      include_examples "an API destroy request",
                       tags: "Me",
                       parent: "current user",
                       model: Favorite,
                       authorized_user: :admin
    end
  end
end
