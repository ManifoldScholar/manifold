require "rails_helper"
require "with_model"

RSpec.describe Attachments do
  include ActiveJob::TestHelper

  with_model :AttachableClass do
    table do |t|
      t.string :attached_file_name
      t.integer :attached_file_size
      t.string :attached_content_type
      t.datetime :attached_updated_at

      t.jsonb :attached_data
      t.jsonb :resource_data
      t.jsonb :image_sans_styles_data
    end

    model do
      include Attachments

      manifold_has_attached_file :attached, :image
      manifold_has_attached_file :resource, :resource
      manifold_has_attached_file :image_sans_styles, :image, no_styles: true
    end
  end

  let(:instance) do
    instance = AttachableClass.new
    instance.attached = fixture_file_upload(Rails.root.join("spec", "data", "assets", "images", "test_avatar.jpg"))
    instance.resource = fixture_file_upload(Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx"))
    instance.image_sans_styles = fixture_file_upload(Rails.root.join("spec", "data", "assets", "images", "test_avatar.jpg"))
    instance.save

    instance.reload
  end

  shared_examples_for "an Attachment defined method" do |method, expected = nil|
    describe "##{method}" do
      it "is defined" do
        expect(instance.respond_to?(method)).to eq true
      end

      unless expected.nil?
        it "returns the correct value" do
          perform_enqueued_jobs { instance.save }
          expect(instance.__send__(method)).to eq expected
        end
      end
    end
  end

  it "builds a hash of configuration options on model" do
    expect(instance.attached_options).to eq(type: :image,
                                              no_styles: false,
                                              validate_content_type: true)
  end

  it "enqueues a processing job" do
    expect { instance.save }.to have_enqueued_job(Attachments::ProcessAttachmentJob).exactly(:thrice)
  end

  context "when unprocessable source attachment" do
    describe "its styles hash" do
      it "has nil values for all keys except :original" do
        expect(instance.resource_styles.except(:original).values).to all(be_nil)
        expect(instance.resource_styles[:original]).to_not be_nil
      end
    end
  end

  describe "when the attachment doesn't have styles" do
    let(:attachable) do
      attachable = AttachableClass.new
      attachable.image_sans_styles = fixture_file_upload(Rails.root.join("spec", "data", "assets", "images", "test_avatar.jpg"))

      attachable.save

      attachable.reload
    end

    context "before processing" do
      it "returns the original url" do
        expect(attachable.image_sans_styles_original.url).to be_instance_of String
      end

    end

    context "after processing" do
      before { perform_enqueued_jobs { attachable.save } }
      it "returns the original url" do
        expect(attachable.image_sans_styles_original.url).to be_instance_of String
      end
    end

  end

  describe "determining whether to show placeholder" do
    let(:attachable) do
      attachable = AttachableClass.new
      attachable.attached = fixture_file_upload(Rails.root.join("spec", "data", "assets", "images", "test_avatar.jpg"))
      attachable.resource = fixture_file_upload(Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx"))
      attachable.save

      attachable.reload
    end

    context "when attachment is image" do
      context "before processing" do
        it "returns true" do
          expect(attachable.show_attached_placeholder?).to eq true
        end
      end

      context "after processing" do
        before { perform_enqueued_jobs { attachable.save } }
        it "returns false" do
          expect(attachable.show_attached_placeholder?).to eq false
        end
      end
    end

    context "when attachment is not image" do
      it "returns false" do
        expect(attachable.show_resource_placeholder?).to eq false
      end
    end
  end

  describe "methods added for an image attachment called 'attached'" do
    include_examples "an Attachment defined method", :attached_styles # TODO: These values include the generated paths
    include_examples "an Attachment defined method", :attached_url # TODO: These values include the generated paths

    include_examples "an Attachment defined method", :attached_extension, "jpg"
    include_examples "an Attachment defined method", :attached_processed?, true
    include_examples "an Attachment defined method", :show_attached_placeholder?, false
    include_examples "an Attachment defined method", :attached_file_name, "test_avatar.jpg"
    include_examples "an Attachment defined method", :attached_file_size, 64_254
    include_examples "an Attachment defined method", :attached_content_type, "image/jpeg"
    include_examples "an Attachment defined method", :attached_is_image?, true
    include_examples "an Attachment defined method", :attached_is_pdf?, false
    include_examples "an Attachment defined method", :attached_is_audio?, false
    include_examples "an Attachment defined method", :attached_is_video?, false
    include_examples "an Attachment defined method", :attached_is_spreadsheet?, false
    include_examples "an Attachment defined method", :attached_is_text_document?, false
    include_examples "an Attachment defined method", :attached_is_presentation?, false
    include_examples "an Attachment defined method", :attached_meta, { :large_landscape => {:width=>1280, :height=>800},
                                                                       :medium => {:width=>640, :height=>640},
                                                                       :medium_landscape => {:width=>640, :height=>400},
                                                                       :medium_portrait => {:width=>400, :height=>640},
                                                                       :medium_square => {:width=>640, :height=>640},
                                                                       :original => {:width=>642, :height=>642},
                                                                       :small => {:width=>320, :height=>320},
                                                                       :small_landscape => {:width=>320, :height=>200},
                                                                       :small_portrait => {:width=>200, :height=>320},
                                                                       :small_square => {:width=>320, :height=>320} }
    include_examples "an Attachment defined method", :manifold_attachment_image_styles, { :large_landscape => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"1280x800.0^", :extent=>"1280x800.0^"},
                                                                                          :medium => {:resize=>"640x640", :convert=>"jpg", :background=>"none", :gravity=>"north"},
                                                                                          :medium_landscape => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"640x400^", :extent=>"640x400"},
                                                                                          :medium_portrait => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"400.0x640^", :extent=>"400"},
                                                                                          :medium_square => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"640x640^", :extent=>"640x640"},
                                                                                          :small => {:resize=>"320x320", :convert=>"jpg", :background=>"none", :gravity=>"north"},
                                                                                          :small_landscape => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"320x200^", :extent=>"320x200"},
                                                                                          :small_portrait => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"200x320^", :extent=>"200x320"},
                                                                                          :small_square => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"320x320^", :extent=>"320x320"} }
    include_examples "an Attachment defined method", :manifold_attachment_alpha_styles, { :large_landscape => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"1280x800.0^", :extent=>"1280x800.0^"},
                                                                                          :medium => {:resize=>"640x640", :convert=>"png", :background=>"none", :gravity=>"north"},
                                                                                          :medium_landscape => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"640x400^", :extent=>"640x400"},
                                                                                          :medium_portrait => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"400.0x640^", :extent=>"400"},
                                                                                          :medium_square => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"640x640^", :extent=>"640x640"},
                                                                                          :small => {:resize=>"320x320", :convert=>"png", :background=>"none", :gravity=>"north"},
                                                                                          :small_landscape => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"320x200^", :extent=>"320x200"},
                                                                                          :small_portrait => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"200x320^", :extent=>"200x320"},
                                                                                          :small_square => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"320x320^", :extent=>"320x320"} }

  end
end
