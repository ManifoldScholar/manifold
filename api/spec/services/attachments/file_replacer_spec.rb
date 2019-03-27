require "rails_helper"

RSpec.describe Attachments::FileReplacer do
  with_model :AttachableClass do
    table do |t|
      t.string :attached_file_name
      t.integer :attached_file_size
      t.string :attached_content_type
      t.datetime :attached_updated_at

      t.jsonb :attached_data
      t.jsonb :resource_data
    end

    model do
      include Attachments

      manifold_has_attached_file :attached, :resource
    end
  end
  let(:instance_image) do
    instance = AttachableClass.new
    instance.attached = fixture_file_upload(Rails.root.join("spec", "data","assets","images","test_avatar.jpg"))
    instance.save

    instance.reload
  end
  let(:instance_pdf) do
    instance = AttachableClass.new
    instance.attached = fixture_file_upload(Rails.root.join("spec", "data","assets","pdfs","multi-page.pdf"))
    instance.save

    instance.reload
  end
  let(:replacement_dir) { Rails.root.join("spec", "data","assets","replacements") }

  context "when dry run" do
    it "doesn't change any attachments" do
      expect do
        described_class.run klass_name: "AttachableClass", field_name: "attached", replacement_dir: replacement_dir.to_s, dry_run: true
        instance_image.reload
        instance_pdf.reload
      end.to not_change(instance_image, :attached).and not_change(instance_pdf, :attached)
    end
  end

  it "replaces matching attachments" do
    expect do
      described_class.run klass_name: "AttachableClass", field_name: "attached", replacement_dir: replacement_dir.to_s
      instance_image.reload
      instance_pdf.reload
    end.to change(instance_image, :attached).and change(instance_pdf, :attached)
  end

end
