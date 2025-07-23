# frozen_string_literal: true

require "rails_helper"

RSpec.describe AnnotationReaderDisplayFormat, :enum do
  let(:instance) do
    described_class.new.tap do |enum|
      enum.owner = owner
    end
  end

  subject { instance }

  let(:owner) { nil }

  describe AnnotationReaderDisplayFormat::Block do
    context "when not a resource notation" do
      let(:owner) { FactoryBot.build :annotation, format: "annotation" }

      it { is_expected.to be_invalid }
    end

    context "when a resource notation" do
      let(:owner) { FactoryBot.build :annotation, format: "resource" }

      it { is_expected.to be_valid }
    end
  end

  describe AnnotationReaderDisplayFormat::Embed do
    context "when not an embeddable type" do
      let(:resource) { FactoryBot.build :resource, kind: "image" }
      let(:owner) { FactoryBot.build :annotation, format: "resource", resource: resource }

      it { is_expected.to be_invalid }
    end

    context "when an embeddable type" do
      let(:resource) { FactoryBot.build :resource, kind: "video" }
      let(:owner) { FactoryBot.build :annotation, format: "resource", resource: resource }

      it { is_expected.to be_valid }
    end
  end
end
