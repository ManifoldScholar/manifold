require "swagger_helper"

RSpec.describe "Categories", type: :request do
  path "/categories/{id}" do
    include_examples "an API show request", model: Category
    include_examples "an API update request", model: Category, authorized_user: :admin
    include_examples "an API destroy request", model: Category, authorized_user: :admin
  end
end
