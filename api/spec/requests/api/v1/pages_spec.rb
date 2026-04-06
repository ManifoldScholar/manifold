# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Pages", type: :request do
  path "/pages" do
    it_behaves_like "an API create request", model: Page, authorized_user: :admin
    it_behaves_like "an API index request", model: Page
  end

  path "/pages/{id}" do
    it_behaves_like "an API show request", model: Page
    it_behaves_like "an API update request", model: Page, authorized_user: :admin
    it_behaves_like "an API destroy request", model: Page, authorized_user: :admin
  end
end
