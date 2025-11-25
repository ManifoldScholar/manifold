# frozen_string_literal: true

RSpec.describe SoftDeletions::Purge, type: :operation do
  let_it_be(:user, refind: true) { FactoryBot.create(:user) }
  let_it_be(:creator) { user }
  let_it_be(:reading_group, refind: true) { FactoryBot.create(:reading_group, creator:) }
  let_it_be(:category, refind: true) { FactoryBot.create(:reading_group_category, reading_group:) }
  let_it_be(:project, refind: true) { FactoryBot.create(:project, creator:) }
  let_it_be(:text, refind: true) { FactoryBot.create(:text, creator:, project:) }
  let_it_be(:stylesheet, refind: true) { FactoryBot.create(:stylesheet, text:) }
  let_it_be(:text_section, refind: true) { FactoryBot.create(:text_section, :with_simple_body, :with_hydrated_nodes, text:) }
  let_it_be(:text_section_stylesheet, refind: true) { TextSectionStylesheet.create!(text_section:, stylesheet:) }
  let_it_be(:annotation, refind: true) { FactoryBot.create(:annotation, creator:, text_section:, reading_group:) }
  let_it_be(:comment, refind: true) { FactoryBot.create(:comment, creator:, subject: annotation) }
  let_it_be(:subcomment, refind: true) { FactoryBot.create(:comment, creator:, parent: comment, subject: annotation) }

  let(:node_count) { 8 }

  let(:record) { comment }
  let(:record_change_count) { -1 }
  let(:unpurgeable_change_count) { 0 }

  # @abstract
  def meet_expectations!
    change(record.class, :count).by(record_change_count)
  end

  # @return [void]
  def meet_expectations_when_not_purgable!
    change(record.class, :count).by(unpurgeable_change_count)
      .and(raise_error(SoftDeletions::Unpurgeable))
  end

  shared_examples_for "a soft deletable record purgation" do
    let(:operation_args) { [record] }

    it "does nothing if the record has not been deleted" do
      expect(record).not_to be_marked_for_purge

      expect do
        expect_calling_the_operation.to succeed
      end.to keep_the_same(record.class, :count)
    end

    it "purges the record and all its dependents" do
      expect do
        record.async_destroy
      end.to change { record.reload.marked_for_purge? }.from(false).to(true)

      expect do
        expect_calling_the_operation.to succeed
      end.to meet_expectations!
    end

    it "raises the proper error if something prevents destruction" do
      record.async_destroy

      allow(record).to receive(:destroy!).and_raise(ActiveRecord::RecordNotDestroyed)

      expect do
        expect_calling_the_operation
      end.to meet_expectations_when_not_purgable!
    end
  end

  context "when purging an annotation" do
    let(:record) { annotation }

    def meet_expectations!
      super.and(change(Comment, :count).by(-2))
    end

    it_behaves_like "a soft deletable record purgation"
  end

  context "when purging a comment" do
    let(:record) { comment }
    let(:record_change_count) { -2 }

    # The subcomment will still get purged,
    # we want this job to always clean up as much as possible.
    let(:unpurgeable_change_count) { -1 }

    it_behaves_like "a soft deletable record purgation"
  end

  context "when purging a reading group" do
    let(:record) { reading_group }

    def meet_expectations!
      super
        .and(change(ReadingGroupCategory, :count).by(-1))
        .and(change { annotation.reload.reading_group_id }.from(reading_group.id).to(nil))
    end

    it_behaves_like "a soft deletable record purgation"
  end

  context "when purging a project" do
    let(:record) { project }

    def meet_expectations!
      super
        .and(change(Text, :count).by(-1))
        .and(change(TextSection, :count).by(-1))
        .and(change(Stylesheet, :count).by(-1))
        .and(change(TextSectionStylesheet, :count).by(-1))
        .and(change(TextSectionNode, :count).by(-node_count))
    end

    it_behaves_like "a soft deletable record purgation"
  end

  context "when purging a text" do
    let(:record) { text }

    def meet_expectations!
      super
        .and(change(Stylesheet, :count).by(-1))
        .and(change(TextSectionStylesheet, :count).by(-1))
        .and(change(TextSection, :count).by(-1))
        .and(change(TextSectionNode, :count).by(-node_count))
    end

    it_behaves_like "a soft deletable record purgation"
  end

  context "when purging a user" do
    let(:record) { user }

    def meet_expectations!
      super
        .and(keep_the_same(Project, :count))
        .and(keep_the_same(Text, :count))
        .and(keep_the_same(TextSection, :count))
        .and(keep_the_same(TextSectionNode, :count))
        .and(keep_the_same(ReadingGroup, :count))
        .and(keep_the_same(ReadingGroupCategory, :count))
        .and(change(Annotation, :count).by(-1))
        .and(change(Comment, :count).by(-2))
    end

    it_behaves_like "a soft deletable record purgation"
  end
end
