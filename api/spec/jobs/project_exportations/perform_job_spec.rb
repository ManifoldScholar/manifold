require 'rails_helper'

RSpec.describe ProjectExportations::PerformJob, type: :job do
  let!(:project_exportation) { FactoryBot.create :project_exportation }
  it "calls the interaction" do
    expect(ProjectExportations::Perform).to receive(:run!).once

    expect do
      described_class.perform_now project_exportation: project_exportation
    end.to execute_safely
  end
end
