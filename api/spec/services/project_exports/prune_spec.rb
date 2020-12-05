require "rails_helper"

RSpec.describe ProjectExports::Prune, interaction: true, packaging: true do
  let!(:prunable_project) { FactoryBot.create :project }
  let!(:prunable_export) do
    Timecop.freeze(ProjectExportStatus::PRUNABLE_AGE.ago - 1.day) do
      FactoryBot.create :project_export, :bag_it, project: prunable_project
    end
  end

  let!(:preserved_project) { FactoryBot.create :project }

  let!(:preserved_export) do
    Timecop.freeze(ProjectExportStatus::PRUNABLE_AGE.ago + 1.day) do
      FactoryBot.create :project_export, :bag_it, project: preserved_project
    end
  end

  it "destroys the prunable exports" do
    perform_within_expectation! do |e|
      e.to change(ProjectExport, :count).by(-1)
    end

    expect do
      prunable_export.reload
    end.to raise_error(ActiveRecord::RecordNotFound)

    expect do
      preserved_export.reload
    end.to execute_safely
  end

  context "with a project exportation" do
    let!(:export_target) { FactoryBot.create :export_target, :s3 }

    let!(:prunable_exportation) do
      FactoryBot.create(
        :project_exportation,
        project: prunable_project,
        export_target: export_target,
        project_export: prunable_export
      )
    end

    let!(:preserved_exportation) do
      FactoryBot.create(
        :project_exportation,
        project: preserved_project,
        export_target: export_target,
        project_export: preserved_export
      )
    end

    it "preserves the exportation" do
      perform_within_expectation! do |e|
        e.to change { prunable_exportation.reload.project_export }.from(a_kind_of(ProjectExport)).and keep_the_same { preserved_exportation.reload.project_export }
      end
    end
  end
end
