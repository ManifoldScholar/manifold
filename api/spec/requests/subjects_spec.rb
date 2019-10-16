require "swagger_helper"

RSpec.describe "Subject API", type: :request do
  let(:subject) { FactoryBot.create(:subject) }
  let(:id) { subject.id }

  path "/subjects" do
    include_examples "an API index request", model: Subject

    include_examples "an API create request", model: Subject
  end

  path "/subjects/{id}" do
    include_examples "an API show request", model: Subject

    include_examples "an API update request", model: Subject

    include_examples "an API destroy request", model: Subject
  end
end
