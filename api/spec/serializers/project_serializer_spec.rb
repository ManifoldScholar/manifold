require "rails_helper"

RSpec.describe V1::ProjectSerializer do
  it_behaves_like "a serializer", partial_by_default: true

  describe "when the collection is search results", elasticsearch: true do
    let(:object) do
      FactoryBot.create(:project, title: "test")
      Project.filtered(keyword: "test")
    end
    let(:subject) { described_class.new(object, include: [:texts], params: { full: true }) }

    it "successfully serializes the object to a String value" do
      expect(subject.serialized_json).to be_instance_of String
    end
  end

  describe "when the object is a project summary and the serialization is partial" do
    let(:object) do
      FactoryBot.create(:project)
      return ProjectSummary.first
    end
    let(:subject) { described_class.new(object) }

    it "does not include attributes or relationships that are not supported by project summaries" do
      expect(subject.serialized_json).to be_instance_of String
    end
  end

  describe "the project's text relationships" do
    let(:factory) { described_class.to_s.demodulize.gsub("Serializer", "").underscore.to_sym }
    let(:object) do
      project = FactoryBot.create(factory)
      project.texts << FactoryBot.create(:text, project: project)
      project
    end

    context "when a full serialization is requested" do
      let(:object) do
        project = FactoryBot.create(factory, title: "The project")
        text = FactoryBot.create(:text, project: project)
        project.texts << text
        text.reload
        ref = FactoryBot.build(:content_block_reference, kind: "text", referencable: text)
        project.content_blocks << FactoryBot.create(
          :toc_block,
          project: project,
          content_block_references: [ref]
        )
        project.reload
        project
      end

      let(:hash) { subject.serializable_hash }
      let(:toc_cb_id) { hash[:data][:relationships][:contentBlocks][:data][0][:id] }
      let(:included_cb) { hash[:included].find { |o| o[:id] == toc_cb_id } }
      let(:text) { object.texts.first }
      let(:included_text) { hash[:included].find { |o| o[:id] == text.id } }
      let(:subject) { described_class.new(object, include: [:texts, :content_blocks], params: { full: true, include_toc: [text.id] }) }

      it "includes the content blocks" do
        expect(included_cb).to be_a Hash
      end

      it "includes the TOC for texts that are referenced in TOC content blocks" do
        expect(included_text[:attributes][:toc]).to be_a Array
      end

      it "successfully serializes the object to a String value" do
        expect(subject.serialized_json).to be_instance_of String
      end

      it "correctly reports the partial state of the project as false" do
        hash = subject.serializable_hash
        expect(hash[:data][:meta][:partial]).to be false
      end

      it "correctly reports the partial state of the project's texts as true" do
        hash = subject.serializable_hash
        text_id = hash[:data][:relationships][:texts][:data].first[:id]
        text = hash[:included].find { |i| i[:id] == text_id }
        expect(text[:meta][:partial]).to be true
      end
    end

    context "when params includes a authorized_user" do
      let(:admin) { FactoryBot.create(:user, :admin) }
      let(:params) { { authority_user: admin, full: true } }
      let(:subject) { described_class.new(object, include: [:texts], params: params) }

      it "has a populated abilities hash" do
        hash = subject.serializable_hash
        expect(hash[:data][:attributes][:abilities][:read]).to be true
      end
    end
  end
end
