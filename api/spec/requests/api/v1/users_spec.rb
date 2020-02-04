require "swagger_helper"

RSpec.describe "User", type: :request do
  path "/users" do
    include_examples "an API index request", model: User, authorized_user: :admin
    include_examples "an API create request", model: User
  end
  path "/users/{id}" do
    include_examples "an API show request", model: User, authorized_user: :admin
    include_examples "an API update request", model: User, authorized_user: :admin
    include_examples "an API destroy request", model: User, authorized_user: :admin
  end

  path "/users/whoami" do
    include_examples "an API show request",
                     model: User,
                     authorized_user: :admin,
                     parameters: [],
                     summary: "Retrieve the authenticated user",
                     success_description: "Returns the User that is currently logged in",
                     exclude: %w(404 401)
  end
end
