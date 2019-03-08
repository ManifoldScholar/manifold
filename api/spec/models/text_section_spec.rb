require "rails_helper"

RSpec.describe TextSection, type: :model do

  it "has a valid factory" do
    expect(FactoryBot.build(:text_section)).to be_valid
  end

  it "belongs to a text" do
    text_section = TextSection.new
    text = Text.new
    text_section.text = text
    expect(text_section.text).to be text
  end

  it "belongs to a project" do
    text_section = FactoryBot.create(:text_section)
    expect(text_section.project).to be_a Project
  end

  it "belongs to an ingestion source" do
    text_section = TextSection.new
    ingestion_source = IngestionSource.new
    text_section.ingestion_source = ingestion_source
    expect(text_section.ingestion_source).to be ingestion_source
  end

  it "does not destroy stylesheet records on destroy" do
    text_section = FactoryBot.create(:text_section)
    text_section.stylesheets << FactoryBot.create(:stylesheet)
    expect { text_section.destroy }.to_not change { Stylesheet.count }
  end

  describe "enqueues a job to reindex searchable nodes" do
    it "when creating" do
      expect { FactoryBot.create(:text_section) }.to have_enqueued_job(TextSectionJobs::GenerateSearchableNodesJob)
    end

    it "when body_json changes" do
      text_section = FactoryBot.create(:text_section)
      expect do
        text_section.body_json = {"node_uuid" => "A", "tag" => "section", "node_type" => "element" }
        text_section.save
      end.to have_enqueued_job(TextSectionJobs::GenerateSearchableNodesJob)
    end
  end

  it "adds a job to destroy searchable_nodes on destroy" do
    text_section = FactoryBot.create(:text_section)
    expect {
      text_section.destroy
    }.to have_enqueued_job TextSectionJobs::DestroySearchableNodesJob
  end

  context "collapses body_json into searchable text nodes" do

    let(:text_section) {
      body_json = {
        "node_uuid" => "A",
        "tag" => "section",
        "node_type" => "element",
        "children" => [
          {
            "node_uuid" => "B",
            "tag" => "p",
            "node_type" => "element",
            "children" => [
              {
                "node_uuid" => "C",
                "node_type" => "text",
                "content" => "This is a sentence with"
              },
              {
                "node_uuid" => "D",
                "tag" => "i",
                "node_type" => "element",
                "children" => [
                  {
                    "node_uuid" => "E",
                    "node_type" => "text",
                    "content" => "italic text"
                  }
                ]
              },
              {
                "node_uuid" => "F",
                "node_type" => "text",
                "content" => "followed by regular text"
              }
            ]
          },
          {
            "node_uuid" => "G",
            "tag" => "p",
            "node_type" => "element",
            "children" => [
              {
                "node_uuid" => "H",
                "node_type" => "text",
                "content" => "And another sentence"
              }
            ]
          }
        ]
      }
      FactoryBot.create(:text_section, body_json: body_json)
    }

    it "collapses text nodes wrapped in inline tags into larger block-level chunks" do
      expect(text_section.properties_for_searchable_nodes.length).to be 2
    end

  end

end
