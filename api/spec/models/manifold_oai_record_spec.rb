# frozen_string_literal: true

RSpec.describe ManifoldOAIRecord do
  describe ".since_identifier" do
    let_it_be(:records) { FactoryBot.create_list(:manifold_oai_record, 3).sort_by(&:id) }

    it "returns records whose id sorts after the given identifier" do
      expect(described_class.since_identifier(records.first.id)).to match_array(records[1..])
    end

    it "returns all records when the identifier is blank" do
      expect(described_class.since_identifier(nil)).to match_array(records)
    end
  end
end
