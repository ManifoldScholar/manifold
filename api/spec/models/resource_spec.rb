require "rails_helper"

RSpec.describe Resource, type: :model do

  it "has a valid factory" do
    expect(FactoryGirl.build(:resource)).to be_valid
  end

  it "belongs to a project" do
    resource = FactoryGirl.create(:resource)
    expect(resource.project).to be_a Project
  end

  it "is invalid without a title" do
    resource = FactoryGirl.build(:resource, title: "")
    expect(resource).to_not be_valid
  end

  it "has a list of tags" do
    resource = FactoryGirl.create(:resource)
    resource.keywords = "one, two; three"
    resource.save
    expect(resource.tag_list.count).to eq(3)
  end

  it "creates a RESOURCE_ADDED event on creation" do
    resource = FactoryGirl.create(:resource)
    event = resource.project.events.first
    expect(event).to_not be_nil
    expect(event.event_type).to eq(Event::RESOURCE_ADDED)
  end

  describe "formats some fields with a markdown subset" do
    let(:raw) { "_italic_ a **bold**"}
    let(:formatted_without_blocks) { "<em>italic</em> a <strong>bold</strong>"}
    let(:formatted_with_block) { "<p><em>italic</em> a <strong>bold</strong></p>"}

    it "has a formatted title after save" do
      resource = FactoryGirl.create(:resource, title: raw)
      expect(resource.title_formatted).to eq(formatted_without_blocks)
    end

    it "has a formatted caption after save" do
      resource = FactoryGirl.create(:resource, caption: raw)
      expect(resource.caption_formatted).to eq(formatted_without_blocks)
    end

    it "has a formatted description after save" do
      resource = FactoryGirl.create(:resource, description: raw)
      expect(resource.description_formatted).to eq(formatted_with_block)
    end
  end

  it { is_expected.to have_attached_file(:attachment) }

  context "can be filtered" do

    before(:each) do
      @project_a = FactoryGirl.create(:project, title: "project_a")
      @project_b = FactoryGirl.create(:project, title: "project_b")
      @resource_a = FactoryGirl.create(:resource, title: "resource_a", project: @project_a)
      @resource_b = FactoryGirl.create(:resource, title: "resource_b", project: @project_a)
      @resource_c = FactoryGirl.create(:resource, title: "resource_c", project: @project_b, keywords: "test")
    end

    it "and ordered by collection order" do
      collection = FactoryGirl.create(:collection, project: @project_a)
      collection.resources << @resource_a
      collection.resources << @resource_b
      collection.save
      results = Resource.filter({collection_order: collection.id})
      expect(results.first.id).to eq @resource_a.id
    end

    it "to only include those belonging to a project" do
      results = Resource.filter({project: @project_a})
      expect(results.length).to be 2
      results = Resource.filter({project: @project_b})
      expect(results.length).to be 1
    end

    it "by kind" do
      # TBD: Expand this test. Right now all factory resources are links to avoid dealing
      # with attachments.
      results = Resource.filter({kind: "link"})
      expect(results.length).to be 3
    end

    it "by tag" do
      results = Resource.filter({tag: "dog"})
      expect(results.length).to be 2
      results = Resource.filter({tag: "test"})
      expect(results.length).to be 1
    end
  end

  describe "kind validations" do
    KINDS = %w(image audio video spreadsheet document file presentation).freeze

    KINDS.each do |kind|
      context "when resource is a #{kind} upload" do
        it "is invalid without an attachment" do
          resource = FactoryGirl.build(:resource, kind: kind)
          expect(resource).to_not be_valid
        end
      end
    end

    context "when resource is an iframe" do
      it "is invalid without dimensions" do
        resource = FactoryGirl.build(:resource, kind: "interactive", sub_kind: "iframe")
        expect(resource).to_not be_valid
      end

      it "is invalid without an external url" do
        resource = FactoryGirl.build(:resource, kind: "interactive", sub_kind: "iframe",
                                     iframe_dimensions: "640x480", external_url: nil)
        expect(resource).to_not be_valid
      end
    end

    context "when resource is an embed" do
      it "is invalid without the embed code" do
        resource = FactoryGirl.build(:resource, kind: "interactive")
        expect(resource).to_not be_valid
      end
    end

    context "when resource is an external video" do
      it "is invalid without an external id" do
        resource = FactoryGirl.build(:resource, kind: "video", sub_kind: "external_video", external_type: "youtube")
        expect(resource).to_not be_valid
      end

      it "is invalid without an external type" do
        resource = FactoryGirl.build(:resource, kind: "video", sub_kind: "external_video", external_id: "abcd1234")
        expect(resource).to_not be_valid
      end
    end

    context "when resource is a link" do
      it "is invalid without an external url" do
        resource = FactoryGirl.build(:resource, kind: "link", external_url: nil)
        expect(resource).to_not be_valid
      end
    end
  end
end
