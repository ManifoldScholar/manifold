require "rails_helper"

RSpec.describe Ingestor::Strategy::EPUB::Inspector::ManifestItem do

  inspector_class = Ingestor::Strategy::EPUB::Inspector::ManifestItem

  let(:doc) {
    Nokogiri('
    <manifest>
      <item id="css-003" properties="rambo" href="css/css_file_2.css" media-type="text/css" />
      <item />
    </manifest>
    ')
  }

  let(:first_node) {
    doc.root.first_element_child
  }

  let(:last_node) {
    doc.root.last_element_child
  }


  let(:inspector) { inspector_class.new(first_node) }
  let(:no_attribute_node_inspector) { inspector_class.new(last_node) }

  it "returns the node ID" do
    expect(inspector.id).to eq("css-003")
  end

  it "returns the node href" do
    expect(inspector.href).to eq("css/css_file_2.css")
  end

  it "returns the node properties" do
    expect(inspector.properties).to eq("rambo")
  end

  it "returns empty string when an attribute does not exist" do
    expect(no_attribute_node_inspector.id).to eq("")
  end

end
