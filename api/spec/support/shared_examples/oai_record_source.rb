# frozen_string_literal: true

RSpec.shared_examples_for "an OAI record source" do |*factory_tags, ignore_oai_tag: nil|
  let(:source_with_record) { FactoryBot.create(described_class.name.underscore, *factory_tags) }

  it "creates a record on creation" do
    expect(source_with_record.should_have_oai_record?).to be true
    expect(source_with_record.manifold_oai_record).not_to be_nil
  end

  if ignore_oai_tag
    let(:source_without_record) { FactoryBot.create(described_class.name.underscore, ignore_oai_tag, *factory_tags) }
    it "does not create a record when ignored" do
      expect(source_without_record.should_have_oai_record?).to be false
      expect(source_without_record.manifold_oai_record).to be_nil
    end
  end

  it "does not create a record when exclude_from_oai is selected" do
    source = FactoryBot.create(described_class.name.underscore, *factory_tags, exclude_from_oai: true)
    expect(source.manifold_oai_record).to be_nil
  end

  it "deletes existing record when exclude_from_oai is toggled" do
    source_with_record
    expect do
      source_with_record.exclude_from_oai = true
      source_with_record.save!
    end.to change(ManifoldOAIRecord, :count).by(-1)
  end

  it "properly nullifies OAI record relationship when source is deleted" do
    record = source_with_record.manifold_oai_record
    expect { source_with_record.destroy }.not_to change(ManifoldOAIRecord, :count)
    expect(record.source).to be_nil
  end

  it "doesn't change the OAI record metadata when source is deleted" do
    record = source_with_record.manifold_oai_record
    expect do
      source_with_record.destroy
      record.reload
    end.not_to change(record, :oai_dc_content)
  end

  it "sets the OAI record deleted at time when the source is deleted" do
    record = source_with_record.manifold_oai_record
    expect do
      source_with_record.destroy
      record.reload
    end.to change(record, :deleted_at)
    expect(record.deleted_at).not_to be_nil
  end

  it "updates record when source record is updated" do
    record = source_with_record.manifold_oai_record
    expect do
      source_with_record.metadata["series_title"] = "updated title"
      source_with_record.save
      record.reload
    end.to change(record, :oai_dc_content)
  end
end
