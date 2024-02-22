# frozen_string_literal: true

RSpec.describe Annotation, type: :model do
  let_it_be(:creator, refind: true) { FactoryBot.create :user }
  let_it_be(:project, refind: true) { FactoryBot.create :project, creator: creator }
  let_it_be(:text, refind: true) { FactoryBot.create :text, project: project, creator: creator }
  let_it_be(:text_section) { FactoryBot.create :text_section, text: text }

  before(:each) do
    @annotation = FactoryBot.build(:annotation, text_section: text_section, creator: creator)
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

  it "is valid without a creator" do
    @annotation.creator = nil
    expect(@annotation).to be_valid
  end

  it "enqueues a TEXT_ANNOTATED event on creation" do
    text_section = FactoryBot.create(:text_section)
    expect(CreateEventJob).to receive(:perform_later).with(EventType[:text_annotated], any_args)
    FactoryBot.create(:annotation, text_section: text_section)
  end

  it "does not enqueues a TEXT_ANNOTATED event on creation when it is private" do
    text_section = FactoryBot.create(:text_section)
    expect(CreateEventJob).to_not receive(:perform_later).with(EventType[:text_annotated], any_args)
    FactoryBot.create(:annotation, private: true, text_section: text_section)
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
        .to change { @reading_group_membership.reload.annotations_count }.from(0).to(1)
    end
  end

  describe "the with_read_ability scope" do
    let_it_be(:private_group, refind: true) { FactoryBot.create(:reading_group, privacy: "private") }
    let_it_be(:private_group_member, refind: true) do
      FactoryBot.create(:user).tap do |user|
        FactoryBot.create(:reading_group_membership, user: user, reading_group: private_group)
      end
    end

    let_it_be(:public_group, refind: true) { FactoryBot.create(:reading_group, privacy: "public") }
    let_it_be(:public_group_member, refind: true) do
      FactoryBot.create(:user).tap do |user|
        FactoryBot.create(:reading_group_membership, user: user, reading_group: public_group)
      end
    end

    let_it_be(:anonymous_group, refind: true) { FactoryBot.create(:reading_group, privacy: "anonymous") }
    let_it_be(:anonymous_group_member, refind: true) do
      FactoryBot.create(:user).tap do |user|
        FactoryBot.create(:reading_group_membership, user: user, reading_group: anonymous_group)
      end
    end

    let_it_be(:all_groups_member, refind: true) do
      FactoryBot.create(:user).tap do |all_groups_member|
        FactoryBot.create(:reading_group_membership, user: all_groups_member, reading_group: private_group)
        FactoryBot.create(:reading_group_membership, user: all_groups_member, reading_group: public_group)
        FactoryBot.create(:reading_group_membership, user: all_groups_member, reading_group: anonymous_group)
      end
    end

    let_it_be(:private_group_annotation, refind: true) { FactoryBot.create(:annotation, private: false, reading_group: private_group) }
    let_it_be(:public_group_annotation, refind: true) { FactoryBot.create(:annotation, private: false, reading_group: public_group) }
    let_it_be(:anonymous_group_annotation, refind: true) { FactoryBot.create(:annotation, private: false, reading_group: anonymous_group) }
    let_it_be(:public_annotation, refind: true) { FactoryBot.create(:annotation, private: false, reading_group: nil) }
    let_it_be(:private_annotation, refind: true) { FactoryBot.create(:annotation, private: true, reading_group: nil) }
    let_it_be(:resource_annotation, refind: true) { FactoryBot.create(:annotation, private: false, format: Annotation::TYPE_RESOURCE, resource: FactoryBot.create(:resource))}
    let_it_be(:all_groups_member_private_annotation, refind: true) { FactoryBot.create(:annotation, private: true, reading_group: nil, creator: all_groups_member) }

    let_it_be(:reader, refind: true) { FactoryBot.create(:user) }

    shared_examples_for "a readable annotation" do |label, annotation_sym, exclude_public = false|
      it "when the annotation is a #{label}" do
        collection = Annotation.with_read_ability(user, exclude_public)
        annotation = send(annotation_sym)
        expect(collection.ids).to include annotation.id
      end
    end

    shared_examples_for "a non-readable annotation" do |label, annotation_sym, exclude_public = false|
      it "when the annotation is a #{label}" do
        annotation = send(annotation_sym)
        expect(Annotation.with_read_ability(user, exclude_public).ids).to_not include annotation.id
      end
    end

    context "when filtering, the annotation" do
      context "when the user is not in any groups" do
        let_it_be(:user, refind: true) { reader }
        let_it_be(:private_group_annotation_by_former_group_member, refind: true) do
          FactoryBot.create(:annotation, private: false, reading_group: private_group, creator: user)
        end
        let(:public_group_annotation_by_former_group_member) do
          FactoryBot.create(:annotation, private: false, reading_group: public_group, creator: user)
        end
        let(:anonymous_group_annotation_by_former_group_member) do
          FactoryBot.create(:annotation, private: false, reading_group: anonymous_group, creator: user)
        end
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation
        it_behaves_like "a readable annotation", "private group annotation authored by the user who does not belong to the private group", :private_group_annotation_by_former_group_member
        it_behaves_like "a readable annotation", "public group annotation authored by the user who does not belong to the public group", :public_group_annotation_by_former_group_member
        it_behaves_like "a readable annotation", "anonymous group annotation authored by the user who does not belong to the anonymous group", :anonymous_group_annotation_by_former_group_member
        it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true

        context "when public annotations are excluded" do
          it_behaves_like "a non-readable annotation", "public annotation", :public_annotation, true
          it_behaves_like "a non-readable annotation", "public group annotation", :public_group_annotation, true
          it_behaves_like "a non-readable annotation", "private annotation", :private_annotation, true
          it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation, true
          it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation, true
          it_behaves_like "a readable annotation", "private group annotation authored by the user who does not belong to the private group", :private_group_annotation_by_former_group_member, true
          it_behaves_like "a readable annotation", "public group annotation authored by the user who does not belong to the public group", :public_group_annotation_by_former_group_member, true
          it_behaves_like "a readable annotation", "anonymous group annotation authored by the user who does not belong to the anonymous group", :anonymous_group_annotation_by_former_group_member, true
          it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true
        end
      end

      context "when the user is the creator of the annotation" do
        let(:user) { all_groups_member }
        it_behaves_like "a readable annotation", "private annotation", :all_groups_member_private_annotation

        context "when public annotations are excluded" do
          it_behaves_like "a readable annotation", "private annotation", :all_groups_member_private_annotation, true
        end
      end

      context "when the user is nil" do
        let(:user) { nil }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation
        it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true

        context "when public annotations are excluded" do
          it_behaves_like "a non-readable annotation", "public annotation", :public_annotation, true
          it_behaves_like "a non-readable annotation", "public group annotation", :public_group_annotation, true
          it_behaves_like "a non-readable annotation", "private annotation", :private_annotation, true
          it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation, true
          it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation, true
          it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true
        end
      end

      context "when the user is only in the private group" do
        let(:user) { private_group_member }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation
        it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true

        context "when public annotations are excluded" do
          it_behaves_like "a non-readable annotation", "public annotation", :public_annotation, true
          it_behaves_like "a non-readable annotation", "public group annotation", :public_group_annotation, true
          it_behaves_like "a readable annotation", "private group annotation", :private_group_annotation, true
          it_behaves_like "a non-readable annotation", "private annotation", :private_annotation, true
          it_behaves_like "a non-readable annotation", "anonymous group annotation", :anonymous_group_annotation, true
          it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true
        end
      end

      context "when the user is only in the anonymous group" do
        let(:user) { anonymous_group_member }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a readable annotation", "anonymous group annotation", :anonymous_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true

        context "when public annotations are excluded" do
          it_behaves_like "a non-readable annotation", "public annotation", :public_annotation, true
          it_behaves_like "a non-readable annotation", "public group annotation", :public_group_annotation, true
          it_behaves_like "a readable annotation", "anonymous group annotation", :anonymous_group_annotation, true
          it_behaves_like "a non-readable annotation", "private annotation", :private_annotation, true
          it_behaves_like "a non-readable annotation", "private group annotation", :private_group_annotation, true
          it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true
        end
      end

      context "when the user is in all groups" do
        let(:user) { all_groups_member }
        it_behaves_like "a readable annotation", "public annotation", :public_annotation
        it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation
        it_behaves_like "a readable annotation", "anonymous group annotation", :anonymous_group_annotation
        it_behaves_like "a readable annotation", "private group annotation", :private_group_annotation
        it_behaves_like "a non-readable annotation", "private annotation", :private_annotation
        it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true

        context "when public annotations are excluded" do
          it_behaves_like "a non-readable annotation", "public annotation", :public_annotation, true
          it_behaves_like "a readable annotation", "public group annotation", :public_group_annotation, true
          it_behaves_like "a readable annotation", "anonymous group annotation", :anonymous_group_annotation, true
          it_behaves_like "a readable annotation", "private group annotation", :private_group_annotation, true
          it_behaves_like "a non-readable annotation", "private annotation", :private_annotation, true
          it_behaves_like "a readable annotation", "resource annotation", :resource_annotation, true
        end
      end
    end
  end

  context "when detecting spam" do
    it_behaves_like "a model with spam detection" do
      let(:instance) { FactoryBot.build :annotation }
    end
  end
end
