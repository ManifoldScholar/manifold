require "rails_helper"

RSpec.describe Ingestor::Strategy::EPUB3::Creator::BaseCreator do

  let(:metadata_node) { File.open("#{Rails.root}/spec/data/epubs/fragments/metadata_node.xml") { |f| Nokogiri::XML(f) }}
  let(:creator_nodes) { metadata_node.xpath("//dc:creator", "dc" => dc) }
  let(:creator) { Ingestor::Strategy::EPUB3::Creator::BaseCreator.new(Rails.logger, metadata_node) }

  it 'responds to logger methods' do
    expect(creator).to respond_to(:info)
    expect(creator).to respond_to(:debug)
    expect(creator).to respond_to(:error)
    expect(creator).to respond_to(:warn)
  end

end
