require 'rails_helper'

RSpec.describe ProjectExport, type: :model, packaging: true do
  describe ".prunable" do
    let(:the_scope) { described_class.prunable }

    let!(:project) { FactoryBot.create :project }
    let!(:prunable_export) do
      Timecop.freeze(ProjectExportStatus::PRUNABLE_AGE.ago - 1.day) do
        FactoryBot.create :project_export, :bag_it, project: project
      end
    end
    let!(:stale_export) { FactoryBot.create :project_export, :bag_it, project: project }
    let!(:current_export) { FactoryBot.create :project_export, :bag_it, project: project, fingerprint: project.fingerprint }

    it "finds the correct exports" do
      aggregate_failures "scope works correctly" do
        expect(the_scope).to include prunable_export
        expect(the_scope).not_to include stale_export
        expect(the_scope).not_to include current_export
      end
    end
  end
end
