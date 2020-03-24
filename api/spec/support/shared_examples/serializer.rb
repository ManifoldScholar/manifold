require "rails_helper"

shared_examples_for "a serializer" do |partial_by_default: false|
  let(:serialized_object) { defined?(super) ? super() : nil }
  let(:subject) { described_class.new(object) }
  let(:factory) { described_class.to_s.demodulize.gsub("Serializer", "").underscore.to_sym }
  let(:object) { serialized_object || FactoryBot.create(factory) }

  it "successfully serializes the object to a String value" do
    expect(subject.serialized_json).to be_instance_of String
  end

  describe "because it is#{partial_by_default ? ' ' : ' not '}partial by default" do
    context "when full serialization is not requested" do
      if partial_by_default
        it "it sets meta.partial to true because this resource can be partial" do
          expect(subject.serializable_hash[:data][:meta][:partial]).to be true
        end
      else
        it "it sets meta.partial to false because this resource cannot be partial" do
          expect(subject.serializable_hash[:data][:meta][:partial]).to be false
        end
      end
    end
    context "when full serialization is requested" do
      let(:subject) { described_class.new(object, params: { full: true }) }

      if partial_by_default
        it "it sets meta.partial to false because this resource is not partial" do
          expect(subject.serializable_hash[:data][:meta][:partial]).to be false
        end
      else
        it "it sets meta.partial to false because this resource is always full" do
          expect(subject.serializable_hash[:data][:meta][:partial]).to be false
        end
      end
    end
  end
end
