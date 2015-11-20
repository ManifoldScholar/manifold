require "rails_helper"

RSpec.describe Ingestor::Strategy::EPUB3::Creator::TextSections do

  EpubInspector = Ingestor::Strategy::EPUB3::Inspector::EPUB
  TextSectionCreator = Ingestor::Strategy::EPUB3::Creator::TextSections
  SpineItemInspector = Ingestor::Strategy::EPUB3::Inspector::SpineItem

  before(:all) do
    path = "#{Rails.root}/spec/data/epubs/v3/trees.epub"
    logger = Rails.logger
    @epub_inspector = EpubInspector.new(path, logger)
    @text_sections_creator = TextSectionCreator.new(logger, @epub_inspector.metadata_node)
    @spine_item_nodes = @epub_inspector.spine_item_nodes
  end

  let(:text) do
    text = Text.new(:unique_identifier => '1234')
    allow(text).to receive(:find_ingestion_source_by_identifier) { IngestionSource.new() }
    return text
  end

  let(:created_models) do
    @text_sections_creator.create(@spine_item_nodes,
                                 @epub_inspector,
                                 text,
                                 text.text_sections)
  end

  it "responds to logger methods" do
    expect(@text_sections_creator).to respond_to(:info)
    expect(@text_sections_creator).to respond_to(:debug)
    expect(@text_sections_creator).to respond_to(:error)
    expect(@text_sections_creator).to respond_to(:warn)
  end

  it "creates a text section for each spine item" do
    expect(@spine_item_nodes.length > 0).to be true
    expect(created_models.length).to eq @spine_item_nodes.length
  end

  it "updates existing objects rather than create new ones" do
    @spine_item_nodes.each do |node|
      inspector = SpineItemInspector.new(node)
      text.text_sections.build(:source_identifier => inspector.idref)
    end
    expect(created_models.first).to eq(text.text_sections.first)
  end

end
