require "rails_helper"

RSpec.describe V1::EntitlerSerializer do
  it_behaves_like "a serializer" do
    let(:factory) { :entitler }
  end
end
