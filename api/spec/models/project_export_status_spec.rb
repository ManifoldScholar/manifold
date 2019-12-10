require 'rails_helper'

RSpec.describe ProjectExportStatus, type: :model, packaging: true do
  let!(:project) { FactoryBot.create :project }
  let!(:project_export) { FactoryBot.create :project_export, :bag_it, fingerprint: export_fingerprint, project: project }

  let(:export_fingerprint) { "12345678" }

  let!(:project_export_status) { described_class.by_project(project).by_project_export(project_export).first }

  subject { project_export_status }

  context "when the fingerprint matches" do
    let(:export_fingerprint) { project.fingerprint }

    it { is_expected.to be_current }
    it { is_expected.not_to be_stale }
  end

  context "when the fingerprint does not match" do
    let(:export_fingerprint) { SecureRandom.uuid }

    it { is_expected.not_to be_current }
    it { is_expected.to be_stale }
  end

  context "with a project marked to export" do
    let!(:project) { FactoryBot.create :project, :exports_as_bag_it }

    it { is_expected.to be_an_autoexport }
  end
end

