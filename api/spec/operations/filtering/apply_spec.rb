# frozen_string_literal: true

require "rails_helper"

RSpec.shared_examples "common filtering examples" do |use_pg_search|
    let(:admin_user) { FactoryBot.create :user, :admin }

    it "smoke test" do
      FactoryBot.create_list(:project, 5)
      expect(operation.call({}, model: Project, scope: Project.all, user: nil, use_pg_search: use_pg_search).length).to eq(5)
    end

    it "with filter param" do
      FactoryBot.create_list(:project, 5)
      FactoryBot.create_list(:project, 5, :as_draft)
      expect(operation.call({draft: true}, model: Project, scope: Project.all, user: admin_user, use_pg_search: use_pg_search).length).to eq(5)
    end

    it "paginates" do
      FactoryBot.create_list(:project, 30)
      expect(operation.call({per_page: 3}, model: Project, scope: Project.all, user: admin_user, use_pg_search: use_pg_search).length).to eq(3)
    end

    it "with skip pagination param" do
      FactoryBot.create_list(:project, 30)
      expect(operation.call({per_page: 3}, model: Project, scope: Project.all, skip_pagination: true, user: admin_user, use_pg_search: use_pg_search).length).to eq(30)
    end

end

RSpec.describe Filtering::Apply, type: :operation do
  let(:operation) { described_class.new }

  context "Searchkick Search" do
    include_examples "common filtering examples", false do
      let(:operation) { described_class.new }
    end
  end

  context "PG Search" do
    include_examples "common filtering examples", true do
      let(:operation) { described_class.new }
    end

    it "performs keyword search on Maker model" do
      FactoryBot.create_list(:maker, 10)
      FactoryBot.create_list(:maker, 10, first_name: "Rocky", last_name: "Balboa", name: "Rocky Balboa")
      aggregate_failures("multiple filters") do
        expect(operation.call({keyword: "Rocky"}, model: Maker, scope: Maker.all, user: admin_user, use_pg_search: true).length).to eq(10)
        expect(operation.call({keyword: "Balboa"}, model: Maker, scope: Maker.all, user: admin_user, use_pg_search: true).length).to eq(10)
        expect(operation.call({keyword: "Rocky Balboa"}, model: Maker, scope: Maker.all, user: admin_user, use_pg_search: true).length).to eq(10)
        expect(operation.call({keyword: "Rambo"}, model: Maker, scope: Maker.all, user: admin_user, use_pg_search: true).length).to eq(10)
        expect(operation.call({keyword: "Luke"}, model: Maker, scope: Maker.all, user: admin_user, use_pg_search: true).length).to eq(0)
      end
    end

    it "performs keyword search on Event model" do
      FactoryBot.create_list(:event, 10, subject_title: "hello")
      FactoryBot.create_list(:event, 9, subject_title: "goodbye")
      aggregate_failures("multiple filters") do
        expect(operation.call({keyword: "hello"}, model: Event, scope: Event.all, user: admin_user, use_pg_search: true).length).to eq(10)
        expect(operation.call({keyword: "goodbye"}, model: Event, scope: Event.all, user: admin_user, use_pg_search: true).length).to eq(9)
        expect(operation.call({keyword: "Luke"}, model: Event, scope: Event.all, user: admin_user, use_pg_search: true).length).to eq(0)
      end
    end

    it "performs keyword search on Journal Issue model" do
      FactoryBot.create_list(:journal_issue_with_title, 10, journal_attributes: {title: "hello"}, journal_volume_attributes: {number: 1}, project_attributes: {description: "foo"})
      FactoryBot.create_list(:journal_issue_with_title, 9, journal_attributes: {title: "goodbye"}, journal_volume_attributes: {number: 3}, project_attributes: {description: "bar"})
      aggregate_failures("multiple filters") do
        expect(operation.call({keyword: "hello"}, model: JournalIssue, scope: JournalIssue.all, user: admin_user, use_pg_search: true).length).to eq(10)
        expect(operation.call({keyword: "goodbye"}, model: JournalIssue, scope: JournalIssue.all, user: admin_user, use_pg_search: true).length).to eq(9)
        expect(operation.call({keyword: "1"}, model: JournalIssue, scope: JournalIssue.all, user: admin_user, use_pg_search: true).length).to eq(10)
        expect(operation.call({keyword: "3"}, model: JournalIssue, scope: JournalIssue.all, user: admin_user, use_pg_search: true).length).to eq(9)
        expect(operation.call({keyword: "foo"}, model: JournalIssue, scope: JournalIssue.all, user: admin_user, use_pg_search: true).length).to eq(10)
        expect(operation.call({keyword: "bar"}, model: JournalIssue, scope: JournalIssue.all, user: admin_user, use_pg_search: true).length).to eq(9)
        expect(operation.call({keyword: "Luke"}, model: JournalIssue, scope: JournalIssue.all, user: admin_user, use_pg_search: true).length).to eq(0)
      end
    end
  end
end
