# frozen_string_literal: true

RSpec.describe Analytics::RecordCreateEvent do
  context "with an existing visit" do
    let_it_be(:visit) { FactoryBot.create(:analytics_visit) }

    context "and an annotation" do
      let_it_be(:annotation) { FactoryBot.create(:annotation) }

      it "should create a create event for an annotation" do
        expect do
          described_class.run analytics_visit: visit, record: annotation
        end.to change{ Analytics::Event.where(name: "create_annotation").count }.by 1
      end
    end

    context "with a comment" do
      let_it_be(:comment) { FactoryBot.create(:comment) }

      it "should create a create event for a comment" do
        expect do
          described_class.run analytics_visit: visit, record: comment
        end.to change { Analytics::Event.where(name: "create_comment").count }.by 1
      end
    end
  end
end
