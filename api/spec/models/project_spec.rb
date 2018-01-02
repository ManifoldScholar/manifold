require "rails_helper"

RSpec.describe Project, type: :model do
  it "has a valid factory" do
    expect(FactoryGirl.build(:project)).to be_valid
  end

  it "updates the sort_title when saved" do
    project = FactoryGirl.build(:project, title: "A Hobbit's Journey")
    project.save
    expect(project.sort_title).to eq "Hobbit's Journey"
    project.title = "The end of the world"
    project.save
    expect(project.sort_title).to eq "end of the world"
  end

  it "has many collaborators" do
    project = Project.new
    5.times { project.collaborators << Collaborator.new }
    expect(project.collaborators.length).to be 5
  end

  it "has many creators" do
    project = Project.new
    2.times { project.creators.build }
    expect(project.creators.length).to be 2
  end

  it "has many texts" do
    project = Project.new
    3.times { project.texts.build }
    expect(project.texts.length).to be 3
  end

  it "has many project_subjects" do
    project = Project.new
    3.times { project.project_subjects.build }
    expect(project.project_subjects.length).to be 3
  end

  it "has many contributors" do
    project = Project.new
    2.times { project.contributors.build }
    expect(project.contributors.length).to be 2
  end

  it "has a cover attachment" do
    is_expected.to have_attached_file(:cover)
  end

  it "does not require a cover" do
    is_expected.to_not validate_attachment_presence(:cover)
  end

  it "validates the cover attachment type" do
    is_expected.to validate_attachment_content_type(:cover)
      .allowing("image/png", "image/gif", "image/jpg", "image/jpeg", "image/svg+xml")
      .rejecting("text/plain", "text/xml")
  end

  it "is valid with a creator" do
    creator = FactoryGirl.create(:user)
    project = FactoryGirl.create(:project, creator: creator)
    expect(project).to be_valid
  end

  it "is invalid without a creator" do
    project = FactoryGirl.build(:project, creator: nil)
    expect(project).to_not be_valid
  end

  it "triggers an event on create" do
    expect {
      project = FactoryGirl.create(:project)
    }.to have_enqueued_job(CreateEventJob)
  end

  it "does not trigger an event on new" do
    expect {
      project = FactoryGirl.build(:project)
    }.to_not have_enqueued_job(CreateEventJob)
  end

  it "is created as a draft" do
    project = FactoryGirl.build(:project)
    expect(project.draft).to be(true)
  end

  it "is invalid without draft state" do
    project = FactoryGirl.build(:project, draft: nil)
    expect(project).to_not be_valid
  end

  it "reports that it's following twitter accounts if at least one twitter_query association" do
    project = FactoryGirl.build(:project)
    FactoryGirl.create(:twitter_query, project: project)
    expect(project.following_twitter_accounts?).to be true
  end

  it "reports that it's not following twitter accounts if none are configured" do
    project = FactoryGirl.build(:project, tweet_fetch_config: {})
    expect(project.following_twitter_accounts?).to be false
  end

  it "correctly returns the uncollected resource count" do
    project = FactoryGirl.create(:project)
    collection = FactoryGirl.create(:collection, project: project)
    resource_1 = FactoryGirl.create(:resource, project: project)
    resource_2 = FactoryGirl.create(:resource, project: project)
    resource_3 = FactoryGirl.create(:resource, project: project)
    collection_resource = FactoryGirl.create(
      :collection_resource,
      resource: resource_1,
      collection: collection
    )
    expect(project.uncollected_resources.count).to be 2
  end

  context "can be searched", :slow, :elasticsearch do

    it "by title" do
      @project_a = FactoryGirl.create(:project, title: "Bartholomew Smarts", featured: true)
      @project_b = FactoryGirl.create(:project, title: "Rambo Smarts", featured: true)
      Project.reindex
      Project.searchkick_index.refresh
      results = Project.filter({keyword: "Bartholomew"})
      expect(results.length).to be 1
      results = Project.filter({keyword: "Smarts"})
      expect(results.length).to be 2
    end
  end

  context "can be filtered" do

    before(:each) do
      @subject_a = FactoryGirl.create(:subject, name: "subject_a")
      @subject_b = FactoryGirl.create(:subject, name: "subject_b")
      @project_a = FactoryGirl.create(:project, title: "project_a", featured: true)
      @project_b = FactoryGirl.create(:project, title: "project_b", featured: false)
      @project_a.subjects = [@subject_a]
      @project_b.subjects = [@subject_b]
      @project_a.save
      @project_b.save
    end

    it "to only include featured" do
      results = Project.filter({featured: true})
      expect(results.length).to be 1
    end

    it "to only include not featured" do
      results = Project.filter({featured: false})
      expect(results.length).to be 1
    end

    it "to only include projects of a specific subject" do
      results = Project.filter({subject: @subject_a})
      expect(results.first).to eq @project_a
      results = Project.filter({subject: @subject_b})
      expect(results.first).to eq @project_b
    end

    it "by both subject and featured" do
      results = Project.filter({subject: @subject_a, featured: false})
      expect(results.length).to be 0
      results = Project.filter({subject: @subject_a, featured: true})
      expect(results.length).to be 1
    end

    it "allows boolean and string featured values" do
      results = Project.filter({featured: "true"})
      expect(results.length).to be 1
    end

    it "allows treats 1 as true when filtering" do
      results = Project.filter({featured: "1"})
      expect(results.length).to be 1
      results = Project.filter({featured: 1})
      expect(results.length).to be 1
    end

  end

  describe "its metadata" do

    it "can be set" do
      p = FactoryGirl.build(:project)
      p.metadata = { "isbn" => "1234" }
      p.save
      expect(p.metadata["isbn"]).to eq "1234"
    end

    it "filters out invalid metadata" do
      p = FactoryGirl.build(:project)
      p.metadata = { "isbn" => "1234", "foo" => "bar" }
      p.save
      expect(p.metadata).to eq({ "isbn" => "1234" })
    end

    it "filters out blank metadata" do
      p = FactoryGirl.build(:project)
      p.metadata = { "isbn" => "1234", "foo" => "" }
      p.save
      expect(p.metadata).to eq({ "isbn" => "1234" })
    end

  end

  context "when avatar is present" do
    let(:avatar_path) { File.join("spec", "data", "assets", "images", "test_avatar.jpg") }
    let(:avatar) { File.new(avatar_path) }

    it "is valid without avatar color" do
      project = FactoryGirl.build(:project, avatar: avatar)
      expect(project).to be_valid
    end
  end

  context "when avatar is not present" do
    it "is invalid without an avatar color" do
      project = FactoryGirl.build(:project, avatar_color: nil)
      expect(project).to_not be_valid
    end

    it "is invalid with an avatar color not in list" do
      project = FactoryGirl.build(:project, avatar_color: "none more black")
      expect(project).to_not be_valid
    end
  end

end
