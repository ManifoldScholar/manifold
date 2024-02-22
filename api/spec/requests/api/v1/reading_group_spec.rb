# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Reading Group", type: :request do
  path "/reading_groups" do
    include_examples "an API create request", model: ReadingGroup, authorized_user: :admin
    include_examples "an API index request", model: ReadingGroup, authorized_user: :admin
  end

  path "/reading_groups/{id}" do
    include_examples "an API destroy request", model: ReadingGroup, authorized_user: :admin
    include_examples "an API show request", model: ReadingGroup, authorized_user: :admin
    include_examples "an API update request", model: ReadingGroup, authorized_user: :admin
  end

  path "/me/relationships/reading_groups" do
    include_examples "an API index request",
                     tags: "Me",
                     model: ReadingGroup,
                     parent: "current user",
                     paginated: true,
                     exclude: %w(401),
                     authorized_user: :reader
  end
end
