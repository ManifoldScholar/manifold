require "swagger_helper"

RSpec.describe "Subjects", type: :request do
  path "/subjects" do
    include_examples "an API index request", model: Subject, paginated: true
    include_examples "an API create request",
                      model: Subject,
                      authorized_user: :admin
  end

  path "/subjects/{id}" do
    include_examples "an API show request", model: Subject

    include_examples "an API update request",
                      model: Subject,
                      authorized_user: :admin

    include_examples "an API destroy request",
                      model: Subject,
                      authorized_user: :admin
  end
end
