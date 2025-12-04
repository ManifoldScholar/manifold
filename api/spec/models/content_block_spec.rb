# frozen_string_literal: true

require "rails_helper"

# :nocov:
module TestHelpers
  module BlockTests
    class RenderBlock < ContentBlock
      config.required_render_attributes = %i{render_attr_a render_attr_b}.freeze

      has_configured_attributes render_attr_a: :string,
                                render_attr_b: :boolean,
                                req_attr: :string

      validates :req_attr, presence: true
    end if Rails.env.test?
  end
end
# :nocov:

RSpec.describe ContentBlock do
  let(:content_block) { FactoryBot.create(:content_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:content_block)).to be_valid
  end

  it "has many ContentBlockReferences" do
    association = described_class.reflect_on_association :content_block_references
    expect(association.macro).to eq :has_many
  end

  describe "#reference_configurations" do
    it "returns an array of Content::ReferenceConfigurations" do
      expect(content_block.reference_configurations).to all(is_a?(Content::ReferenceConfiguration))
    end
  end

  describe "#reference_associations" do
    it "returns a hash of associations" do
      expect(content_block.reference_associations).to be_a Hash
    end
  end

  describe "#renderable?" do
    let(:project) { FactoryBot.create(:project) }

    context "when required_render_attributes are all present" do
      subject do
        subject = TestHelpers::BlockTests::RenderBlock.new
        subject.render_attr_a = "Set"
        subject.render_attr_b = true
        subject.req_attr = "Set"
        subject.project = project
        subject.save
        subject
      end

      it "is valid" do
        expect(subject.renderable?).to be true
      end
    end

    context "when required_render_attributes are not all present" do
      subject { TestHelpers::BlockTests::RenderBlock.create(project: project) }

      it "is invalid" do
        expect(subject.renderable?).to be false
      end
    end
  end

  describe "#render_errors" do
    subject { TestHelpers::BlockTests::RenderBlock.create(project: FactoryBot.create(:project)) }

    it "returns a hash of errors" do
      expect(subject.render_errors).to be_a Hash
    end

    it "includes render attribute errors" do
      expect(subject.render_errors.keys).to include :render_attr_a, :render_attr_b
    end

    it "does not include non-render attribute errors" do
      expect(subject.errors.attribute_names).to include :req_attr
      expect(subject.render_errors.keys).not_to include :req_attr
    end
  end

  describe "#incomplete_render_attributes" do
    subject { TestHelpers::BlockTests::RenderBlock.create(project: FactoryBot.create(:project)) }

    it "returns an array of incomplete render attributes" do
      expect(subject.incomplete_render_attributes).to contain_exactly(:render_attr_a, :render_attr_b)
    end
  end
end
