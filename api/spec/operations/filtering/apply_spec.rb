# frozen_string_literal: true

RSpec.describe Filtering::Apply, type: :operation do
  let_it_be(:admin_user, refind: true) { FactoryBot.create :user, :admin }

  let_it_be(:operation) { described_class.new }

  context "PG Search" do
    it "returns everything with no filters applied" do
      FactoryBot.create_list(:project, 5)
      expect(operation.call({}, model: Project, scope: Project.all, user: nil).length).to eq(5)
    end

    it "can filter out with filter params that correspond to a scope" do
      FactoryBot.create_list(:project, 5)
      FactoryBot.create_list(:project, 5, :as_draft)
      expect(operation.call({ draft: true }, model: Project, scope: Project.all, user: admin_user).length).to eq(5)
    end

    it "paginates" do
      FactoryBot.create_list(:project, 30)
      expect(operation.call({ per_page: 3 }, model: Project, scope: Project.all, user: admin_user).length).to eq(3)
    end

    it "can skip pagination param" do
      FactoryBot.create_list(:project, 30)
      expect(operation.call({ per_page: 3 }, model: Project, scope: Project.all, skip_pagination: true, user: admin_user).length).to eq(30)
    end

    it "performs keyword search on Maker model" do
      FactoryBot.create_list(:maker, 10)
      FactoryBot.create_list(:maker, 10, first_name: "Rocky", last_name: "Balboa", name: "Rocky Balboa")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "Rocky" }, model: Maker, scope: Maker.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "Balboa" }, model: Maker, scope: Maker.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "Rocky Balboa" }, model: Maker, scope: Maker.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "Rambo" }, model: Maker, scope: Maker.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "Luke" }, model: Maker, scope: Maker.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Event model" do
      FactoryBot.create_list(:event, 10, subject_title: "hello")
      FactoryBot.create_list(:event, 9, subject_title: "goodbye")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: Event, scope: Event.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "goodbye" }, model: Event, scope: Event.all, user: admin_user).length).to eq(9)
        expect(operation.call({ keyword: "Luke" }, model: Event, scope: Event.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Journal Issue model" do
      FactoryBot.create_list(:journal_issue_with_title, 10, journal_attributes: { title: "hello" }, journal_volume_attributes: { number: 1 }, project_attributes: { description: "foo" })
      FactoryBot.create_list(:journal_issue_with_title, 9, journal_attributes: { title: "goodbye" }, journal_volume_attributes: { number: 3 }, project_attributes: { description: "bar" })
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: JournalIssue, scope: JournalIssue.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "goodbye" }, model: JournalIssue, scope: JournalIssue.all, user: admin_user).length).to eq(9)
        expect(operation.call({ keyword: "1" }, model: JournalIssue, scope: JournalIssue.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "3" }, model: JournalIssue, scope: JournalIssue.all, user: admin_user).length).to eq(9)
        expect(operation.call({ keyword: "foo" }, model: JournalIssue, scope: JournalIssue.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "bar" }, model: JournalIssue, scope: JournalIssue.all, user: admin_user).length).to eq(9)
        expect(operation.call({ keyword: "Luke" }, model: JournalIssue, scope: JournalIssue.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Text model" do
      first_text = FactoryBot.create(:text, description: "foo")
      second_text = FactoryBot.create(:text, description: "bar")
      FactoryBot.create(:text_title, text: first_text, value: "hello")
      FactoryBot.create(:text_title, text: second_text, value: "goodbye")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: Text, scope: Text.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "goodbye" }, model: Text, scope: Text.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "foo" }, model: Text, scope: Text.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "bar" }, model: Text, scope: Text.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "Luke" }, model: Text, scope: Text.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on User model" do
      FactoryBot.create_list(:user, 10, first_name: "hello", last_name: "foo")
      FactoryBot.create_list(:user, 9, first_name: "goodbye", last_name: "bar")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: User, scope: User.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "goodbye" }, model: User, scope: User.all, user: admin_user).length).to eq(9)
        expect(operation.call({ keyword: "foo" }, model: User, scope: User.all, user: admin_user).length).to eq(10)
        expect(operation.call({ keyword: "bar" }, model: User, scope: User.all, user: admin_user).length).to eq(9)
        expect(operation.call({ keyword: "Luke" }, model: User, scope: User.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Tag model" do
      FactoryBot.create(:tag, name: "hello")
      FactoryBot.create(:tag, name: "goodbye")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: Tag, scope: Tag.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "goodbye" }, model: Tag, scope: Tag.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "Luke" }, model: Tag, scope: Tag.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Ingestion Source model" do
      FactoryBot.create(:ingestion_source, display_name: "hello", source_identifier: "foo")
      FactoryBot.create(:ingestion_source, display_name: "goodbye", source_identifier: "bar")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: IngestionSource, scope: IngestionSource.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "goodbye" }, model: IngestionSource, scope: IngestionSource.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "foo" }, model: IngestionSource, scope: IngestionSource.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "bar" }, model: IngestionSource, scope: IngestionSource.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "Luke" }, model: IngestionSource, scope: IngestionSource.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Resource model" do
      FactoryBot.create_list(:resource, 5, title: "hello", description: "foo")
      FactoryBot.create_list(:resource, 4, title: "goodbye", description: "bar")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: Resource, scope: Resource.all, user: admin_user).length).to eq(5)
        expect(operation.call({ keyword: "goodbye" }, model: Resource, scope: Resource.all, user: admin_user).length).to eq(4)
        expect(operation.call({ keyword: "foo" }, model: Resource, scope: Resource.all, user: admin_user).length).to eq(5)
        expect(operation.call({ keyword: "bar" }, model: Resource, scope: Resource.all, user: admin_user).length).to eq(4)
        expect(operation.call({ keyword: "Luke" }, model: Resource, scope: Resource.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Journal model" do
      FactoryBot.create_list(:journal, 5, title: "hello", description: "foo")
      FactoryBot.create_list(:journal, 4, title: "goodbye", description: "bar")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: Journal, scope: Journal.all, user: admin_user).length).to eq(5)
        expect(operation.call({ keyword: "goodbye" }, model: Journal, scope: Journal.all, user: admin_user).length).to eq(4)
        expect(operation.call({ keyword: "foo" }, model: Journal, scope: Journal.all, user: admin_user).length).to eq(5)
        expect(operation.call({ keyword: "bar" }, model: Journal, scope: Journal.all, user: admin_user).length).to eq(4)
        expect(operation.call({ keyword: "Luke" }, model: Journal, scope: Journal.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Project model" do
      FactoryBot.create_list(:project, 5, title: "hello", description: "foo")
      FactoryBot.create_list(:project, 4, title: "goodbye", description: "bar")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: Project, scope: Project.all, user: admin_user).length).to eq(5)
        expect(operation.call({ keyword: "goodbye" }, model: Project, scope: Project.all, user: admin_user).length).to eq(4)
        expect(operation.call({ keyword: "foo" }, model: Project, scope: Project.all, user: admin_user).length).to eq(5)
        expect(operation.call({ keyword: "bar" }, model: Project, scope: Project.all, user: admin_user).length).to eq(4)
        expect(operation.call({ keyword: "Luke" }, model: Project, scope: Project.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Resource Collection model" do
      FactoryBot.create_list(:resource_collection, 5, title: "hello", description: "foo")
      FactoryBot.create_list(:resource_collection, 4, title: "goodbye", description: "bar")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: ResourceCollection, scope: ResourceCollection.all, user: admin_user).length).to eq(5)
        expect(operation.call({ keyword: "goodbye" }, model: ResourceCollection, scope: ResourceCollection.all, user: admin_user).length).to eq(4)
        expect(operation.call({ keyword: "foo" }, model: ResourceCollection, scope: ResourceCollection.all, user: admin_user).length).to eq(5)
        expect(operation.call({ keyword: "bar" }, model: ResourceCollection, scope: ResourceCollection.all, user: admin_user).length).to eq(4)
        expect(operation.call({ keyword: "Luke" }, model: ResourceCollection, scope: ResourceCollection.all, user: admin_user).length).to eq(0)
      end
    end

    it "performs keyword search on Subject model" do
      FactoryBot.create(:subject, name: "hello")
      FactoryBot.create(:subject, name: "goodbye")
      aggregate_failures("multiple filters") do
        expect(operation.call({ keyword: "hello" }, model: Subject, scope: Subject.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "goodbye" }, model: Subject, scope: Subject.all, user: admin_user).length).to eq(1)
        expect(operation.call({ keyword: "Luke" }, model: Subject, scope: Subject.all, user: admin_user).length).to eq(0)
      end
    end
  end
end
