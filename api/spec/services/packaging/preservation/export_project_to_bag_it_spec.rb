require "rails_helper"

RSpec.describe Packaging::Preservation::ExportProjectToBagIt, interaction: true, packaging: true do
  let!(:bagit_pipeline) { Packaging::BagItSpec::Compilation::Pipeline.new }

  context "with an epub ingestion" do
    let!(:ingestion_source_path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    let!(:resource) { FactoryBot.create :resource, :image, project: project }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, project: project, source_path: ingestion_source_path }
    let!(:ingestion_result) { Ingestions::Ingestor.run ingestion: ingestion }
    let!(:text) do
      raise "Invalid text" unless ingestion_result.valid?

      ingestion_result.result.tap do |text|
        text.update_column :published, true
      end
    end

    let_input!(:project) { FactoryBot.create :project }

    it "compiles a book" do
      perform_within_expectation! do |e|
        e.to execute_safely.and change(ProjectExport, :count).by(1)
      end
      expect(@outcome).to be_valid
    end

    it "handles failures" do
      call_result = double("matcher result")

      expect(call_result).to receive(:success).once
      expect(call_result).to receive(:failure).once.and_yield(:failure, "some arbitrary reason")

      expect(bagit_pipeline).to receive_message_chain(:with_step_args, :call).and_yield(call_result)

      allow_any_instance_of(described_class).to receive(:bagit_pipeline).and_return(bagit_pipeline)

      perform_within_expectation! valid: false do |e|
        e.to execute_safely.and keep_the_same(ProjectExport, :count)
      end

      expect(@outcome).to be_invalid
    end
  end
end
