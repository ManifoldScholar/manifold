require "rails_helper"

RSpec.describe Ingestor::Creator::TextTitles do

  def double_builder(num)
    double("Inspector",
           value: "#{num}",
           position: num.to_i,
           kind: TextTitle::KIND_MAIN
    )
  end

  let(:text) { FactoryGirl.create(:text) }
  let(:creator) { Ingestor::Creator::TextTitles.new(Rails.logger, text) }
  let(:inspectors) { [
    double_builder("1"),
    double_builder("2"),
    double_builder("3")
  ]}

  it "responds to logger methods" do
    expect(creator).to respond_to(:info)
    expect(creator).to respond_to(:debug)
    expect(creator).to respond_to(:error)
    expect(creator).to respond_to(:warn)
  end

  it "creates an stylesheet for each inspector" do
    models = creator.create(inspectors)
    expect(models.length).to eq(inspectors.length)
  end

  it "updates existing objects rather than create new ones" do
    FactoryGirl.create(:text_title, value: "1")
    FactoryGirl.create(:text_title, value: "1")
    FactoryGirl.create(:text_title, value: "1")
    models = creator.create(inspectors, text.titles)
    models.each(&:save)
    expect(text.titles.count).to eq 3
    expect(text.titles.pluck(:id)).to match_array models.pluck(:id)
  end

end
