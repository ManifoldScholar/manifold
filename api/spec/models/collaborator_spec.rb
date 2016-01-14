require "rails_helper"

RSpec.describe Collaborator, type: :model do
  it "optionally belongs to a text" do
    collaborator = Collaborator.new
    text = Text.new
    collaborator.text = text
    expect(collaborator.text).to be text
  end

  it "optionally belongs to a project" do
    collaborator = Collaborator.new
    project = Project.new
    collaborator.project = project
    expect(collaborator.project).to be project
  end

  it "belongs to a maker" do
    collaborator = Collaborator.new
    maker = Maker.new
    collaborator.maker = maker
    expect(collaborator.maker).to be maker
  end
end
