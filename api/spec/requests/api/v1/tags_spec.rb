# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Tags", type: :request do
  path "/tags" do
    it_behaves_like "an API index request", model: Tag
  end
end
