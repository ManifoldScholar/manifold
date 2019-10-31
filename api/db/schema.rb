# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_11_30_212914) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "pg_trgm"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "action_callouts", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "title"
    t.string "url"
    t.integer "kind", default: 0, null: false
    t.integer "location", default: 0, null: false
    t.jsonb "attachment_data", default: {}
    t.boolean "button", default: false
    t.integer "position", default: 1, null: false
    t.uuid "project_id"
    t.uuid "text_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_action_callouts_on_project_id"
    t.index ["text_id"], name: "index_action_callouts_on_text_id"
  end

  create_table "annotations", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "start_node"
    t.string "end_node"
    t.integer "start_char"
    t.integer "end_char"
    t.text "subject"
    t.uuid "text_section_id"
    t.string "format"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "creator_id"
    t.uuid "resource_id"
    t.text "body"
    t.boolean "private", default: false
    t.integer "comments_count", default: 0
    t.uuid "resource_collection_id"
    t.integer "events_count", default: 0
    t.boolean "orphaned", default: false, null: false
    t.integer "flags_count", default: 0
    t.uuid "reading_group_id"
    t.index ["created_at"], name: "index_annotations_on_created_at", using: :brin
    t.index ["creator_id"], name: "index_annotations_on_creator_id"
    t.index ["format"], name: "index_annotations_on_format"
    t.index ["reading_group_id"], name: "index_annotations_on_reading_group_id"
    t.index ["resource_id"], name: "index_annotations_on_resource_id"
    t.index ["text_section_id"], name: "index_annotations_on_text_section_id"
  end

  create_table "cached_external_source_links", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "cached_external_source_id", null: false
    t.uuid "text_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cached_external_source_id", "text_id"], name: "index_cached_external_source_link_uniqueness", unique: true
    t.index ["cached_external_source_id"], name: "index_cached_external_source_links_on_cached_external_source_id"
    t.index ["text_id"], name: "index_cached_external_source_links_on_text_id"
  end

  create_table "cached_external_sources", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "url", null: false
    t.text "source_identifier", null: false
    t.text "kind", default: "unknown", null: false
    t.text "content_type", null: false
    t.jsonb "asset_data"
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source_identifier"], name: "index_cached_external_sources_on_source_identifier", unique: true
    t.index ["url"], name: "index_cached_external_sources_on_url", unique: true
  end

  create_table "categories", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "project_id"
    t.string "title"
    t.string "role"
    t.integer "position"
    t.index ["project_id"], name: "index_categories_on_project_id"
  end

  create_table "collaborators", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "maker_id"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position"
    t.string "collaboratable_type"
    t.uuid "collaboratable_id"
    t.index ["collaboratable_type", "collaboratable_id"], name: "index_collabs_on_collabable_type_and_collabable_id"
    t.index ["maker_id"], name: "index_collaborators_on_maker_id"
  end

  create_table "collection_projects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "project_collection_id", null: false
    t.uuid "project_id", null: false
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_collection_id"], name: "index_collection_projects_on_project_collection_id"
    t.index ["project_id", "project_collection_id"], name: "by_project_and_project_collection", unique: true
    t.index ["project_id"], name: "index_collection_projects_on_project_id"
  end

  create_table "collection_resources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "resource_id"
    t.uuid "resource_collection_id"
    t.integer "position", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resource_collection_id"], name: "index_collection_resources_on_resource_collection_id"
    t.index ["resource_id"], name: "index_collection_resources_on_resource_id"
  end

  create_table "comment_hierarchies", id: false, force: :cascade do |t|
    t.uuid "ancestor_id", null: false
    t.uuid "descendant_id", null: false
    t.integer "generations", null: false
    t.index ["ancestor_id", "descendant_id", "generations"], name: "comment_anc_desc_idx", unique: true
    t.index ["ancestor_id"], name: "index_comment_hierarchies_on_ancestor_id"
    t.index ["descendant_id"], name: "comment_desc_idx"
  end

  create_table "comments", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.text "body"
    t.uuid "creator_id"
    t.uuid "parent_id"
    t.uuid "subject_id"
    t.string "subject_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "deleted", default: false
    t.integer "children_count", default: 0
    t.integer "flags_count", default: 0
    t.integer "sort_order"
    t.integer "events_count", default: 0
    t.index ["created_at"], name: "index_comments_on_created_at", using: :brin
    t.index ["creator_id"], name: "index_comments_on_creator_id"
    t.index ["parent_id"], name: "index_comments_on_parent_id"
    t.index ["subject_type", "subject_id"], name: "index_comments_on_subject_type_and_subject_id"
  end

  create_table "content_block_references", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "content_block_id"
    t.string "referencable_type"
    t.uuid "referencable_id"
    t.string "kind", null: false
    t.index ["content_block_id"], name: "index_content_block_references_on_content_block_id"
    t.index ["referencable_type", "referencable_id"], name: "index_content_block_references_on_referencable"
  end

  create_table "content_blocks", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "type", null: false
    t.jsonb "configuration", default: {}, null: false
    t.integer "position"
    t.uuid "project_id"
    t.boolean "visible", default: true, null: false
    t.index ["project_id"], name: "index_content_blocks_on_project_id"
  end

  create_table "events", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "event_type"
    t.string "event_url"
    t.uuid "subject_id"
    t.string "subject_type"
    t.string "subject_title"
    t.string "subject_subtitle"
    t.string "attribution_name"
    t.string "attribution_url"
    t.string "attribution_identifier"
    t.text "excerpt"
    t.uuid "project_id"
    t.string "event_title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "event_subtitle"
    t.string "external_subject_id"
    t.string "external_subject_type"
    t.uuid "twitter_query_id"
    t.index ["created_at"], name: "index_events_on_created_at"
    t.index ["external_subject_type", "external_subject_id"], name: "index_subj_on_subj_type_and_subj_id"
    t.index ["project_id"], name: "index_events_on_project_id"
    t.index ["subject_type", "subject_id"], name: "index_events_on_subject_type_and_subject_id"
    t.index ["twitter_query_id"], name: "index_events_on_twitter_query_id"
  end

  create_table "favorites", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "favoritable_id"
    t.string "favoritable_type"
    t.uuid "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["favoritable_type", "favoritable_id"], name: "index_favorites_on_favoritable_type_and_favoritable_id"
    t.index ["user_id"], name: "index_favorites_on_user_id"
  end

  create_table "features", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "header"
    t.string "subheader"
    t.string "body"
    t.string "link_text"
    t.string "link_url"
    t.string "link_target"
    t.string "background_file_name_deprecated"
    t.string "background_content_type_deprecated"
    t.integer "background_file_size_deprecated"
    t.datetime "background_updated_at_deprecated"
    t.string "foreground_file_name_deprecated"
    t.string "foreground_content_type_deprecated"
    t.integer "foreground_file_size_deprecated"
    t.datetime "foreground_updated_at_deprecated"
    t.integer "position"
    t.text "style", default: "dark"
    t.boolean "hidden", default: false
    t.uuid "creator_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "background_color"
    t.string "foreground_color"
    t.string "header_color"
    t.string "layout"
    t.string "foreground_top"
    t.string "foreground_left"
    t.string "foreground_position"
    t.boolean "live", default: false
    t.jsonb "background_data", default: {}
    t.jsonb "foreground_data", default: {}
    t.boolean "include_sign_up", default: false, null: false
  end

  create_table "flags", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "creator_id"
    t.uuid "flaggable_id"
    t.string "flaggable_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["flaggable_type", "flaggable_id"], name: "index_flags_on_flaggable_type_and_flaggable_id"
  end

  create_table "friendly_id_slugs", id: :serial, force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
  end

  create_table "identities", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.text "provider", null: false
    t.text "uid", null: false
    t.jsonb "info", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid", "provider"], name: "index_identities_on_uid_and_provider", unique: true
    t.index ["user_id"], name: "index_identities_on_user_id"
  end

  create_table "import_selection_matches", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "import_selection_id", null: false
    t.uuid "text_section_id", null: false
    t.uuid "annotation_id"
    t.integer "start_char"
    t.integer "end_char"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["annotation_id"], name: "index_import_selection_matches_on_annotation_id"
    t.index ["import_selection_id"], name: "index_import_selection_matches_on_import_selection_id"
    t.index ["text_section_id"], name: "index_import_selection_matches_on_text_section_id"
  end

  create_table "import_selections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "text_id", null: false
    t.string "source_text_id", null: false
    t.text "previous_text"
    t.text "previous_body"
    t.text "body", null: false
    t.text "next_body"
    t.text "next_text"
    t.integer "matches_count", default: 0, null: false
    t.jsonb "comments", default: [], null: false
    t.jsonb "highlights", default: [], null: false
    t.datetime "imported_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["imported_at"], name: "index_import_selections_on_imported_at"
    t.index ["matches_count"], name: "index_import_selections_on_matches_count"
    t.index ["source_text_id"], name: "index_import_selections_on_source_text_id"
    t.index ["text_id"], name: "index_import_selections_on_text_id"
  end

  create_table "ingestion_sources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "text_id"
    t.string "source_identifier"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "kind"
    t.text "source_path"
    t.string "attachment_file_name_deprecated"
    t.string "attachment_content_type_deprecated"
    t.integer "attachment_file_size_deprecated"
    t.datetime "attachment_updated_at_deprecated"
    t.jsonb "attachment_data", default: {}
    t.index ["kind"], name: "index_ingestion_sources_on_kind"
    t.index ["source_identifier"], name: "index_ingestion_sources_on_source_identifier"
    t.index ["text_id"], name: "index_ingestion_sources_on_text_id"
  end

  create_table "ingestions", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "state"
    t.string "log", array: true
    t.string "source_file_name"
    t.string "source_content_type"
    t.integer "source_file_size"
    t.datetime "source_updated_at"
    t.string "strategy"
    t.string "external_source_url"
    t.string "ingestion_type"
    t.uuid "creator_id", null: false
    t.uuid "text_id"
    t.uuid "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "source_data", default: {}, null: false
    t.index ["creator_id"], name: "index_ingestions_on_creator_id"
    t.index ["project_id"], name: "index_ingestions_on_project_id"
    t.index ["state"], name: "index_ingestions_on_state"
    t.index ["text_id"], name: "index_ingestions_on_text_id"
  end

  create_table "makers", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "middle_name"
    t.string "last_name"
    t.string "display_name"
    t.string "avatar_file_name_deprecated"
    t.string "avatar_content_type_deprecated"
    t.integer "avatar_file_size_deprecated"
    t.datetime "avatar_updated_at_deprecated"
    t.string "suffix"
    t.jsonb "avatar_data", default: {}
    t.string "prefix"
    t.string "cached_full_name"
    t.index "(((COALESCE(last_name, ''::character varying))::text || (COALESCE(first_name, ''::character varying))::text))", name: "index_makers_sort_by_name"
  end

  create_table "notification_preferences", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "kind", null: false
    t.string "frequency", default: "never", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["frequency"], name: "index_notification_preferences_on_frequency"
    t.index ["kind"], name: "index_notification_preferences_on_kind"
    t.index ["user_id", "kind"], name: "index_notification_preferences_on_user_id_and_kind", unique: true
    t.index ["user_id"], name: "index_notification_preferences_on_user_id"
  end

  create_table "pages", id: :serial, force: :cascade do |t|
    t.string "title"
    t.string "nav_title"
    t.boolean "show_in_footer", default: false
    t.boolean "show_in_header", default: false
    t.string "slug"
    t.boolean "hidden", default: true
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_external_link", default: false
    t.text "external_link"
    t.boolean "open_in_new_tab", default: false
    t.uuid "creator_id"
    t.string "purpose", default: "supplemental_content"
    t.index ["slug"], name: "index_pages_on_slug", unique: true
  end

  create_table "project_collection_subjects", id: :serial, force: :cascade do |t|
    t.uuid "project_collection_id", null: false
    t.uuid "subject_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_collection_id"], name: "index_project_collection_subjects_on_project_collection_id"
    t.index ["subject_id"], name: "index_project_collection_subjects_on_subject_id"
  end

  create_table "project_collections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "title", null: false
    t.integer "position"
    t.string "sort_order", default: "created_at_asc", null: false
    t.boolean "smart", default: false, null: false
    t.boolean "visible", default: false, null: false
    t.boolean "homepage", default: false, null: false
    t.string "icon"
    t.integer "number_of_projects"
    t.boolean "featured_only", default: false, null: false
    t.string "slug"
    t.string "description"
    t.uuid "creator_id"
    t.integer "collection_projects_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "descriptions"
    t.date "homepage_start_date"
    t.date "homepage_end_date"
    t.integer "homepage_count"
    t.index ["creator_id"], name: "index_project_collections_on_creator_id"
    t.index ["homepage_end_date"], name: "index_project_collections_on_homepage_end_date"
    t.index ["homepage_start_date"], name: "index_project_collections_on_homepage_start_date"
    t.index ["slug"], name: "index_project_collections_on_slug", unique: true
  end

  create_table "project_subjects", id: :serial, force: :cascade do |t|
    t.uuid "project_id"
    t.uuid "subject_id"
    t.index ["project_id"], name: "index_project_subjects_on_project_id"
    t.index ["subject_id"], name: "index_project_subjects_on_subject_id"
  end

  create_table "projects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "title"
    t.string "subtitle"
    t.text "description"
    t.string "cover_file_name_deprecated"
    t.string "cover_content_type_deprecated"
    t.integer "cover_file_size_deprecated"
    t.datetime "cover_updated_at_deprecated"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "featured", default: false
    t.string "hashtag"
    t.string "purchase_url"
    t.bigint "purchase_price_in_cents"
    t.string "purchase_price_currency"
    t.string "purchase_call_to_action"
    t.string "instagram_id"
    t.string "twitter_id"
    t.string "facebook_id"
    t.string "hero_file_name_deprecated"
    t.string "hero_content_type_deprecated"
    t.integer "hero_file_size_deprecated"
    t.datetime "hero_updated_at_deprecated"
    t.string "avatar_file_name_deprecated"
    t.string "avatar_content_type_deprecated"
    t.integer "avatar_file_size_deprecated"
    t.datetime "avatar_updated_at_deprecated"
    t.jsonb "metadata", default: {}
    t.uuid "creator_id"
    t.date "publication_date"
    t.string "slug"
    t.string "avatar_color", default: "primary"
    t.jsonb "citations", default: {}
    t.boolean "draft", default: true, null: false
    t.boolean "hide_activity", default: false
    t.citext "sort_title"
    t.integer "events_count", default: 0
    t.string "download_url"
    t.string "download_call_to_action"
    t.jsonb "cover_data", default: {}
    t.jsonb "hero_data", default: {}
    t.jsonb "avatar_data", default: {}
    t.boolean "dark_mode", default: false, null: false
    t.text "image_credits"
    t.integer "standalone_mode", default: 0, null: false
    t.string "standalone_mode_press_bar_text"
    t.string "standalone_mode_press_bar_url"
    t.boolean "finished", default: false
    t.integer "resource_collections_count", default: 0
    t.integer "resources_count", default: 0
    t.string "cached_title_formatted"
    t.string "cached_subtitle_formatted"
    t.string "cached_title_plaintext"
    t.string "cached_subtitle_plaintext"
    t.index ["slug"], name: "index_projects_on_slug", unique: true
  end

  create_table "reading_group_memberships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "reading_group_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "anonymous_label"
    t.index ["reading_group_id", "anonymous_label"], name: "anonymous_label_index", unique: true
    t.index ["reading_group_id"], name: "index_reading_group_memberships_on_reading_group_id"
    t.index ["user_id", "reading_group_id"], name: "index_reading_group_memberships_on_user_id_and_reading_group_id", unique: true
    t.index ["user_id"], name: "index_reading_group_memberships_on_user_id"
  end

  create_table "reading_groups", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "privacy", default: "private"
    t.string "invitation_code"
    t.boolean "notify_on_join", default: true
    t.integer "memberships_count", default: 0, null: false
    t.uuid "creator_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_reading_groups_on_creator_id"
    t.index ["invitation_code"], name: "index_reading_groups_on_invitation_code", unique: true
  end

  create_table "resource_collections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.uuid "project_id"
    t.string "thumbnail_file_name_deprecated"
    t.string "thumbnail_content_type_deprecated"
    t.integer "thumbnail_file_size_deprecated"
    t.datetime "thumbnail_updated_at_deprecated"
    t.string "thumbnail_checksum"
    t.string "fingerprint"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.integer "collection_resources_count", default: 0
    t.integer "events_count", default: 0
    t.jsonb "thumbnail_data", default: {}
    t.index ["project_id"], name: "index_resource_collections_on_project_id"
    t.index ["slug"], name: "index_resource_collections_on_slug", unique: true
  end

  create_table "resource_import_row_transitions", id: :serial, force: :cascade do |t|
    t.string "to_state", null: false
    t.jsonb "metadata", default: {}
    t.integer "sort_key", null: false
    t.uuid "resource_import_row_id", null: false
    t.boolean "most_recent", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resource_import_row_id", "most_recent"], name: "index_resource_import_row_transitions_parent_most_recent", unique: true, where: "most_recent"
    t.index ["resource_import_row_id", "sort_key"], name: "index_resource_import_row_transitions_parent_sort", unique: true
  end

  create_table "resource_import_rows", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "resource_import_id"
    t.uuid "resource_id"
    t.uuid "resource_collection_id"
    t.string "row_type", default: "data"
    t.integer "line_number", null: false
    t.text "values", default: [], array: true
    t.text "import_errors", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resource_collection_id"], name: "index_resource_import_rows_on_resource_collection_id"
    t.index ["resource_id"], name: "index_resource_import_rows_on_resource_id"
    t.index ["resource_import_id"], name: "index_resource_import_rows_on_resource_import_id"
  end

  create_table "resource_import_transitions", id: :serial, force: :cascade do |t|
    t.string "to_state", null: false
    t.jsonb "metadata", default: {}
    t.integer "sort_key", null: false
    t.uuid "resource_import_id", null: false
    t.boolean "most_recent", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resource_import_id", "most_recent"], name: "index_resource_import_transitions_parent_most_recent", unique: true, where: "most_recent"
    t.index ["resource_import_id", "sort_key"], name: "index_resource_import_transitions_parent_sort", unique: true
  end

  create_table "resource_imports", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "creator_id"
    t.uuid "project_id"
    t.string "storage_type"
    t.string "storage_identifier"
    t.string "source", null: false
    t.string "data_file_name_deprecated"
    t.string "data_content_type_deprecated"
    t.integer "data_file_size_deprecated"
    t.datetime "data_updated_at_deprecated"
    t.string "url"
    t.integer "header_row", default: 1
    t.jsonb "column_map", default: {}, null: false
    t.jsonb "column_automap", default: {}, null: false
    t.boolean "parse_error", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "data_data", default: {}
    t.index ["creator_id"], name: "index_resource_imports_on_creator_id"
    t.index ["project_id"], name: "index_resource_imports_on_project_id"
  end

  create_table "resources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "title"
    t.string "kind"
    t.string "attachment_file_name_deprecated"
    t.string "attachment_content_type_deprecated"
    t.integer "attachment_file_size_deprecated"
    t.datetime "attachment_updated_at_deprecated"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "creator_id"
    t.uuid "project_id"
    t.text "caption"
    t.text "description"
    t.string "fingerprint"
    t.string "external_url"
    t.string "external_id"
    t.string "external_type"
    t.boolean "allow_high_res", default: true
    t.boolean "allow_download", default: true
    t.boolean "doi_requested", default: false
    t.datetime "doi_added"
    t.string "high_res_checksum"
    t.string "transcript_checksum"
    t.string "translation_checksum"
    t.string "attachment_checksum"
    t.string "high_res_file_name_deprecated"
    t.string "high_res_content_type_deprecated"
    t.integer "high_res_file_size_deprecated"
    t.datetime "high_res_updated_at_deprecated"
    t.string "transcript_file_name_deprecated"
    t.string "transcript_content_type_deprecated"
    t.integer "transcript_file_size_deprecated"
    t.datetime "transcript_updated_at_deprecated"
    t.string "translation_file_name_deprecated"
    t.string "translation_content_type_deprecated"
    t.integer "translation_file_size_deprecated"
    t.datetime "translation_updated_at_deprecated"
    t.string "variant_format_one_file_name_deprecated"
    t.string "variant_format_one_content_type_deprecated"
    t.integer "variant_format_one_file_size_deprecated"
    t.datetime "variant_format_one_updated_at_deprecated"
    t.string "variant_format_two_file_name_deprecated"
    t.string "variant_format_two_content_type_deprecated"
    t.integer "variant_format_two_file_size_deprecated"
    t.datetime "variant_format_two_updated_at_deprecated"
    t.string "variant_thumbnail_file_name_deprecated"
    t.string "variant_thumbnail_content_type_deprecated"
    t.integer "variant_thumbnail_file_size_deprecated"
    t.datetime "variant_thumbnail_updated_at_deprecated"
    t.string "variant_poster_file_name_deprecated"
    t.string "variant_poster_content_type_deprecated"
    t.integer "variant_poster_file_size_deprecated"
    t.datetime "variant_poster_updated_at_deprecated"
    t.text "embed_code"
    t.string "sub_kind"
    t.string "slug"
    t.integer "comments_count", default: 0
    t.jsonb "metadata", default: {}
    t.integer "events_count", default: 0
    t.integer "minimum_width"
    t.integer "minimum_height"
    t.boolean "iframe_allow_fullscreen", default: true
    t.citext "sort_title"
    t.jsonb "attachment_data", default: {}
    t.jsonb "high_res_data", default: {}
    t.jsonb "transcript_data", default: {}
    t.jsonb "translation_data", default: {}
    t.jsonb "variant_format_one_data", default: {}
    t.jsonb "variant_format_two_data", default: {}
    t.jsonb "variant_thumbnail_data", default: {}
    t.jsonb "variant_poster_data", default: {}
    t.string "pending_sort_title"
    t.index ["project_id"], name: "index_resources_on_project_id"
    t.index ["slug"], name: "index_resources_on_slug", unique: true
  end

  create_table "roles", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "resource_type"
    t.uuid "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id", unique: true
    t.index ["name"], name: "index_roles_on_name"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "settings", id: :serial, force: :cascade do |t|
    t.jsonb "general", default: {}
    t.jsonb "theme", default: {}
    t.integer "singleton_guard"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "press_logo_file_name_deprecated"
    t.string "press_logo_content_type_deprecated"
    t.integer "press_logo_file_size_deprecated"
    t.datetime "press_logo_updated_at_deprecated"
    t.jsonb "integrations", default: {}
    t.jsonb "secrets", default: {}
    t.jsonb "email", default: {}
    t.string "press_logo_footer_file_name_deprecated"
    t.string "press_logo_footer_content_type_deprecated"
    t.integer "press_logo_footer_file_size_deprecated"
    t.datetime "press_logo_footer_updated_at_deprecated"
    t.string "press_logo_mobile_file_name_deprecated"
    t.string "press_logo_mobile_content_type_deprecated"
    t.integer "press_logo_mobile_file_size_deprecated"
    t.datetime "press_logo_mobile_updated_at_deprecated"
    t.jsonb "press_logo_data", default: {}
    t.jsonb "press_logo_footer_data", default: {}
    t.jsonb "press_logo_mobile_data", default: {}
    t.jsonb "favicon_data", default: {}
    t.index ["singleton_guard"], name: "index_settings_on_singleton_guard", unique: true
  end

  create_table "stylesheets", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "name"
    t.string "source_identifier"
    t.text "styles"
    t.text "raw_styles"
    t.uuid "text_id"
    t.uuid "ingestion_source_id"
    t.boolean "ingested", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position"
    t.uuid "creator_id"
    t.string "hashed_content"
    t.index ["ingestion_source_id"], name: "index_stylesheets_on_ingestion_source_id"
    t.index ["text_id"], name: "index_stylesheets_on_text_id"
  end

  create_table "subjects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.uuid "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "text_exports", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "text_id", null: false
    t.text "export_kind", default: "unknown", null: false
    t.text "fingerprint", null: false
    t.jsonb "asset_data"
    t.jsonb "integrity_check", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["asset_data"], name: "index_text_exports_on_asset_data", using: :gin
    t.index ["text_id", "export_kind", "fingerprint"], name: "index_text_exports_uniqueness", unique: true
    t.index ["text_id"], name: "index_text_exports_on_text_id"
  end

  create_table "text_section_stylesheets", id: :serial, force: :cascade do |t|
    t.uuid "text_section_id", null: false
    t.uuid "stylesheet_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["stylesheet_id"], name: "index_text_section_stylesheets_on_stylesheet_id"
    t.index ["text_section_id"], name: "index_text_section_stylesheets_on_text_section_id"
  end

  create_table "text_sections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "name"
    t.text "source_body"
    t.text "body"
    t.string "source_identifier"
    t.uuid "text_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "kind"
    t.uuid "ingestion_source_id"
    t.jsonb "body_json", default: "{}", null: false
    t.jsonb "citations", default: {}
    t.index ["ingestion_source_id"], name: "index_text_sections_on_ingestion_source_id"
    t.index ["source_identifier"], name: "index_text_sections_on_source_identifier"
    t.index ["text_id"], name: "index_text_sections_on_text_id"
  end

  create_table "text_subjects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "text_id"
    t.uuid "subject_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["subject_id"], name: "index_text_subjects_on_subject_id"
    t.index ["text_id"], name: "index_text_subjects_on_text_id"
  end

  create_table "text_titles", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "value"
    t.string "kind"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "text_id"
    t.string "cached_value_formatted"
    t.string "cached_value_plaintext"
    t.index ["text_id"], name: "index_text_titles_on_text_id"
  end

  create_table "texts", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "publication_date"
    t.string "description"
    t.text "toc"
    t.text "page_list"
    t.text "landmarks"
    t.text "structure_titles"
    t.uuid "project_id"
    t.uuid "category_id"
    t.uuid "creator_id"
    t.uuid "start_text_section_id"
    t.integer "position"
    t.string "spine", default: [], array: true
    t.jsonb "metadata", default: {}
    t.string "slug"
    t.jsonb "citations", default: {}
    t.string "section_kind"
    t.integer "events_count", default: 0
    t.jsonb "cover_data", default: {}
    t.boolean "published", default: false, null: false
    t.string "cached_description_formatted"
    t.string "cached_description_plaintext"
    t.index ["category_id"], name: "index_texts_on_category_id"
    t.index ["created_at"], name: "index_texts_on_created_at", using: :brin
    t.index ["project_id"], name: "index_texts_on_project_id"
    t.index ["slug"], name: "index_texts_on_slug", unique: true
  end

  create_table "thumbnail_fetch_attempts", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.boolean "successful", default: false, null: false
    t.integer "attempts", default: 0
    t.string "reference"
    t.uuid "resource_id"
    t.index ["resource_id"], name: "index_thumbnail_fetch_attempts_on_resource_id"
  end

  create_table "twitter_queries", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "project_id"
    t.uuid "creator_id"
    t.string "query"
    t.boolean "active", default: true, null: false
    t.integer "events_count", default: 0
    t.string "result_type", default: "most_recent"
    t.string "most_recent_tweet_id"
    t.index ["project_id"], name: "index_twitter_queries_on_project_id"
  end

  create_table "upgrade_results", primary_key: "version", id: :string, force: :cascade do |t|
    t.text "output", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.citext "email"
    t.string "first_name"
    t.string "last_name"
    t.string "password_digest"
    t.string "password"
    t.string "password_confirmation"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text "nickname"
    t.string "avatar_file_name_deprecated"
    t.string "avatar_content_type_deprecated"
    t.integer "avatar_file_size_deprecated"
    t.datetime "avatar_updated_at_deprecated"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.jsonb "raw_persistent_ui", default: {}, null: false
    t.string "classification", default: "default", null: false
    t.datetime "imported_at"
    t.string "import_source_id"
    t.jsonb "avatar_data", default: {}
    t.index ["classification"], name: "udx_users_anonymous", unique: true, where: "((classification)::text = 'anonymous'::text)"
    t.index ["classification"], name: "udx_users_cli", unique: true, where: "((classification)::text = 'command_line'::text)"
    t.index ["import_source_id"], name: "index_users_on_import_source_id", unique: true, where: "(import_source_id IS NOT NULL)"
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "role_id", null: false
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id", unique: true
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "versions", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "item_type", null: false
    t.uuid "item_id", null: false
    t.string "parent_item_type"
    t.uuid "parent_item_id"
    t.string "event", null: false
    t.string "whodunnit"
    t.jsonb "object"
    t.jsonb "object_changes"
    t.datetime "created_at"
    t.index ["created_at"], name: "index_versions_on_created_at", using: :brin
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
    t.index ["parent_item_type", "parent_item_id"], name: "index_versions_on_parent_item_type_and_parent_item_id"
  end

  add_foreign_key "annotations", "reading_groups", on_delete: :nullify
  add_foreign_key "cached_external_source_links", "cached_external_sources", on_delete: :cascade
  add_foreign_key "cached_external_source_links", "texts", on_delete: :cascade
  add_foreign_key "identities", "users", on_delete: :cascade
  add_foreign_key "import_selection_matches", "annotations", on_delete: :nullify
  add_foreign_key "import_selection_matches", "import_selections", on_delete: :cascade
  add_foreign_key "import_selection_matches", "text_sections", on_delete: :cascade
  add_foreign_key "import_selections", "texts", on_delete: :cascade
  add_foreign_key "ingestions", "projects", on_delete: :restrict
  add_foreign_key "ingestions", "texts", on_delete: :nullify
  add_foreign_key "ingestions", "users", column: "creator_id", on_delete: :restrict
  add_foreign_key "notification_preferences", "users", on_delete: :cascade
  add_foreign_key "reading_group_memberships", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_memberships", "users", on_delete: :cascade
  add_foreign_key "reading_groups", "users", column: "creator_id", on_delete: :nullify
  add_foreign_key "resource_import_row_transitions", "resource_import_rows"
  add_foreign_key "resource_import_rows", "resource_imports", on_delete: :cascade
  add_foreign_key "resource_import_transitions", "resource_imports"
  add_foreign_key "resource_imports", "projects", on_delete: :cascade
  add_foreign_key "resource_imports", "users", column: "creator_id"
  add_foreign_key "text_exports", "texts", on_delete: :restrict
  add_foreign_key "users_roles", "roles", on_delete: :cascade
  add_foreign_key "users_roles", "users", on_delete: :cascade

  create_view "project_collection_sort_orders", materialized: true, sql_definition: <<-SQL
    WITH allowed_columns AS (
         SELECT t.column_name
           FROM ( VALUES ('created_at'::text), ('updated_at'::text), ('publication_date'::text), ('title'::text)) t(column_name)
        ), allowed_directions AS (
         SELECT t.direction
           FROM ( VALUES ('asc'::text), ('desc'::text)) t(direction)
        ), allowed_sort_orders AS (
         SELECT allowed_columns.column_name,
            allowed_directions.direction,
            concat(allowed_columns.column_name, '_', allowed_directions.direction) AS sort_order,
            (allowed_directions.direction = 'asc'::text) AS ascending,
            (allowed_directions.direction = 'desc'::text) AS descending
           FROM allowed_columns,
            allowed_directions
        )
 SELECT allowed_sort_orders.column_name,
    allowed_sort_orders.direction,
    allowed_sort_orders.sort_order,
    allowed_sort_orders.ascending,
    allowed_sort_orders.descending
   FROM allowed_sort_orders;
  SQL
  add_index "project_collection_sort_orders", ["sort_order"], name: "project_collection_sort_orders_pkey", unique: true

  create_view "collection_project_rankings", sql_definition: <<-SQL
    SELECT cp.id AS collection_project_id,
    cp.project_collection_id,
    cp.project_id,
    rank() OVER outer_w AS ranking,
    rank() OVER global_w AS global_ranking,
    pc.sort_order,
    sv.sort_order AS dynamic_sort_order,
    dsv.dynamic_sort_value,
    manual.ranking AS manual_sort_value
   FROM (((((collection_projects cp
     JOIN project_collections pc ON ((pc.id = cp.project_collection_id)))
     JOIN projects p ON ((p.id = cp.project_id)))
     LEFT JOIN LATERAL ( SELECT cp."position" AS ranking
          WHERE ((pc.sort_order)::text = 'manual'::text)) manual ON (((pc.sort_order)::text = 'manual'::text)))
     LEFT JOIN project_collection_sort_orders sv ON ((((pc.sort_order)::text <> 'manual'::text) AND ((pc.sort_order)::text = sv.sort_order))))
     LEFT JOIN LATERAL ( SELECT
                CASE sv.column_name
                    WHEN 'created_at'::text THEN ((p.created_at)::text)::character varying
                    WHEN 'updated_at'::text THEN ((p.updated_at)::text)::character varying
                    WHEN 'publication_date'::text THEN ((p.publication_date)::text)::character varying
                    WHEN 'title'::text THEN p.title
                    ELSE p.title
                END AS dynamic_sort_value) dsv ON (((pc.sort_order)::text <> 'manual'::text)))
  WINDOW outer_w AS (PARTITION BY cp.project_collection_id ORDER BY
        CASE
            WHEN ((pc.sort_order)::text = 'manual'::text) THEN manual.ranking
            ELSE NULL::integer
        END,
        CASE
            WHEN sv.descending THEN dsv.dynamic_sort_value
            ELSE NULL::character varying
        END DESC,
        CASE
            WHEN sv.ascending THEN dsv.dynamic_sort_value
            ELSE NULL::character varying
        END), global_w AS (ORDER BY pc."position",
        CASE
            WHEN ((pc.sort_order)::text = 'manual'::text) THEN manual.ranking
            ELSE NULL::integer
        END,
        CASE
            WHEN sv.descending THEN dsv.dynamic_sort_value
            ELSE NULL::character varying
        END DESC,
        CASE
            WHEN sv.ascending THEN dsv.dynamic_sort_value
            ELSE NULL::character varying
        END);
  SQL
  create_view "permissions", sql_definition: <<-SQL
    SELECT ((((ur.user_id || ':'::text) || r.resource_id) || ':'::text) || (r.resource_type)::text) AS id,
    ur.user_id,
    r.resource_id,
    r.resource_type,
    array_agg(r.name) AS role_names
   FROM (roles r
     JOIN users_roles ur ON ((ur.role_id = r.id)))
  GROUP BY ur.user_id, r.resource_id, r.resource_type
 HAVING ((r.resource_id IS NOT NULL) AND (r.resource_type IS NOT NULL));
  SQL
  create_view "reading_group_counts", sql_definition: <<-SQL
    SELECT rg.id AS reading_group_id,
    count(*) FILTER (WHERE ((a.format)::text = 'annotation'::text)) AS annotations_count,
    count(*) FILTER (WHERE ((a.format)::text = 'highlight'::text)) AS highlights_count
   FROM (reading_groups rg
     LEFT JOIN annotations a ON ((a.reading_group_id = rg.id)))
  GROUP BY rg.id;
  SQL
  create_view "reading_group_membership_counts", sql_definition: <<-SQL
    SELECT rgm.id AS reading_group_membership_id,
    count(*) FILTER (WHERE ((a.format)::text = 'annotation'::text)) AS annotations_count,
    count(*) FILTER (WHERE ((a.format)::text = 'highlight'::text)) AS highlights_count
   FROM (reading_group_memberships rgm
     LEFT JOIN annotations a ON (((a.creator_id = rgm.user_id) AND (a.reading_group_id = rgm.reading_group_id))))
  GROUP BY rgm.id;
  SQL
  create_view "project_summaries", sql_definition: <<-SQL
    SELECT p.id,
    p.id AS project_id,
    p.title,
    p.cached_title_formatted AS title_formatted,
    p.cached_title_plaintext AS title_plaintext,
    p.subtitle,
    p.cached_subtitle_formatted AS subtitle_formatted,
    p.cached_subtitle_plaintext AS subtitle_plaintext,
    p.publication_date,
    p.created_at,
    p.updated_at,
    p.slug,
    p.avatar_color,
    p.avatar_data,
    p.draft,
    p.finished,
    pm.creator_names
   FROM (projects p
     LEFT JOIN LATERAL ( SELECT string_agg((m.cached_full_name)::text, ', '::text) FILTER (WHERE ((c.role)::text = 'creator'::text)) AS creator_names,
            string_agg((m.cached_full_name)::text, ', '::text) FILTER (WHERE ((c.role)::text = 'collaborator'::text)) AS collaborator_names
           FROM (collaborators c
             JOIN makers m ON ((m.id = c.maker_id)))
          WHERE (((c.collaboratable_type)::text = 'Project'::text) AND (c.collaboratable_id = p.id))) pm ON (true));
  SQL
  create_view "text_summaries", sql_definition: <<-SQL
    SELECT t.project_id,
    t.id,
    t.id AS text_id,
    t.created_at,
    t.updated_at,
    t.published,
    t.slug,
    t.category_id,
    t."position",
    t.description,
    t.cached_description_formatted AS description_formatted,
    t.cached_description_plaintext AS description_plaintext,
    t.start_text_section_id,
    t.publication_date,
    t.cover_data,
    t.toc,
    tb.id AS toc_section,
    ta.subtitle,
    ta.subtitle_formatted,
    ta.subtitle_plaintext,
    ta.title,
    ta.title_formatted,
    ta.title_plaintext,
    tm.creator_names,
    tm.collaborator_names,
    COALESCE(tac.annotations_count, (0)::bigint) AS annotations_count,
    COALESCE(tac.highlights_count, (0)::bigint) AS highlights_count
   FROM ((((texts t
     LEFT JOIN LATERAL ( SELECT count(*) FILTER (WHERE ((a.format)::text = 'annotation'::text)) AS annotations_count,
            count(*) FILTER (WHERE ((a.format)::text = 'highlight'::text)) AS highlights_count
           FROM (annotations a
             JOIN text_sections ts ON ((ts.id = a.text_section_id)))
          WHERE (ts.text_id = t.id)) tac ON (true))
     LEFT JOIN LATERAL ( SELECT (array_agg(tt.value ORDER BY tt.created_at) FILTER (WHERE ((tt.kind)::text = 'main'::text)))[1] AS title,
            (array_agg(tt.value ORDER BY tt.created_at) FILTER (WHERE ((tt.kind)::text = 'subtitle'::text)))[1] AS subtitle,
            (array_agg(tt.cached_value_formatted ORDER BY tt.created_at) FILTER (WHERE ((tt.kind)::text = 'main'::text)))[1] AS title_formatted,
            (array_agg(tt.cached_value_formatted ORDER BY tt.created_at) FILTER (WHERE ((tt.kind)::text = 'subtitle'::text)))[1] AS subtitle_formatted,
            (array_agg(tt.cached_value_plaintext ORDER BY tt.created_at) FILTER (WHERE ((tt.kind)::text = 'main'::text)))[1] AS title_plaintext,
            (array_agg(tt.cached_value_plaintext ORDER BY tt.created_at) FILTER (WHERE ((tt.kind)::text = 'subtitle'::text)))[1] AS subtitle_plaintext
           FROM text_titles tt
          WHERE (tt.text_id = t.id)) ta ON (true))
     LEFT JOIN LATERAL ( SELECT ts.id
           FROM text_sections ts
          WHERE ((ts.text_id = t.id) AND ((ts.kind)::text = 'navigation'::text))) tb ON (true))
     LEFT JOIN LATERAL ( SELECT string_agg((m.cached_full_name)::text, ', '::text) FILTER (WHERE ((c.role)::text = 'creator'::text)) AS creator_names,
            string_agg((m.cached_full_name)::text, ', '::text) FILTER (WHERE ((c.role)::text = 'collaborator'::text)) AS collaborator_names
           FROM (collaborators c
             JOIN makers m ON ((m.id = c.maker_id)))
          WHERE (((c.collaboratable_type)::text = 'Text'::text) AND (c.collaboratable_id = t.id))) tm ON (true));
  SQL
end
