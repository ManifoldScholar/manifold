# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Subjects", type: :request do
  path "/subjects" do
    it_behaves_like "an API index request", model: Subject, paginated: true
    it_behaves_like "an API create request",
                      model: Subject,
                      authorized_user: :admin
  end

  path "/subjects/{id}" do
    it_behaves_like "an API show request", model: Subject

    it_behaves_like "an API update request",
                      model: Subject,
                      authorized_user: :admin

    it_behaves_like "an API destroy request",
                      model: Subject,
                      authorized_user: :admin
  end
end
