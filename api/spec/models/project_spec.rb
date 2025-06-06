# frozen_string_literal: true

RSpec.describe Project, type: :model do
  it "updates the sort_title when saved" do
    project = FactoryBot.build(:project, title: "A Hobbit's Journey")
    project.save
    expect(project.sort_title).to eq "Hobbit's Journey"
    project.title = "The end of the world"
    project.save
    expect(project.sort_title).to eq "end of the world"
  end

  it "has many collaborators" do
    project = described_class.new
    5.times { project.collaborators << Collaborator.new }
    expect(project.collaborators.length).to be 5
  end

  it "has many creators" do
    project = described_class.new
    2.times { project.creators.build }
    expect(project.creators.length).to be 2
  end

  it "has many texts" do
    project = described_class.new
    3.times { project.texts.build }
    expect(project.texts.length).to be 3
  end

  it "has many project_subjects" do
    project = described_class.new
    3.times { project.project_subjects.build }
    expect(project.project_subjects.length).to be 3
  end

  it "has many contributors" do
    project = described_class.new
    2.times { project.contributors.build }
    expect(project.contributors.length).to be 2
  end

  it "has many published texts" do
    project = FactoryBot.create(:project)
    text_a = FactoryBot.create(:text, project: project, published: true)
    text_b = FactoryBot.create(:text, project: project, published: true)
    FactoryBot.create(:text, project: project, published: false)

    expect(project.published_texts).to contain_exactly(text_a, text_b)
  end

  it "is valid with a creator" do
    creator = FactoryBot.create(:user)
    project = FactoryBot.create(:project, creator: creator)
    expect(project).to be_valid
  end

  it "is valid without a creator" do
    project = FactoryBot.build(:project, creator: nil)
    expect(project).to be_valid
  end

  it "triggers an event on create" do
    expect do
      FactoryBot.create(:project)
    end.to have_enqueued_job(CreateEventJob)
  end

  it "does not trigger an event on new" do
    expect do
      FactoryBot.build(:project)
    end.not_to have_enqueued_job(CreateEventJob)
  end

  it "is created as a draft" do
    project = described_class.new
    expect(project.draft).to be(true)
  end

  it "is invalid without draft state" do
    project = FactoryBot.build(:project, draft: nil)
    expect(project).not_to be_valid
  end

  it "reports that it's following twitter accounts if at least one twitter_query association" do
    project = FactoryBot.build(:project)
    FactoryBot.create(:twitter_query, project: project)
    expect(project.following_twitter_accounts?).to be true
  end

  it "reports that it's not following twitter accounts if none are associated" do
    project = FactoryBot.build(:project)
    expect(project.following_twitter_accounts?).to be false
  end

  it "correctly returns the uncollected resource count" do
    project = FactoryBot.create(:project)
    collection = FactoryBot.create(:resource_collection, project: project)
    resource_1 = FactoryBot.create(:resource, project: project)
    FactoryBot.create(:resource, project: project)
    FactoryBot.create(:resource, project: project)
    FactoryBot.create(
      :collection_resource,
      resource: resource_1,
      resource_collection: collection
    )
    expect(project.uncollected_resources.count).to be 2
  end

  context "when filtering" do
    let_it_be(:project_a, refind: true) { FactoryBot.create(:project, title: "Bartholomew Smarts", featured: true) }
    let_it_be(:project_b, refind: true) { FactoryBot.create(:project, title: "Rambo Smarts", featured: true) }

    it "can find records by keyword containing part of the title", :aggregate_failures do
      expect(described_class.filtered(keyword: "Bartholomew")).to include project_a
      expect(described_class.filtered(keyword: "Smarts")).to include project_a, project_b
    end
  end

  context "can be filtered" do
    context "when there are not models" do
      it "the results are always paginated if a page is requested" do
        described_class.destroy_all
        results = described_class.filtered(page: 1, per_page: 10, keyword: "foo")
        expect(results).to respond_to :current_page
      end
    end

    context "when there are models" do
      before do
        @user = FactoryBot.create(:user)
        @subject_a = FactoryBot.create(:subject, name: "subject_a")
        @subject_b = FactoryBot.create(:subject, name: "subject_b")
        @project_a = FactoryBot.create(:project, title: "project_a", featured: true)
        @project_b = FactoryBot.create(:project, title: "project_b", featured: false, creator: @user)
        @project_a.subjects = [@subject_a]
        @project_b.subjects = [@subject_b]
        @project_a.save
        @project_b.save
      end

      it "the results are paginated if a page is requested" do
        described_class.destroy_all
        results = described_class.filtered(page: 1, per_page: 10)
        expect(results).to respond_to :current_page
      end

      it "to only include creator's projects" do
        results = described_class.filtered(with_creator_role: true, user: @user)
        expect(results).to match_array(@project_b)
      end

      it "to only include featured" do
        results = described_class.filtered(featured: true)
        expect(results.length).to be 1
      end

      it "to only include not featured" do
        results = described_class.filtered(featured: false)
        expect(results.length).to be 1
      end

      it "to only include projects of a specific subject" do
        results = described_class.filtered(subject: @subject_a)
        expect(results.first).to eq @project_a
        results = described_class.filtered(subject: @subject_b)
        expect(results.first).to eq @project_b
      end

      it "by both subject and featured" do
        results = described_class.filtered(subject: @subject_a, featured: false)
        expect(results.length).to be 0
        results = described_class.filtered(subject: @subject_a, featured: true)
        expect(results.length).to be 1
      end

      it "allows boolean and string featured values" do
        results = described_class.filtered(featured: "true")
        expect(results.length).to be 1
      end

      it "treats 1 as true when filtering" do
        results = described_class.filtered(featured: "1")
        expect(results.length).to be 1
        results = described_class.filtered(featured: 1)
        expect(results.length).to be 1
      end

      it "applies a default scope" do
        scope = described_class.filtered

        expect(scope.order_values).to have(2).items
      end
    end
  end

  describe "its metadata" do
    it "can be set" do
      p = FactoryBot.build(:project)
      p.metadata = { "isbn" => "1234" }
      p.save
      expect(p.metadata["isbn"]).to eq "1234"
    end

    it "filters out invalid metadata" do
      p = FactoryBot.build(:project)
      p.metadata = { "isbn" => "1234", "foo" => "bar" }
      p.save
      expect(p.metadata).to eq("isbn" => "1234")
    end

    it "filters out blank metadata" do
      p = FactoryBot.build(:project)
      p.metadata = { "isbn" => "1234", "foo" => "" }
      p.save
      expect(p.metadata).to eq("isbn" => "1234")
    end
  end

  context "when avatar is present" do
    let(:avatar_path) { File.join("spec", "data", "assets", "images", "test_avatar.jpg") }
    let(:avatar) { File.new(avatar_path) }

    it "is valid without avatar color" do
      project = FactoryBot.build(:project, avatar: avatar)
      expect(project).to be_valid
    end
  end

  context "when avatar is not present" do
    it "is invalid without an avatar color" do
      project = FactoryBot.build(:project, avatar_color: nil)
      expect(project).not_to be_valid
    end

    it "is invalid with an avatar color not in list" do
      project = FactoryBot.build(:project, avatar_color: "none more black")
      expect(project).not_to be_valid
    end
  end

  context "when citations are updated" do
    before do
      @calling_class = FactoryBot.create(:project, title: "A Title")
      @child_class = FactoryBot.create(:text, project: @calling_class)
    end

    include_examples "a citable class with_citable_children"
  end

  describe ".filtered(collection_order:)" do
    let_it_be(:tag_list) { "smart" }
    let_it_be(:collected_projects) { FactoryBot.create_list :project, 7, draft: false, tag_list: tag_list }
    let(:expected_total_count) { collected_projects.length }
    let(:pages) { 1.upto(3).to_a }
    let(:total_page_count) { pages.length }

    let!(:expected_page_counts) do
      pages.index_with { |i| (i % 3).nonzero? ? 3 : 1 }
    end

    let_it_be(:other_projects) { FactoryBot.create_list :project, 7, draft: false, tag_list: "other" }
    let_it_be(:another_collection) { FactoryBot.create :project_collection, :smart, tag_list: "other" }

    def filter!(page, per_page: 3)
      Project.filtered collection_order: project_collection.slug, page: page, per_page: per_page
    end

    shared_examples_for "valid counts for a page" do |page_number|
      context "for page ##{page_number}" do
        let(:current_page) { page_number }

        let(:expected_page_count) { expected_page_counts.fetch(page_number) }

        let(:found_projects) { filter! page_number }

        it "returns the correct number of pages" do
          expect(found_projects.total_pages).to eq total_page_count
        end

        it "returns the correct number of records on the current page" do
          expect(found_projects.size).to eq expected_page_count
        end

        it "returns the correct total count of records" do
          expect(found_projects.total_count).to eq expected_total_count
        end
      end
    end

    shared_examples_for "a valid filtered collection" do
      context "across the entire collection" do
        let!(:entire_collection) { pages.flat_map { |number| filter!(number).to_a } }

        subject { entire_collection }

        it { is_expected.to have(expected_total_count).items }

        it "does not duplicate any items" do
          expect(entire_collection).to have(expected_total_count).items
        end
      end

      1.upto(3).each do |page_number|
        include_examples "valid counts for a page", page_number
      end
    end

    context "for a manual collection" do
      let_it_be(:project_collection) { FactoryBot.create :project_collection, smart: false }
      let_it_be(:other_manual_collection) { FactoryBot.create :project_collection, smart: false }

      let_it_be(:collection_projects) do
        collected_projects.map do |project|
          FactoryBot.create :collection_project, project_collection: project_collection, project: project
        end
      end

      # Ensure collection project rankings are not duplicated
      let_it_be(:other_manual_collection_projects) do
        collected_projects.map do |project|
          FactoryBot.create :collection_project, project_collection: other_manual_collection, project: project
        end
      end

      it_behaves_like "a valid filtered collection"
    end

    context "for a smart collection" do
      let_it_be(:project_collection) do
        FactoryBot.create(:project_collection, :smart, tag_list: tag_list)
      end

      it_behaves_like "a valid filtered collection"
    end
  end

  context "it correctly scopes the visible projects" do
    before do
      FactoryBot.create(:project, draft: false)
      FactoryBot.create(:project, draft: true)

      @project_b = FactoryBot.create(:project, draft: true)
    end

    it "for admin" do
      admin = FactoryBot.create(:user, :admin)

      expect(described_class.with_read_ability(admin).count).to eq 3
    end

    it "for project_editor" do
      project_editor = FactoryBot.create(:user)
      project_editor.add_role :project_editor, @project_b

      expect(described_class.with_read_ability(project_editor).count).to eq 2
    end

    it "for reader" do
      expect(described_class.with_read_ability(nil).count).to eq 1
    end

    it "for no user" do
      expect(described_class.with_read_ability(nil).count).to eq 1
    end
  end

  context "when default publisher info is set" do
    before do
      settings = Settings.instance
      settings.general = { default_publisher: "Cast Iron Coding", default_publisher_place: "Portland, OR" }
      settings.save
    end

    it "assigns the default values on create" do
      project = FactoryBot.create(:project)
      expect(project.metadata["publisher"]).to eq "Cast Iron Coding"
      expect(project.metadata["publisher_place"]).to eq "Portland, OR"
    end
  end

  context "when access is restricted" do
    it "ensures notice content is present" do
      project = FactoryBot.create(:project, restricted_access: false)

      expect do
        project.update! restricted_access: true
      end.to change(project, :restricted_access_body?).from(false).to(true)
      .and change(project, :restricted_access_heading?).from(false).to(true)
    end
  end

  describe "#standalone?" do
    context "when :disabled" do
      it "returns false" do
        expect(FactoryBot.create(:project, standalone_mode: "disabled")).not_to be_standalone
      end
    end

    context "when :enabled" do
      it "returns true" do
        expect(FactoryBot.create(:project, standalone_mode: "enabled")).to be_standalone
      end
    end

    context "when :enforced" do
      it "returns true" do
        expect(FactoryBot.create(:project, standalone_mode: "enforced")).to be_standalone
      end
    end
  end

  it_behaves_like "a model that stores its fingerprint" do
    subject { FactoryBot.create :project }
  end

  it_behaves_like "a model with formatted attributes"

  it_behaves_like "a collectable"
end
