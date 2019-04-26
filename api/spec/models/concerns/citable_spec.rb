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


  with_model :CitableClass do
    table do |t|
      t.string :title
      t.string :subtitle
      t.jsonb :citations, default: {}
    end

    model do
      include Citable

      has_many :children, class_name: 'CitableChild'

      with_citation do |citable_class|
        {
          title: citable_class.title,
          author: "Rowan Ono",
          issued: "10/03/2013"
        }
      end

      with_citable_children :children
    end
  end

  with_model :CitableChild do
    table do |t|
      t.jsonb :citations, default: {}
      t.belongs_to :citable_class, index: { name: "index_name" }
    end

    model do
      include Citable

      belongs_to :citable_class

      with_citation do |child|
        child.citable_class.citation_parts
      end
    end
  end

  describe "with_citable_children" do
    let!(:parent) { CitableClass.create(title: "Initial") }
    let!(:child) { CitableChild.create(citable_class_id: parent.id) }

    context "when citations change" do
      it "updates the child citations" do
        expect do
          perform_enqueued_jobs do
            parent.title = "Updated"
            parent.save
          end

          child.reload
        end.to change(child, :citations)
      end
    end

    context "when citations do not change" do
      it "does not update the child citations" do
        expect do
          perform_enqueued_jobs do
            parent.subtitle = "Updated"
            parent.save
          end
        end.to_not change(child, :citations)
      end
    end
  end

end


