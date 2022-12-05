# frozen_string_literal: true

RSpec.describe EntitlementImports::GenerateAndProcessFake, type: :operation do
  let(:operation) { described_class.new }

  let!(:users) { FactoryBot.create_list :user, 5 }

  let!(:project) { FactoryBot.create :project }

  it "will create entitlements" do
    expect do
      @import = operation.call.value!
    end.to(
      change(EntitlementImport, :count).by(1)
      .and(change(EntitlementImportRow, :count).by_at_least(6))
      .and(change(Entitlement, :count).by_at_least(1))
    )

    expect(@import).to be_in_state(:success)
  end
end
