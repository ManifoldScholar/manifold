require "rails_helper"

RSpec.describe Ingestor::Strategy::EPUB3::Creator::Makers do

  let(:metadata_node) { File.open("#{Rails.root}/spec/data/epubs/fragments/metadata_node.xml") { |f| Nokogiri::XML(f) }}
  let(:creator_nodes) { metadata_node.xpath("//dc:creator", "dc" => "http://purl.org/dc/elements/1.1/") }
  let(:makers) { Ingestor::Strategy::EPUB3::Creator::Makers.new(Rails.logger, metadata_node) }

  it "responds to logger methods" do
    expect(makers).to respond_to(:info)
    expect(makers).to respond_to(:debug)
    expect(makers).to respond_to(:error)
    expect(makers).to respond_to(:warn)
  end

  it "creates a maker for each metadata creator node" do
    models = makers.create(creator_nodes, nil, "creator")
    expect(models.length).to eq(creator_nodes.length)
  end

  it "updates existing objects rather than create new ones" do
    text = Text.new(:unique_identifier => '1234')
    text.creators.build(name: 'Alfred Hitchcock', sort_name: "")
    text.creators.build(name: 'Wim Wenders', sort_name: "")
    models = makers.create(creator_nodes, text.creators, "creator")
    expect(models.first).to eq(text.creators.first)
  end

  it "creates new objects if none exist" do
    models = makers.create(creator_nodes)
    expect(models.length).to be(2)
  end


end
