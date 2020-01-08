require "swagger_helper"

RSpec.describe "Pages", type: :request do
  path "/pages" do
    include_examples "an API create request", model: Page, authorized_user: :admin
    include_examples "an API index request", model: Page
  end

  path "/pages/{id}" do
    include_examples "an API show request", model: Page
    include_examples "an API update request", model: Page, authorized_user: :admin
    include_examples "an API destroy request", model: Page, authorized_user: :admin
  end
end
