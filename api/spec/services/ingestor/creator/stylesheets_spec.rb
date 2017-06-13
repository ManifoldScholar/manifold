require "rails_helper"

RSpec.describe Ingestor::Creator::Stylesheets do

  def double_builder(num)
    double("Inspector",
           name: num,
           source_identifier: num,
           raw_styles: "body { color: red }",
           ingestion_source: IngestionSource.new
    )
  end

  let(:text) { FactoryGirl.create(:text) }
  let(:creator) { Ingestor::Creator::Stylesheets.new(Rails.logger, text) }
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

  it "maintains boolean attributes" do
    inspector = double_builder("1")
    attr = creator.attributes_with_defaults(inspector)
    expect(attr[:ingested]).to be true
  end

  it "creates a stylesheet for each inspector" do
    models = creator.create(inspectors)
    expect(models.length).to eq(inspectors.length)
  end

  it "updates existing objects rather than create new ones" do
    FactoryGirl.create(:stylesheet, text: text, source_identifier: "1")
    FactoryGirl.create(:stylesheet, text: text, source_identifier: "2")
    FactoryGirl.create(:stylesheet, text: text, source_identifier: "3")
    models = creator.create(inspectors, text.stylesheets)
    models.each(&:save)
    expect(text.stylesheets.count).to eq 3
    expect(text.stylesheets.pluck(:id)).to match_array models.pluck(:id)
  end

  it "sets the ingeseted property on existing stylesheets correctly" do
    FactoryGirl.create(:stylesheet, text: text, source_identifier: "1", ingested: false)
    models = creator.create([double_builder("1")], text.stylesheets)
    models.each(&:save)
    expect(models.first.ingested).to eq true
  end


end
