require "rails_helper"

RSpec.describe "Reading Group Abilities", :authorizer do
  let(:user) { FactoryBot.create :user }

  subject { user }

  context "when the subject is a reader" do
    let(:user) { FactoryBot.create(:user, :reader) }

    it { is_expected.to be_able_to(:read, :create, :update, :delete).on(ReadingGroup) }

    context "when the reading group was created by the reader" do
      let(:object) { FactoryBot.create :reading_group, creator: subject }
      the_subject_behaves_like "instance abilities", ReadingGroup, all: true
    end

    context "when the reading group was not created by the reader" do
      let(:object) { FactoryBot.create :reading_group }
      the_subject_behaves_like "instance abilities", ReadingGroup, none: true
    end

    context "when the reading group is public and was not created by the reader" do
      let(:object) { FactoryBot.create :reading_group, privacy: "public" }
      the_subject_behaves_like "instance abilities", ReadingGroup, read_only: true
    end
  end

  context "when reading groups are disabled" do
    before(:all) do
      settings = Settings.instance
      settings.general[:disable_reading_groups] = true
      settings.save
    end

    after(:all) do
      settings = Settings.instance
      settings.general[:disable_reading_groups] = false
      settings.save
    end

    context "when the reading group was created by the reader" do
      let(:object) { FactoryBot.create :reading_group, creator: subject }
      the_subject_behaves_like "instance abilities", ReadingGroup, read: false, create: false, update: true, delete: true
    end

    context "when the reading group is public and was not created by the reader" do
      let(:object) { FactoryBot.create :reading_group, privacy: "public" }
      the_subject_behaves_like "instance abilities", ReadingGroup, none: true
    end
  end
end
