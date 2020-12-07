require "rails_helper"

RSpec.describe Analytics::RecordSearchEvent do

  let!(:visit) { FactoryBot.create(:analytics_visit) }
  let(:properties) { { keyword: Faker::Lorem.sentence } }

  it "should record a search event" do
    expect do
      described_class.run analytics_visit: visit, properties: properties
    end.to change{Analytics::Event.where(name: "search").count}.by 1
  end

end
