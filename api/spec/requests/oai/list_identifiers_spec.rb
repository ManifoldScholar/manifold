# frozen_string_literal: true

RSpec.describe "OAI PMH List Identifiers", type: :request do
  include_context "OAI testing"

  let_it_be(:records) { FactoryBot.create_list(:manifold_oai_record, 5) }

  before do
    ManifoldOAIRecord.where.not(id: records.pluck(:id)).delete_all
  end

  subject(:response) { client.list_identifiers }

  it { is_expected.to be_an_instance_of OAI::ListIdentifiersResponse }

  it "gets all identifiers" do
    expect(response.count).to eq 5

    id_map = response.map(&:identifier)

    records.each do |record|
      expect(id_map.include?("oai:manifold:#{record.id}")).to be true
    end
  end
end
