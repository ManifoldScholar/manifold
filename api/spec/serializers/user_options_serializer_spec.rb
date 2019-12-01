require "rails_helper"

RSpec.describe V1::UserOptionsSerializer do
  it_behaves_like "a serializer" do
    let(:factory) { :user }
  end
end
