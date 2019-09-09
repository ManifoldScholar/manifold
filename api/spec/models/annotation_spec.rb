require "rails_helper"

RSpec.describe Annotation, type: :model do

  before(:each) do
    @annotation = FactoryBot.build(:annotation)
  end

  it "has a valid annotation factory" do
    expect(FactoryBot.build(:annotation)).to be_valid
  end

  it "has a valid resource annotation factory" do
    expect(FactoryBot.build(:resource_annotation)).to be_valid
  end

  it "knows what project it belongs to" do
    @annotation.save
    expect(@annotation.project).to eq @annotation.text_section.text.project
  end

  it "is invalid when start_node is blank" do
    @annotation.start_node = ""
    expect(@annotation).to_not be_valid
  end

  it "is invalid when end_node is blank" do
    @annotation.end_node = ""
    expect(@annotation).to_not be_valid
  end

  it "is invalid when start_char is blank" do
    @annotation.start_char = ""
    expect(@annotation).to_not be_valid
  end

  it "is valid when start_char is 0" do
    @annotation.start_char = 0
    expect(@annotation).to be_valid
  end

  it "is invalid when start_char is not an integer" do
    @annotation.start_char = "zero"
    expect(@annotation).to_not be_valid
  end

  it "is invalid when end_char is blank" do
    @annotation.end_char = ""
    expect(@annotation).to_not be_valid
  end

  it "is valid when end_char is 0" do
    @annotation.end_char = 0
    expect(@annotation).to be_valid
  end

  it "is invalid when end_char is not an integer" do
    @annotation.end_char = "zero"
    expect(@annotation).to_not be_valid
  end

  it "is invalid when format is blank" do
    @annotation.format = ""
    expect(@annotation).to_not be_valid
  end

  it "is invalid when format is not in list" do
    @annotation.format = "rowan"
    expect(@annotation).to_not be_valid
  end

  it "is invalid when subject is blank" do
    @annotation.subject = ""
    expect(@annotation).to_not be_valid
  end

  it "is valid when subject is single space character" do
    @annotation.subject = " "
    expect(@annotation).to be_valid
  end

  it "invalid without a creator" do
    @annotation.creator = nil
    expect(@annotation).to_not be_valid
  end

  it "enqueues a TEXT_ANNOTATED event on creation" do
    text_section = FactoryBot.create(:text_section)
    expect(CreateEventJob).to receive(:perform_later).with(EventType[:text_annotated], any_args)
    FactoryBot.create(:annotation, text_section: text_section)
  end

  context "with notation" do
    it "is invalid without a resource if format is resource" do
      @annotation.format = "resource"
      expect(@annotation).to_not be_valid
    end

    it "is valid with a resource if format is resource" do
      resource = FactoryBot.create(:resource)
      @annotation.format = "resource"
      @annotation.resource = resource
      expect(@annotation).to be_valid
    end

    it "is invalid without a collection if format is collection" do
      @annotation.format = "resource_collection"
      expect(@annotation).to_not be_valid
    end

    it "is valid with a collection if format is collection" do
      collection = FactoryBot.create(:resource_collection)
      @annotation.format = "resource_collection"
      @annotation.resource_collection = collection
      expect(@annotation).to be_valid
    end
  end

  context "when part of a reading group" do

    before(:each) do
      @reading_group = FactoryBot.create(:reading_group)
      @creator = FactoryBot.create(:user)
      @reading_group_membership = FactoryBot.create(:reading_group_membership, reading_group: @reading_group, user: @creator)
    end

    it "increments the reading group's annotations_count" do
      expect { FactoryBot.create(:annotation, creator: @creator, reading_group: @reading_group) }
        .to change { @reading_group.reload.annotations_count }.from(0).to(1)
    end

    it "increments the reading group's highlights_count" do
      expect { FactoryBot.create(:annotation, format: "highlight", creator: @creator, reading_group: @reading_group) }
        .to change { @reading_group.reload.highlights_count }.from(0).to(1)
    end

    it "increments the reading group memberships highlights_count" do
      expect { FactoryBot.create(:annotation, creator: @creator, reading_group: @reading_group) }
        .to change { @reading_group_membership.reload.annotations_count}.from(0).to(1)
    end

  end

  describe "the with_read_ability scope" do


    let(:private_group) { FactoryBot.create(:reading_group, privacy: "private") }
    let(:private_group_member) do
      user = FactoryBot.create(:user)
      FactoryBot.create(:reading_group_membership, user: user, reading_group: private_group)
      user
    end

    let(:public_group) { FactoryBot.create(:reading_group, privacy: "public") }
    let(:public_group_member) do
      user = FactoryBot.create(:user)
      FactoryBot.create(:reading_group_membership, user: user, reading_group: public_group)
      user
    end

    let(:anonymous_group) { FactoryBot.create(:reading_group, privacy: "anonymous") }
    let(:anonymous_group_member) do
      user = FactoryBot.create(:user)
      FactoryBot.create(:reading_group_membership, user: user, reading_group: anonymous_group)
      user
    end

    let(:all_groups_member) do
      all_groups_member = FactoryBot.create(:user)
      FactoryBot.create(:reading_group_membership, user: all_groups_member, reading_group: private_group)
      FactoryBot.create(:reading_group_membership, user: all_groups_member, reading_group: public_group)
      FactoryBot.create(:reading_group_membership, user: all_groups_member, reading_group: anonymous_group)
      all_groups_member
    end

    let(:private_group_annotation) { FactoryBot.create(:annotation, private: false, reading_group: private_group) }
    let(:public_group_annotation) { FactoryBot.create(:annotation, private: false, reading_group: public_group) }
    let(:anonymous_group_annotation) { FactoryBot.create(:annotation, private: false, reading_group: anonymous_group) }
    let(:public_annotation) { FactoryBot.create(:annotation, private: false, reading_group: nil) }
    let(:private_annotation) { FactoryBot.create(:annotation, private: true, reading_group: nil) }
    let(:all_groups_member_private_annotation) { FactoryBot.create(:annotation, private: true, reading_group: nil, creator: all_groups_member) }

    let(:reader) { FactoryBot.create(:user) }

    shared_examples_for "a readable annotation" do |label, annotation_sym|

      it "when the annotation is a #{label}" do
        annotation = send(annotation_sym)
        expect(Annotation.with_read_ability(user).pluck(:id)).to include annotation.id
      end
    end

    shared_examples_for "a non-readable annotation" do |label, annotation_sym|
      it "when the annotation is a #{label}" do
        annotation = send(annotation_sym)
        expect(Annotation.with_read_ability(user).pluck(:id)).to_not include annotation.id
      end
    end

    context "when filtering, the annotation" do

      context "when the user is not in any groups" do
        let(:user) { reader }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation
      end

      context "when the user is the creator of the annotation" do
        let(:user) { all_groups_member }
        it_behaves_like "a readable annotation", "private annotation", :all_groups_member_private_annotation
      end

      context "when the user is nil" do
        let(:user) { nil }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation
      end

      context "when the user is only in the private group" do
        let(:user) { private_group_member }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation
      end

      context "when the user is only in the anonymous group" do
        let(:user) { anonymous_group_member }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a readable annotation", "anonymous group annotation", :anonymous_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation
      end

      context "when the user is in all groups" do
        let(:user) { all_groups_member }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a readable annotation", "anonymous group annotation", :anonymous_group_annotation
        it_behaves_like "a readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
      end

    end

  end

end
