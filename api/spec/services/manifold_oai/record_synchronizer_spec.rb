# frozen_string_literal: true

require "rails_helper"

RSpec.describe ManifoldOAI::RecordSynchronizer do
  subject { ManifoldOAI::RecordSynchronizer }

  describe "metadata extraction tests" do
    let(:project) { FactoryBot.create(:project, :with_metadata) }
    subject(:result) { described_class.new(project).call }

    it { is_expected.to be_success }

    it "has title" do
      expect(result.success.oai_dc_content).to have_xml('//oai_dc:title', project.metadata[:subject_title])
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
end
