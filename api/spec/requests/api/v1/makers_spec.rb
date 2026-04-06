# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Makers", type: :request do
  path "/makers" do
    it_behaves_like "an API create request", model: Maker, authorized_user: :admin
    it_behaves_like "an API index request", model: Maker
  end

  path "/makers/{id}" do
    it_behaves_like "an API show request", model: Maker
    it_behaves_like "an API update request", model: Maker, authorized_user: :admin
    it_behaves_like "an API destroy request", model: Maker, authorized_user: :admin
  end
end
