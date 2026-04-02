# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Reading Group", type: :request do
  path "/reading_groups" do
    it_behaves_like "an API create request", model: ReadingGroup, authorized_user: :admin
    it_behaves_like "an API index request", model: ReadingGroup, authorized_user: :admin
  end

  path "/reading_groups/{id}" do
    it_behaves_like "an API destroy request", model: ReadingGroup, authorized_user: :admin
    it_behaves_like "an API show request", model: ReadingGroup, authorized_user: :admin
    it_behaves_like "an API update request", model: ReadingGroup, authorized_user: :admin
  end

  path "/me/relationships/reading_groups" do
    it_behaves_like "an API index request",
                     tags: "Me",
                     model: ReadingGroup,
                     parent: "current user",
                     paginated: true,
                     exclude: %w(401),
                     authorized_user: :reader
  end
end
