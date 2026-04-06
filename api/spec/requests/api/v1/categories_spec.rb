# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Categories", type: :request do
  path "/categories/{id}" do
    it_behaves_like "an API show request", model: Category
    it_behaves_like "an API update request", model: Category, authorized_user: :admin
    it_behaves_like "an API destroy request", model: Category, authorized_user: :admin
  end
end
