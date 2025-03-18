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

    it "performs keyword search" do
      stub_request(:get, /elasticsearch/).to_return(status: 200, body: "", headers: {})
      FactoryBot.create_list(:project, 20)
      params = {keyword: "body"}
      expect(operation.call(params, model: Project, scope: Project.all, user: admin_user, use_pg_search: use_pg_search).length).to eq(20)
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
  end
end
