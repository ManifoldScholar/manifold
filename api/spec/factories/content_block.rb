FactoryBot.define do
  factory :content_block do
    type { "Content::ResourcesBlock" }
    project
  end

  factory :resources_block, parent: :content_block, class: "Content::ResourcesBlock"
  factory :toc_block, parent: :content_block, class: "Content::TableOfContentsBlock" do
    type { "Content::TableOfContentsBlock" }
    depth { 3 }
    show_authors { false }
    show_text_title { false }
    content_block_references { [FactoryBot.build(:content_block_reference, kind: "text", referencable: FactoryBot.create(:text, project: project))] }
  end
  factory :markdown_block, parent: :content_block, class: "Content::MarkdownBlock" do
    type { "Content::MarkdownBlock" }
    body { Faker::Lorem.paragraph }
    style { "shaded" }
  end
  factory :metadata_block, parent: :content_block, class: "Content::MetadataBlock" do
    type { "Content::MetadataBlock" }
  end
  factory :recent_activity_block, parent: :content_block, class: "Content::RecentActivityBlock" do
    type { "Content::RecentActivityBlock" }
  end
end
