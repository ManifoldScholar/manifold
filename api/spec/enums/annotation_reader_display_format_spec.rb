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
    context "set on an annotation" do
      let(:owner) { FactoryBot.build :annotation, format: "annotation", reader_display_format: "block" }

      its "annotation is invalid" do
        expect(owner).not_to be_valid
      end
    end

    context "set on a resource notation" do
      let(:resource) { FactoryBot.build :resource, kind: "image" }
      let(:owner) { FactoryBot.build :annotation, format: "resource", reader_display_format: "block", resource: resource }

      its "notation is valid" do
        expect(owner).to be_valid
      end
    end
  end

  describe AnnotationReaderDisplayFormat::Embed do
    context "when notation resource not an embeddable type" do
      let(:resource) { FactoryBot.build :resource, kind: "image" }
      let(:owner) { FactoryBot.build :annotation, format: "resource", resource: resource, reader_display_format: "embed" }

      its "notation is invalid" do
        expect(owner).not_to be_valid
      end
    end

    context "when notation resource an embeddable type" do
      let(:resource) { FactoryBot.build :resource, kind: "video" }
      let(:owner) { FactoryBot.build :annotation, format: "resource", resource: resource, reader_display_format: "embed" }

      its "notation is valid" do
        expect(owner).to be_valid
      end
    end
  end
end
