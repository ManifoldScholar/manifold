require "rails_helper"

RSpec.describe V1::ErrorSerializer do
  let(:subject) { described_class.new(errors) }
  let(:project) do
    project = Project.new
    project.save
    project
  end
  let(:errors) { ::V1::Helpers::Errors.new(project.errors).for_serialization }

  it "successfully serializes the object to a String value" do
    expect(subject.serialized_json).to be_instance_of String
  end

  describe "the serializable hash" do
    let(:serialized) { subject.serializable_hash }
    let(:serialized_keys) { serialized.keys }
    let(:serialized_errors) { serialized[:errors] }

    it "is a hash" do
      expect(serialized).to be_instance_of Hash
    end

    it "it has one key, which is 'errors'" do
      expect(serialized_keys.length).to be 1
      expect(serialized_keys[0]).to be :errors
    end

    it "the errors property is an array" do
      expect(serialized_errors).to be_instance_of Array
    end

    it "contains the correct number of errors" do
      expect(project.errors.count).to eq serialized_errors.length
    end

    describe "the first error" do
      let(:serialized_error) { serialized_errors.first }

      it "has a detail property" do
        expect(serialized_error.key?(:detail)).to be true
        expect(serialized_error[:detail]).to be_a String
      end
    end
  end
end
