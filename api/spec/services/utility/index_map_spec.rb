require "rails_helper"

RSpec.describe Utility::IndexMap do
  let!(:index_map) { described_class.new key_method, type_constraint }
  let(:key_method) { :identifier }
  let(:type_constraint) { Types.Instance(index_class) }
  let(:index_class) do
    Class.new do
      extend Dry::Initializer

      param :identifier, Types::Coercible::String
    end
  end

  subject { index_map }

  it { is_expected.to have(0).items }
  its(:size) { is_expected.to be_zero }
  its(:length) { is_expected.to be_zero }
  its(:first) { is_expected.to be_nil }
  its(:last) { is_expected.to be_nil }

  def lookup_works!(key, expected)
    expect do
      expect(index_map[key]).to eq expected
    end.to execute_safely
  end

  def lookup_works_for!(item)
    lookup_works! item.public_send(key_method), item
  end

  context "with two items" do
    let!(:item_1) { index_class.new "foo" }
    let!(:item_2) { index_class.new "bar" }

    before :each do
      index_map << item_1
      index_map.store item_2
    end

    it { is_expected.to have(2).items }

    its(:size) { is_expected.to eq 2 }
    its(:length) { is_expected.to eq 2 }
    its(:first) { is_expected.to eq item_1 }
    its(:last) { is_expected.to eq item_2 }
    its(:to_a) { is_expected.to match_array [item_1, item_2] }
    its(:to_h) { is_expected.to eq item_1.identifier => item_1, item_2.identifier => item_2 }

    it "can look up by indexed key" do
      aggregate_failures "#[] works" do
        lookup_works_for! item_1
        lookup_works_for! item_2

        expect do
          index_map["doesnotexist"]
        end.to raise_error KeyError
      end
    end

    context "when adding an item with an already-existing identifier" do
      let!(:new_item) { index_class.new item_1.identifier }

      it "fails" do
        expect do
          index_map.store new_item
        end.to raise_error(Utility::IndexMap::AlreadyStoredObjectError)
      end
    end
  end
end
