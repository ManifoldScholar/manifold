require "rails_helper"

RSpec.describe Project, type: :model do
  it "has a valid factory" do
    expect(FactoryGirl.build(:project)).to be_valid
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

  it "returns an array when tweet_fetch_config is not configured" do
    project = FactoryGirl.build(:project, tweet_fetch_config: {})
    expect(project.twitter_following).to be_a Array
  end

  it "transforms twitter_following to HashWIthIndifferentAccess" do
    project = FactoryGirl.build(:project, tweet_fetch_config: {
      following: [
        {user: "someUser", hashtag: "SomeHashTag"}
      ]
    })
    following = project.twitter_following
    expect(following[0][:user]).to be_a String
  end

  it "reports that it's not following twitter accounts if none are configured" do
    project = FactoryGirl.build(:project, tweet_fetch_config: {
      following: [
        {user: "someUser", hashtag: "SomeHashTag"}
      ]
    })
    expect(project.following_twitter_accounts?).to be true
  end

  it "reports that it's not following twitter accounts if at least one isconfigured" do
    project = FactoryGirl.build(:project, tweet_fetch_config: {})
    expect(project.following_twitter_accounts?).to be false
  end

end
