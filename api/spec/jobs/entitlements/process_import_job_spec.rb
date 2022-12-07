# frozen_string_literal: true

RSpec.describe Entitlements::ProcessImportJob, type: :job do
  let!(:users) { FactoryBot.create_list :user, 5 }

  let!(:project) { FactoryBot.create :project }

  let!(:import_file_path) do
    ManifoldApi::Container["entitlement_imports.generate_fake"].call.value!
  end

  let!(:import) do
    FactoryBot.create(:entitlement_import, file: import_file_path.open("r+"))
  end

  it "will process an import" do
    expect do
      described_class.perform_now import
    end.to(
      change { import.current_state(force_reload: true ) }.from("pending").to("success")
      .and(change(EntitlementImportRow, :count).by_at_least(6))
      .and(change(Entitlement, :count).by_at_least(1))
    )
  end
end
