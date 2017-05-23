require "rails_helper"
require "models/concerns/citable_spec.rb"

RSpec.describe TextSection, type: :model do

  it "has a valid factory" do
    expect(FactoryGirl.build(:text_section)).to be_valid
  end

  it "belongs to a text" do
    text_section = TextSection.new
    text = Text.new
    text_section.text = text
    expect(text_section.text).to be text
  end

  it "belongs to a project" do
    text_section = FactoryGirl.create(:text_section)
    expect(text_section.project).to be_a Project
  end

  it "belongs to an ingestion source" do
    text_section = TextSection.new
    ingestion_source = IngestionSource.new
    text_section.ingestion_source = ingestion_source
    expect(text_section.ingestion_source).to be ingestion_source
  end

end
