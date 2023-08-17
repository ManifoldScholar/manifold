require "rails_helper"

RSpec.describe Resource, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:resource)).to be_valid
  end

  it "belongs to a project" do
    resource = FactoryBot.create(:resource)
    expect(resource.project).to be_a Project
  end

  it "is invalid without a title" do
    resource = FactoryBot.build(:resource, title: "")
    expect(resource).to_not be_valid
  end

  it "updates the sort_title when saved" do
    resource = FactoryBot.create(:resource, title: "A Hobbit's Journey")
    resource.title = "The end of the world"
    resource.save
    expect(resource.sort_title).to eq "The end of the world"
  end

  it "has a list of tags" do
    resource = FactoryBot.create(:resource)
    resource.tag_list = "one, two; three"
    resource.save
    expect(resource.tag_list.count).to eq(3)
  end

  it "enqueues a RESOURCE_ADDED event on creation" do
    project = FactoryBot.create(:project)
    expect(CreateEventJob).to receive(:perform_later).with(EventType[:resource_added], any_args)
    FactoryBot.create(:resource, project: project)
  end

  context "when creating" do
    it "sets the fingerprint if none provided" do
      resource = FactoryBot.create(:resource)
      expect(resource.fingerprint).to_not be_nil
    end

    it "does not overwrite provided fingerprint" do
      resource = FactoryBot.create(:resource, fingerprint: "abc123")
      expect(resource.fingerprint).to eq "abc123"
    end
  end

  it "destroys associated annotations" do
    resource = FactoryBot.create(:resource)
    FactoryBot.create(:annotation, resource: resource)
    expect { resource.destroy }.to change { Annotation.count }.from(1).to(0)
  end

  it "destroys associated creation event" do
    resource = FactoryBot.create(:resource)
    FactoryBot.create(:event, subject: resource, event_type: "resource_added")
    expect { resource.destroy }.to change { Event.count }.from(1).to(0)
  end

  describe "#parse_and_set_external_id!" do
    context "when valid :external_id" do
      let(:resource) do
        FactoryBot.build(:resource,
                         kind: "video",
                               sub_kind: "external_video",
                               external_type: "youtube",
                               external_id: "https://www.youtube.com?v=lVrAwK7FaOw")
      end

      before(:each) { resource.save }

      it "sets the :external_id" do
        expect(resource.external_id).to eq "lVrAwK7FaOw"
      end
    end

    context "when invalid :external_id" do
      let(:resource) do
        FactoryBot.build(:resource,
                         kind: "video",
                               sub_kind: "external_video",
                               external_type: "vimeo",
                               external_id: "https://www.youtube.com?v=lVrAwK7FaOw")
      end

      before(:each) { resource.save }

      it "sets an error on :external_id" do
        expect(resource.errors[:external_id]).to include "is an invalid format for vimeo"
      end
    end
  end

  context "thumbnail fetch" do
    it "queues the job when created" do
      resource = FactoryBot.build(
        :resource,
        kind: "video",
        sub_kind: "external_video",
        external_id: "lVrAwK7FaOw",
        external_type: "youtube"
      )
      expect { resource.save }.to have_enqueued_job(FetchResourceThumbnail)
    end

    it "queues the job when video id is changed" do
      resource = FactoryBot.create(
        :resource,
        kind: "video",
        sub_kind: "external_video",
        external_id: "lVrAwK7FaOw",
        external_type: "youtube"
      )
      resource.external_id = "zXg5cQZJNzA"
      expect { resource.save }.to have_enqueued_job(FetchResourceThumbnail)
    end
  end

  describe "formats some fields with a markdown subset" do
    let(:raw) { "_italic_ a **bold**" }
    let(:formatted_without_blocks) { "<em>italic</em> a <strong>bold</strong>" }
    let(:formatted_with_block) { "<p><em>italic</em> a <strong>bold</strong></p>" }

    it "has a formatted title after save" do
      resource = FactoryBot.create(:resource, title: raw)
      expect(resource.title_formatted).to eq(formatted_without_blocks)
    end

    it "has a formatted caption after save" do
      resource = FactoryBot.create(:resource, caption: raw)
      expect(resource.caption_formatted).to eq(formatted_without_blocks)
    end

    it "has a formatted description after save" do
      resource = FactoryBot.create(:resource, description: raw)
      expect(resource.description_formatted).to eq(formatted_with_block)
    end
  end

  context "can be filtered" do
    before(:each) do
      @project_a = FactoryBot.create(:project, title: "project_a")
      @project_b = FactoryBot.create(:project, title: "project_b")
      @collection_a = FactoryBot.create(:resource_collection, title: "collection_a", project: @project_a)
      @collection_b = FactoryBot.create(:resource_collection, title: "collection_b", project: @project_a)
      @resource_a = FactoryBot.create(:resource, title: "resource_a", project: @project_a)
      @resource_b = FactoryBot.create(:resource, title: "resource_b", project: @project_a)
      @resource_c = FactoryBot.create(:resource, title: "resource_c", project: @project_b, tag_list: "test")
    end

    it "and ordered by collection order" do
      collection = FactoryBot.create(:resource_collection, project: @project_a)
      collection.resources << @resource_a
      collection.resources << @resource_b
      collection.save
      results = Resource.filtered({ collection_order: collection.id })
      expect(results.first.id).to eq @resource_a.id
    end

    it "to only include those belonging to a project" do
      results = Resource.filtered({ project: @project_a })
      expect(results.length).to be 2
      results = Resource.filtered({ project: @project_b })
      expect(results.length).to be 1
    end

    it "to only include those belonging to a collection" do
      @resource_d = FactoryBot.create(:resource, title: "resource_d", project: @project_a)
      @collection_resource_a = FactoryBot.create(:collection_resource, resource_collection: @collection_a, resource: @resource_a)
      @collection_resource_b = FactoryBot.create(:collection_resource, resource_collection: @collection_a, resource: @resource_b)
      @collection_resource_c = FactoryBot.create(:collection_resource, resource_collection: @collection_b, resource: @resource_d)
      results = Resource.filtered({ resource_collection: @collection_a.id })
      expect(results.length).to be 2
      results = Resource.filtered({ resource_collection: @collection_b.id })
      expect(results.length).to be 1
    end

    it "by kind" do
      # TBD: Expand this test. Right now all factory resources are links to avoid dealing
      # with attachments.
      results = Resource.filtered({ kind: "link" })
      expect(results.length).to be 3
    end

    it "by tag" do
      results = Resource.filtered({ tag: "dog" })
      expect(results.length).to be 2
      results = Resource.filtered({ tag: "test" })
      expect(results.length).to be 1
    end
  end

  describe "kind validations" do
    KINDS = %w(image audio video spreadsheet document file presentation).freeze

    KINDS.each do |kind|
      context "when resource is a #{kind} upload" do
        it "is invalid without an attachment" do
          resource = FactoryBot.build(:resource, kind: kind)
          expect(resource).to_not be_valid
        end
      end
    end

    context "when resource is an iframe" do
      it "is invalid without an external url" do
        resource = FactoryBot.build(:resource, kind: "interactive", external_url: nil)
        expect(resource).to_not be_valid
      end
    end

    context "when resource is an external video" do
      it "is invalid without an external id" do
        resource = FactoryBot.build(:resource, kind: "video", sub_kind: "external_video", external_type: "youtube")
        expect(resource).to_not be_valid
      end

      it "is invalid without an external type" do
        resource = FactoryBot.build(:resource, kind: "video", sub_kind: "external_video", external_id: "abcd1234")
        expect(resource).to_not be_valid
      end
    end

    context "when resource is a link" do
      it "is invalid without an external url" do
        resource = FactoryBot.build(:resource, kind: "link", external_url: nil)
        expect(resource).to_not be_valid
      end
    end
  end

  context "when the resource is a PDF", slow: true do
    let(:resource) do
      FactoryBot.build(
        :resource,
        kind: "pdf",
        attachment: fixture_file_upload(Rails.root.join("spec/data/assets/pdfs/multi-page.pdf"), "application/pdf")
      )
    end
    before { perform_enqueued_jobs { resource.save } }

    it "produces attachment styles" do
      resource.reload # Reload to pick up backgrounded attachment versions.
      expect(resource.attachment_styles.values.any?(&:empty?)).to be false
    end
  end

  context "when the resource is an MP3", slow: true do
    let(:resource) do
      FactoryBot.build(
        :resource,
        kind: "audio",
        attachment: fixture_file_upload(Rails.root.join("spec/data/assets/audio/test.mp3"), "audio/mpeg")
      )
    end
    before { perform_enqueued_jobs { resource.save } }

    it "produces attachment styles" do
      resource.reload
      expect(resource.attachment_styles[:original].empty?).to be false
    end
  end

  context "when the resource is an image", slow: true do
    let(:resource) do
      FactoryBot.build(
        :resource,
        kind: "image",
        attachment: fixture_file_upload(Rails.root.join("spec/data/assets/images/test_avatar.jpg"), "image/jpg")
      )
    end
    before { perform_enqueued_jobs { resource.save } }

    it "produces attachment styles" do
      resource.reload # Reload to pick up backgrounded attachment versions.
      expect(resource.attachment_styles.values.any?(&:empty?)).to be false
    end

    it "stores attachment checksums" do
      resource.reload # Reload to pick up backgrounded attachment versions.
      resource.attachment_original.rewind
      sha = Digest::SHA256.hexdigest(resource.attachment_original.read).to_s
      expect(resource.attachment_checksum).to_not eq nil
      expect(resource.attachment_checksum).to eq sha
    end
  end

  context "when minimum dimensions are set" do
    resource = FactoryBot.create(:resource)

    it "is valid when dimensions are integers" do
      resource.minimum_width = "100"
      resource.minimum_height = "200"
      expect(resource).to be_valid
    end
    it "is valid when dimensions have allowed units" do
      resource.minimum_width = "100vw"
      resource.minimum_height = "200px"
      expect(resource).to be_valid
    end
    it "is invalid when dimensions have any other units" do
      resource.minimum_width = "100%"
      resource.minimum_height = "200pt"
      expect(resource).to be_invalid
    end
  end

  it "validates iframe allows attributes" do
    resource = FactoryBot.create(:resource)
    resource.iframe_allows = ["fullscreen", "camera"]
    expect(resource).to be_valid

    resource.iframe_allows = ["fullscreen", "camera", "autoplay"]
    expect(resource).to be_invalid
  end

  it_should_behave_like "a collectable"
end
