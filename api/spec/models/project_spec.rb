require 'rails_helper'

RSpec.describe Project, :type => :model do

  it "has many collaborators" do
    project = Project.new
    5.times { project.collaborators << Collaborator.new }
    expect(project.collaborators.length).to be 5
  end

  it "has many creators" do
    project = Project.new
    2.times { project.creators.build() }
    expect(project.creators.length).to be 2
  end

  it "has many texts" do
    project = Project.new
    3.times { project.texts.build() }
    expect(project.texts.length).to be 3
  end

  it "has many contributors" do
    project = Project.new
    2.times { project.contributors.build() }
    expect(project.contributors.length).to be 2
  end

  it { is_expected.to have_attached_file(:cover) }
  it { is_expected.to_not validate_attachment_presence(:cover) }
  it { is_expected.to validate_attachment_content_type(:cover).
    allowing('image/png', 'image/gif', 'image/jpg', 'image/jpeg', 'image/svg+xml').
    rejecting('text/plain', 'text/xml') }

end
