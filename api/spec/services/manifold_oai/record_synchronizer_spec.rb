# frozen_string_literal: true

require "rails_helper"

RSpec.describe ManifoldOAI::RecordSynchronizer do
  subject { ManifoldOAI::RecordSynchronizer }

  describe "metadata extraction tests" do
    let(:project) { FactoryBot.create(:project, :with_metadata) }
    subject(:result) { described_class.new(project).call }

    it { is_expected.to be_success }

    it "has title" do
      expect(result.success.oai_dc_content).to have_xml('//oai_dc:title', project.title)
    end

    it "has rights" do
      expect(result.success.oai_dc_content).to have_xml('//oai_dc:rights', project.metadata[:rights])
    end

    it "has publisher" do
      expect(result.success.oai_dc_content).to have_xml('//oai_dc:publisher', project.metadata[:publisher])
    end

    it "has rightsHolder" do
      expect(result.success.oai_dc_content).to have_xml('//oai_dc:rightsHolder', project.metadata[:rights_holder])
    end
  end

  describe "linking projects to sets" do
    let(:project) { FactoryBot.create(:project) }
    subject(:result) { described_class.new(project).call }

    it "links the project to the projects set" do
      expect { result }.to change { ManifoldOAISet.find_by(spec: "projects")&.records&.count || 0 }.by(1)
    end
  end

  describe "linking journals to sets" do
    let(:journal) { FactoryBot.create(:journal) }
    subject(:result) { described_class.new(journal).call }

    it "links the journal to the journals set" do
      expect { result }.to change { ManifoldOAISet.find_by(spec: "journals")&.records&.count || 0 }.by(1)
    end
  end
end
