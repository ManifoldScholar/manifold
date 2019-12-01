require "rails_helper"

RSpec.describe V1::StatisticsSerializer do
  it_behaves_like "a serializer" do
    let(:object) { Statistics.new }
  end
end
