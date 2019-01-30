require "rails_helper"

RSpec.describe "When re-ingesting a text using the Document strategy", integration: true do
  include TestHelpers::IngestionHelper
  let(:before_path) { Rails.root.join("spec", "data", "ingestion", "html", "reingestion", "before.html") }
  let(:after_path) { Rails.root.join("spec", "data", "ingestion", "html", "reingestion", "after.html") }
  let(:before_source) { File.open(before_path) }
  let(:after_source) { File.open(after_path) }
  let(:before_ingestion) { FactoryBot.create(:ingestion, text: nil, source: before_source, external_source_url: nil) }
  let(:after_ingestion) { FactoryBot.create(:ingestion, text: text, source: after_source, external_source_url: nil) }
  let(:text) { Ingestions::Ingestor.run(ingestion: before_ingestion).result }
  let(:after_text) { Ingestions::Ingestor.run(ingestion: after_ingestion).result }

  let(:section) { text.text_sections.first }

  let(:annotation) do
    FactoryBot.create(
      :annotation,
      {
        text: text,
        format: "annotation",
        private: false,
        orphaned: true,
        subject: "Whan that Aprille with his shoures soote the droghte of Marche hath perced to the roote, And bathed every veyne in swich licour of which vertu engendred is the flour...than longen folk to goon on pilgrimages.",
        text_section_id: section.id
      }
    )
  end

  it "can be annotated" do
    expect(annotation.valid?).to be true
  end

  it "does not change the text section ID during re-ingestion" do
    pre = section.id
    post = after_text.text_sections.first.id
    expect(pre).to eq post
  end

  it "changes the text timestamp during re-ingestion" do
    pre = text.updated_at
    post = after_text.reload.updated_at
    expect(pre).to_not eq post
  end

  it "changes body when its re-ingested" do
    pre = section.body
    post = after_text.text_sections.first.reload.body
    expect(pre).to_not eq post
  end

  it "changes body_json when its re-ingested" do
    pre = section.body
    post = after_text.text_sections.first.reload.body
    expect(pre).to_not eq post
  end

  it "fails to move the annotation when the subject is ambiguous" do
    annotation = FactoryBot.create(
      :annotation,
      {
        text: text,
        format: "annotation",
        private: false,
        orphaned: false,
        subject: "greens",
        text_section_id: section.id
      }
    )
    after_text
    Annotations::AdoptOrOrphan.run annotation: annotation
    expect(annotation.reload.orphaned).to be true
  end

  it "successfully moves the annotation" do
    annotation
    after_text
    Annotations::AdoptOrOrphan.run annotation: annotation
    expect(annotation.reload.orphaned).to be false
  end

end
