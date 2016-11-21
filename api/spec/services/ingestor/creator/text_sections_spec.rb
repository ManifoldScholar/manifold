require "rails_helper"

RSpec.describe Ingestor::Creator::TextSections do

  def double_builder(num)
    double("Inspector",
           name: num,
           source_identifier: num,
           source_body: "<html><body><p>rambo</p></body></html>",
           ingestion_source: IngestionSource.new,
           kind: TextSection::KIND_SECTION
    )
  end

  let(:text) { FactoryGirl.create(:text) }
  let(:creator) { Ingestor::Creator::TextSections.new(Rails.logger, text) }
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
    FactoryGirl.create(:text_section, text: text, source_identifier: "1")
    FactoryGirl.create(:text_section, text: text, source_identifier: "2")
    FactoryGirl.create(:text_section, text: text, source_identifier: "3")
    models = creator.create(inspectors, text.text_sections)
    models.each(&:save)
    expect(text.text_sections.count).to eq 3
    expect(text.text_sections.pluck(:id)).to match_array models.pluck(:id)
  end

end
