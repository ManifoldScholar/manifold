require "rails_helper"

RSpec.describe V1::PermissionSerializer do
  it_behaves_like "a serializer" do
    let(:object) { FactoryBot.build(factory) }
  end
end
