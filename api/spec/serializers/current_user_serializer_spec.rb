require "rails_helper"

RSpec.describe V1::CurrentUserSerializer do
  it_behaves_like "a serializer" do
    let(:factory) { :user }
  end
end
