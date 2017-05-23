require "rails_helper"

RSpec.describe Citable do

  let (:collection) { "the collection" }
  let (:title) { "the title" }
  let (:metadata) { { collection: collection }}
  let (:target) { { "title" => title, "collection" => collection } }

  shared_examples_for "a citable class" do

    let (:test_instance) { test_class.new(title, metadata)}

    it "has a citation_parts method" do
      expect(test_instance.respond_to?(:citation_parts)).to be true
    end

    it "returns a hash of citations parts" do
      expect(test_instance.citation_parts).to be_a Hash
    end

    it "returns a hash that is the block overlayed on the metadata" do
      expect(test_instance.citation_parts).to eq(target)
    end

  end

  context "when the including class calls with_citation using a block" do
    let (:test_class) do
      Struct.new(:title, :metadata) do
        include Citable

        with_citation do |model|
          {
            title: model.title
          }
        end

      end
    end
    it_behaves_like "a citable class"
  end

  context "when the including class calls with_citation using a symbol" do
    let (:test_class) do
      Struct.new(:title, :metadata) do
        include Citable

        with_citation :citation_builder

        def citation_builder
          {
            title: title
          }
        end

      end
    end
    it_behaves_like "a citable class"
  end

  context "when the including class does not call with_citation" do
    let (:test_class) do
      Struct.new(:title, :metadata) do
        include Citable
      end
    end
    let (:target) { { "collection" => collection } }
    it_behaves_like "a citable class"
  end

end


