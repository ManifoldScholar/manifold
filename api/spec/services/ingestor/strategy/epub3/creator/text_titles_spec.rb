require "rails_helper"

RSpec.describe Ingestor::Strategy::EPUB3::Creator::TextTitles do

  TextTitlesCreator = Ingestor::Strategy::EPUB3::Creator::TextTitles
  MetadataInspector = Ingestor::Strategy::EPUB3::Inspector::Metadata

  before(:all) do
    fragment_path = "#{Rails.root}/spec/data/epubs/fragments/metadata_node.xml"
    namespace = "http://purl.org/dc/elements/1.1/"
    @metadata_node = File.open(fragment_path) { |f| Nokogiri::XML(f) }
    @title_nodes = @metadata_node.xpath("//dc:title", "dc" => namespace)
    @titles_creator = TextTitlesCreator.new(Rails.logger, @metadata_node)
  end

  let(:created_models) do
    @titles_creator.create(@title_nodes)
  end

  it "responds to logger methods" do
    expect(@titles_creator).to respond_to(:info)
    expect(@titles_creator).to respond_to(:debug)
    expect(@titles_creator).to respond_to(:error)
    expect(@titles_creator).to respond_to(:warn)
  end

  it "creates a text section for each spine item" do
    expect(@title_nodes.length > 0).to be true
    expect(created_models.length).to eq @title_nodes.length
  end

  it "updates existing objects rather than create new ones" do
    text = Text.new(:unique_identifier => '1234')
    @title_nodes.each do |node|
      node_inspector = MetadataInspector.new(node, @metadata_node)
      text.titles.build(:value => node_inspector.text.presence)
    end
    expect(@titles_creator.create(@title_nodes, text.titles).first).to eq(text.titles.first)
  end

end
