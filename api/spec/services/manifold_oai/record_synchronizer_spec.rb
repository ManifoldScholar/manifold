# frozen_string_literal: true

require "rails_helper"

RSpec.describe ManifoldOAI::RecordSynchronizer do
  subject { ManifoldOAI::RecordSynchronizer }

  describe "metadata extraction tests" do
    let(:project) { FactoryBot.create(:project, :with_metadata) }
    subject(:result) { described_class.new(project).call }

    it { is_expected.to be_success }

    it "has title" do
      expect(result.success.oai_dc_content).to include("<dc:title>#{project.title}</dc:title>")
    end

    it "has subtitle when present" do
      project.update(subtitle: "A Subtitle")
      result = described_class.new(project).call
      expect(result.success.oai_dc_content).to include("<dc:title>A Subtitle</dc:title>")
    end

    it "has description when present" do
      project.update(description: "Test Description")
      result = described_class.new(project).call
      expect(result.success.oai_dc_content).to include("<dc:description>Test Description</dc:description>")
    end

    it "has creator element" do
      expect(result.success.oai_dc_content).to include("<dc:creator")
    end

    it "has publication date in ISO 8601 format" do
      project.update(publication_date: Date.new(2024, 1, 15))
      result = described_class.new(project).call
      expect(result.success.oai_dc_content).to include("<dc:date>2024-01-15</dc:date>")
    end

    it "has rights" do
      expect(result.success.oai_dc_content).to include("<dc:rights>")
    end

    it "has publisher" do
      expect(result.success.oai_dc_content).to include("<dc:publisher>")
    end

    it "has subjects" do
      subject_obj = FactoryBot.create(:subject, name: "Test Subject")
      project.subjects << subject_obj
      result = described_class.new(project).call
      expect(result.success.oai_dc_content).to include("<dc:subject>Test Subject</dc:subject>")
    end

    context "with identifiers" do
      before do
        project.metadata[:doi] = "10.1234/example"
        project.metadata[:isbn] = "978-1234567890"
        project.metadata[:issn] = "1234-5678"
        project.save!
      end

      it "has DOI identifier with prefix" do
        expect(result.success.oai_dc_content).to include("<dc:identifier>doi:10.1234/example</dc:identifier>")
      end

      it "has ISBN identifier with prefix" do
        expect(result.success.oai_dc_content).to include("<dc:identifier>isbn:978-1234567890</dc:identifier>")
      end

      it "has ISSN identifier with prefix" do
        expect(result.success.oai_dc_content).to include("<dc:identifier>issn:1234-5678</dc:identifier>")
      end
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
