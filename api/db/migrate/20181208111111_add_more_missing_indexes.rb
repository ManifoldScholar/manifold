class AddMoreMissingIndexes < ActiveRecord::Migration[5.0]
  def change
    add_index :annotations, :creator_id
    add_index :annotations, :resource_id
    add_index :annotations, :text_section_id
    add_index :categories, :project_id
    add_index :collaborators, :maker_id
    add_index :collaborators, [:collaboratable_type, :collaboratable_id], name: "index_collabs_on_collabable_type_and_collabable_id"
    add_index :collection_resources, :resource_id
    add_index :comment_hierarchies, :ancestor_id
    add_index :comments, :creator_id
    add_index :comments, :parent_id
    add_index :comments, [:subject_type, :subject_id]
    add_index :events, [:subject_type, :subject_id]
    add_index :events, [:external_subject_type, :external_subject_id], name: "index_subj_on_subj_type_and_subj_id"
    add_index :events, :project_id
    add_index :events, :created_at
    add_index :events, :twitter_query_id
    add_index :favorites, [:favoritable_type, :favoritable_id]
    add_index :favorites, :user_id
    add_index :flags, [:flaggable_type, :flaggable_id]
    add_index :ingestion_sources, :text_id
    add_index :ingestion_sources, :source_identifier
    add_index :ingestion_sources, :kind
    add_index :project_subjects, :project_id
    add_index :project_subjects, :subject_id
    add_index :resources, :project_id
    add_index :searchable_nodes, :text_section_id
    add_index :stylesheets, :text_id
    add_index :stylesheets, :ingestion_source_id
    add_index :text_sections, :source_identifier
    add_index :text_sections, :ingestion_source_id
    add_index :text_subjects, :text_id
    add_index :text_subjects, :subject_id
    add_index :text_titles, :text_id
    add_index :texts, :project_id
    add_index :texts, :category_id
    add_index :twitter_queries, :project_id
  end
end
