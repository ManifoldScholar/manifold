# frozen_string_literal: true

require "rails_helper"

RSpec.describe Collaborator, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:collaborator)).to be_valid
  end

  it "optionally belongs to a text" do
    collaborator = described_class.new
    text = Text.new
    collaborator.collaboratable = text
    expect(collaborator.collaboratable).to be text
  end

  it "optionally belongs to a project" do
    collaborator = described_class.new
    project = Project.new
    collaborator.collaboratable = project
    expect(collaborator.collaboratable).to be project
  end

  it "belongs to a maker" do
    collaborator = described_class.new
    maker = Maker.new
    collaborator.maker = maker
    expect(collaborator.maker).to be maker
  end
end
