require "rails_helper"
require "with_model"
include ActiveJob::TestHelper

RSpec.describe Attachments do
  with_model :AttachableClass do
    table do |t|
      t.string :attached_file_name
      t.integer :attached_file_size
      t.string :attached_content_type
      t.datetime :attached_updated_at

      t.jsonb :attached_data
    end

    model do
      include Attachments

      manifold_has_attached_file :attached, :image
    end
  end
  let(:instance) do
    instance = AttachableClass.new
    instance.attached = fixture_file_upload(Rails.root.join('spec', 'data','assets','images','test_avatar.jpg'))
    instance.save

    instance.reload
  end

  shared_examples_for "an Attachment defined method" do |method, expected = nil|
    describe "##{method}" do
      it "is defined" do
        expect(instance.respond_to? method).to eq true
      end

      unless expected.nil?
        it "returns the correct value" do
          perform_enqueued_jobs { instance.save }
          expect(instance.__send__ method).to eq expected
        end
      end
    end
  end

  it "builds a hash of configuration options on model" do
    expect(instance.attached_options).to eq({ :type=>:image,
                                              :no_styles=>false,
                                              :validate_content_type=>true })
  end

  it "enqueues a processing job" do
    expect{ instance.save }.to have_enqueued_job(Attachments::ProcessAttachmentJob)
  end

  describe "methods added for an image attachment called 'attached'" do
    include_examples "an Attachment defined method", :attached_styles #TODO: These values include the generated paths
    include_examples "an Attachment defined method", :attached_url #TODO: These values include the generated paths

    include_examples "an Attachment defined method", :attached_extension, "jpg"
    include_examples "an Attachment defined method", :attached_file_name, "test_avatar.jpg"
    include_examples "an Attachment defined method", :attached_file_size, 64254
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
                                                                                          :medium => {:geometry=>"640x640", :convert=>"jpg", :background=>"none", :gravity=>"north"},
                                                                                          :medium_landscape => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"640x400^", :extent=>"640x400"},
                                                                                          :medium_portrait => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"400.0x640^", :extent=>"400"},
                                                                                          :medium_square => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"640x640^", :extent=>"640x640"},
                                                                                          :small => {:geometry=>"320x320", :convert=>"jpg", :background=>"none", :gravity=>"north"},
                                                                                          :small_landscape => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"320x200^", :extent=>"320x200"},
                                                                                          :small_portrait => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"200x320^", :extent=>"200x320"},
                                                                                          :small_square => {:convert=>"jpg", :background=>"none", :gravity=>"north", :thumbnail=>"320x320^", :extent=>"320x320"} }
    include_examples "an Attachment defined method", :manifold_attachment_alpha_styles, { :large_landscape => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"1280x800.0^", :extent=>"1280x800.0^"},
                                                                                          :medium => {:geometry=>"640x640", :convert=>"png", :background=>"none", :gravity=>"north"},
                                                                                          :medium_landscape => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"640x400^", :extent=>"640x400"},
                                                                                          :medium_portrait => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"400.0x640^", :extent=>"400"},
                                                                                          :medium_square => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"640x640^", :extent=>"640x640"},
                                                                                          :small => {:geometry=>"320x320", :convert=>"png", :background=>"none", :gravity=>"north"},
                                                                                          :small_landscape => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"320x200^", :extent=>"320x200"},
                                                                                          :small_portrait => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"200x320^", :extent=>"200x320"},
                                                                                          :small_square => {:convert=>"png", :background=>"none", :gravity=>"north", :thumbnail=>"320x320^", :extent=>"320x320"} }
  end
end
