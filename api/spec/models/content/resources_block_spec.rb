# frozen_string_literal: true

require "rails_helper"

RSpec.describe Content::ResourcesBlock do
  let(:resource) { FactoryBot.create(:resource) }
  let(:resources_block) { FactoryBot.create(:resources_block, project: resource.project) }

  subject { resources_block }

  it "has a valid factory" do
    expect(FactoryBot.build(:resources_block)).to be_valid
  end

  it "is configurable" do
    expect(resources_block.configurable?).to be true
  end

  it "responds to :featured_collections" do
    expect(resources_block.respond_to?(:featured_collections)).to be true
  end

  describe "#renderable?" do
    it { is_expected.to be_renderable }
  end

  it_behaves_like "a model with formatted attributes"
end
