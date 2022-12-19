# frozen_string_literal: true

require "rails_helper"

RSpec.describe PendingEntitlement, type: :model do
  context "when filtering" do
    it "can be ordered" do
      aggregate_failures do
        expect(described_class.filtered(order: "expires_on_asc").to_sql).to match(/.expires_on. ASC/i)
        expect(described_class.filtered(order: "expires_on_desc").to_sql).to match(/.expires_on. DESC/i)
        expect(described_class.filtered(order: "anything").to_sql).to match(/.created_at. DESC/i)
      end
    end
  end
end
