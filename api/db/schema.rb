# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_04_06_161945) do

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
    t.jsonb "attachment_data"
    t.boolean "button", default: false
    t.integer "position", default: 1, null: false
    t.uuid "project_id"
    t.uuid "text_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "visibility", default: 0, null: false
    t.index ["project_id"], name: "index_action_callouts_on_project_id"
    t.index ["text_id"], name: "index_action_callouts_on_text_id"
  end

  create_table "analytics_events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "visit_id", null: false
    t.string "name", null: false
    t.jsonb "properties", default: {}, null: false
    t.datetime "time", null: false
    t.index ["name", "time"], name: "index_analytics_events_on_name_and_time"
    t.index ["properties"], name: "index_analytics_events_on_properties", opclass: :jsonb_path_ops, using: :gin
    t.index ["visit_id"], name: "index_analytics_events_on_visit_id"
  end

  create_table "analytics_visits", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "visit_token", null: false
    t.string "visitor_token", null: false
    t.string "ip"
    t.text "user_agent"
    t.text "referrer"
    t.string "referring_domain"
    t.text "landing_page"
    t.string "browser"
    t.string "os"
    t.string "device_type"
    t.string "country"
    t.string "region"
    t.string "city"
    t.float "latitude"
    t.float "longitude"
    t.string "utm_source"
    t.string "utm_medium"
    t.string "utm_term"
    t.string "utm_content"
    t.string "utm_campaign"
    t.string "app_version"
    t.string "os_version"
    t.string "platform"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.index ["visit_token"], name: "index_analytics_visits_on_visit_token", unique: true
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
    t.integer "position"
    t.index ["content_block_id"], name: "index_content_block_references_on_content_block_id"
    t.index ["referencable_type", "referencable_id"], name: "index_content_block_references_on_referencable"
  end

  create_table "content_blocks", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "type", null: false
    t.jsonb "configuration", default: {}, null: false
    t.integer "position"
    t.uuid "project_id"
    t.boolean "visible", default: true, null: false
    t.integer "access", default: 0, null: false
    t.index ["project_id"], name: "index_content_blocks_on_project_id"
  end

  create_table "entitlement_roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "name", null: false
    t.text "kind", default: "unknown", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["kind"], name: "index_entitlement_roles_on_kind"
    t.index ["name"], name: "index_entitlement_roles_on_name", unique: true
  end

  create_table "entitlement_transitions", force: :cascade do |t|
    t.uuid "entitlement_id", null: false
    t.integer "sort_key", null: false
    t.boolean "most_recent", null: false
    t.text "to_state", null: false
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entitlement_id", "most_recent"], name: "index_entitlement_transitions_parent_most_recent", unique: true, where: "most_recent"
    t.index ["entitlement_id", "sort_key"], name: "index_entitlement_transitions_parent_sort", unique: true
    t.index ["entitlement_id"], name: "index_entitlement_transitions_on_entitlement_id"
  end

  create_table "entitlement_user_links", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "entitlement_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entitlement_id", "user_id"], name: "entitlement_user_links_uniqueness", unique: true
    t.index ["entitlement_id"], name: "index_entitlement_user_links_on_entitlement_id"
    t.index ["user_id"], name: "index_entitlement_user_links_on_user_id"
  end

  create_table "entitlements", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "target_type", null: false
    t.uuid "target_id", null: false
    t.uuid "entitler_id", null: false
    t.string "subject_type", null: false
    t.uuid "subject_id", null: false
    t.date "expires_on"
    t.datetime "expired_at"
    t.text "kind", default: "unknown", null: false
    t.text "description", default: "", null: false
    t.jsonb "global_roles", default: {}, null: false
    t.jsonb "scoped_roles", default: {}, null: false
    t.jsonb "options", default: {}, null: false
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entitler_id"], name: "index_entitlements_on_entitler_id"
    t.index ["expired_at"], name: "index_entitlements_on_expired_at"
    t.index ["expires_on"], name: "index_entitlements_on_expires_on"
    t.index ["global_roles"], name: "index_entitlements_on_global_roles", using: :gin
    t.index ["scoped_roles"], name: "index_entitlements_on_scoped_roles", using: :gin
    t.index ["subject_type", "subject_id"], name: "index_entitlements_on_subject_type_and_subject_id"
    t.index ["target_type", "target_id", "entitler_id", "subject_type", "subject_id"], name: "index_entitlements_uniqueness"
    t.index ["target_type", "target_id"], name: "index_entitlements_on_target_type_and_target_id"
  end

  create_table "entitlers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "entity_type", null: false
    t.uuid "entity_id", null: false
    t.text "name", null: false
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entity_type", "entity_id"], name: "index_entitlers_entity_uniqueness", unique: true
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
    t.jsonb "fa_cache", default: {}, null: false
    t.index ["created_at"], name: "index_events_on_created_at"
    t.index ["external_subject_type", "external_subject_id"], name: "index_subj_on_subj_type_and_subj_id"
    t.index ["project_id"], name: "index_events_on_project_id"
    t.index ["subject_type", "subject_id"], name: "index_events_on_subject_type_and_subject_id"
    t.index ["twitter_query_id"], name: "index_events_on_twitter_query_id"
  end

  create_table "export_targets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "strategy", default: "unknown", null: false
    t.text "name", null: false
    t.text "slug", null: false
    t.text "configuration_ciphertext", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_export_targets_on_slug", unique: true
    t.index ["strategy"], name: "index_export_targets_on_strategy"
  end

  create_table "features", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "header"
    t.string "subheader"
    t.string "body"
    t.string "link_text"
    t.string "link_url"
    t.string "link_target"
    t.integer "position"
    t.text "style", default: "dark"
    t.boolean "hidden", default: false
    t.uuid "creator_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "background_file_name_deprecated"
    t.string "background_content_type_deprecated"
    t.integer "background_file_size_deprecated"
    t.datetime "background_updated_at_deprecated"
    t.string "foreground_file_name_deprecated"
    t.string "foreground_content_type_deprecated"
    t.integer "foreground_file_size_deprecated"
    t.datetime "foreground_updated_at_deprecated"
    t.string "background_color"
    t.string "foreground_color"
    t.string "header_color"
    t.string "layout"
    t.string "foreground_top"
    t.string "foreground_left"
    t.string "foreground_position"
    t.boolean "live", default: false
    t.jsonb "background_data"
    t.jsonb "foreground_data"
    t.boolean "include_sign_up", default: false, null: false
    t.jsonb "fa_cache", default: {}, null: false
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
    t.jsonb "attachment_data"
    t.index ["kind"], name: "index_ingestion_sources_on_kind"
    t.index ["source_identifier"], name: "index_ingestion_sources_on_source_identifier"
    t.index ["text_id"], name: "index_ingestion_sources_on_text_id"
  end

  create_table "ingestions", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "state"
    t.string "log", array: true
    t.string "strategy"
    t.string "external_source_url"
    t.string "ingestion_type"
    t.uuid "creator_id", null: false
    t.uuid "text_id"
    t.uuid "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "source_file_name"
    t.string "source_content_type"
    t.integer "source_file_size"
    t.datetime "source_updated_at"
    t.jsonb "source_data"
    t.index ["creator_id"], name: "index_ingestions_on_creator_id"
    t.index ["project_id"], name: "index_ingestions_on_project_id"
    t.index ["state"], name: "index_ingestions_on_state"
    t.index ["text_id"], name: "index_ingestions_on_text_id"
  end

  create_table "legacy_favorites", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid "favoritable_id"
    t.string "favoritable_type"
    t.uuid "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["favoritable_type", "favoritable_id"], name: "index_legacy_favorites_on_favoritable_type_and_favoritable_id"
    t.index ["user_id"], name: "index_legacy_favorites_on_user_id"
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
    t.jsonb "avatar_data"
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
    t.jsonb "fa_cache", default: {}, null: false
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
    t.integer "hero_layout", default: 0, null: false
    t.jsonb "custom_icon_data"
    t.jsonb "hero_data"
    t.jsonb "social_image_data"
    t.text "social_description"
    t.text "social_title"
    t.jsonb "fa_cache", default: {}, null: false
    t.index ["creator_id"], name: "index_project_collections_on_creator_id"
    t.index ["homepage_end_date"], name: "index_project_collections_on_homepage_end_date"
    t.index ["homepage_start_date"], name: "index_project_collections_on_homepage_start_date"
    t.index ["slug"], name: "index_project_collections_on_slug", unique: true
  end

  create_table "project_exportation_transitions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "to_state", null: false
    t.jsonb "metadata", default: {}
    t.integer "sort_key", null: false
    t.uuid "project_exportation_id", null: false
    t.boolean "most_recent", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_exportation_id", "most_recent"], name: "index_project_exportation_transitions_parent_most_recent", unique: true, where: "most_recent"
    t.index ["project_exportation_id", "sort_key"], name: "index_project_exportation_transitions_parent_sort", unique: true
    t.index ["project_exportation_id"], name: "index_project_exportation_transitions_on_project_exportation_id"
  end

  create_table "project_exportations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "project_id", null: false
    t.uuid "export_target_id", null: false
    t.uuid "project_export_id"
    t.uuid "user_id"
    t.datetime "exported_at"
    t.jsonb "logs", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["export_target_id"], name: "index_project_exportations_on_export_target_id"
    t.index ["project_export_id"], name: "index_project_exportations_on_project_export_id"
    t.index ["project_id", "export_target_id"], name: "index_project_exportations_targeted_projects"
    t.index ["project_id"], name: "index_project_exportations_on_project_id"
    t.index ["user_id"], name: "index_project_exportations_on_user_id"
  end

  create_table "project_exports", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "project_id", null: false
    t.text "export_kind", default: "unknown", null: false
    t.text "fingerprint", null: false
    t.jsonb "asset_data"
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["asset_data"], name: "index_project_exports_on_asset_data", using: :gin
    t.index ["project_id", "export_kind", "fingerprint"], name: "index_project_exports_uniqueness", unique: true
    t.index ["project_id"], name: "index_project_exports_on_project_id"
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.jsonb "cover_data"
    t.jsonb "hero_data"
    t.jsonb "avatar_data"
    t.boolean "dark_mode", default: false, null: false
    t.text "image_credits"
    t.integer "standalone_mode", default: 0, null: false
    t.string "standalone_mode_press_bar_text"
    t.string "standalone_mode_press_bar_url"
    t.boolean "finished", default: false
    t.integer "resource_collections_count", default: 0
    t.integer "resources_count", default: 0
    t.text "fingerprint", null: false
    t.jsonb "export_configuration", default: {}, null: false
    t.boolean "restricted_access", default: false, null: false
    t.string "restricted_access_heading"
    t.text "restricted_access_body"
    t.boolean "open_access", default: false, null: false
    t.boolean "disable_engagement", default: false
    t.jsonb "fa_cache", default: {}, null: false
    t.index "((export_configuration @> '{\"bag_it\": true}'::jsonb))", name: "index_projects_export_configuration_exports_as_bag_it"
    t.index ["fingerprint"], name: "index_projects_on_fingerprint"
    t.index ["open_access"], name: "index_projects_on_open_access"
    t.index ["restricted_access"], name: "index_projects_on_restricted_access"
    t.index ["slug"], name: "index_projects_on_slug", unique: true
  end

  create_table "reading_group_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "reading_group_id", null: false
    t.integer "position"
    t.text "title", null: false
    t.text "description", null: false
    t.text "slug", null: false
    t.jsonb "fa_cache", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["reading_group_id", "position"], name: "index_reading_group_categories_ordering"
    t.index ["reading_group_id", "slug"], name: "index_reading_group_categories_uniqueness", unique: true
    t.index ["reading_group_id"], name: "index_reading_group_categories_on_reading_group_id"
  end

  create_table "reading_group_composite_entries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "reading_group_id", null: false
    t.string "collectable_type", null: false
    t.uuid "collectable_id", null: false
    t.uuid "reading_group_category_id"
    t.uuid "reading_group_project_id"
    t.uuid "reading_group_resource_id"
    t.uuid "reading_group_resource_collection_id"
    t.uuid "reading_group_text_id"
    t.text "collectable_jsonapi_type", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "reading_group_text_section_id"
    t.index ["collectable_type", "collectable_id"], name: "index_rgce_collectable_reference"
    t.index ["reading_group_category_id"], name: "index_rgce_category_reference"
    t.index ["reading_group_id", "collectable_type", "collectable_id"], name: "index_rgce_uniqueness", unique: true
    t.index ["reading_group_id"], name: "index_rgce_reading_group_reference"
    t.index ["reading_group_project_id"], name: "index_rgce_project_reference"
    t.index ["reading_group_resource_collection_id"], name: "index_rgce_resource_collection_reference"
    t.index ["reading_group_resource_id"], name: "index_rgce_resource_reference"
    t.index ["reading_group_text_id"], name: "index_rgce_text_reference"
    t.index ["reading_group_text_section_id"], name: "index_rgce_text_section_reference"
  end

  create_table "reading_group_kinds", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "name", null: false
    t.text "slug", null: false
    t.datetime "created_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "reading_group_memberships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "reading_group_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "anonymous_label"
    t.text "aasm_state", default: "active", null: false
    t.text "role", default: "member", null: false
    t.text "label", default: ""
    t.text "annotation_style", default: "solid", null: false
    t.datetime "archived_at"
    t.index ["aasm_state"], name: "index_reading_group_memberships_on_aasm_state"
    t.index ["reading_group_id", "anonymous_label"], name: "anonymous_label_index", unique: true
    t.index ["reading_group_id"], name: "index_reading_group_memberships_on_reading_group_id"
    t.index ["user_id", "reading_group_id"], name: "index_reading_group_memberships_on_user_id_and_reading_group_id", unique: true
    t.index ["user_id"], name: "index_reading_group_memberships_on_user_id"
  end

  create_table "reading_group_projects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "reading_group_id", null: false
    t.uuid "project_id", null: false
    t.uuid "reading_group_category_id"
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_reading_group_projects_on_project_id"
    t.index ["reading_group_category_id"], name: "index_reading_group_projects_on_reading_group_category_id"
    t.index ["reading_group_id", "project_id"], name: "index_reading_group_projects_uniqueness", unique: true
    t.index ["reading_group_id", "reading_group_category_id", "position"], name: "index_reading_group_projects_ordering"
    t.index ["reading_group_id"], name: "index_reading_group_projects_on_reading_group_id"
  end

  create_table "reading_group_resource_collections", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "reading_group_id", null: false
    t.uuid "resource_collection_id", null: false
    t.uuid "reading_group_category_id"
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["reading_group_category_id"], name: "index_reading_group_resource_collection_category_reference"
    t.index ["reading_group_id", "reading_group_category_id", "position"], name: "index_reading_group_resource_collections_ordering"
    t.index ["reading_group_id", "resource_collection_id"], name: "index_reading_group_resource_collections_uniqueness", unique: true
    t.index ["reading_group_id"], name: "index_reading_group_resource_collections_on_reading_group_id"
    t.index ["resource_collection_id"], name: "index_reading_group_resource_collection_reference"
  end

  create_table "reading_group_resources", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "reading_group_id", null: false
    t.uuid "resource_id", null: false
    t.uuid "reading_group_category_id"
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["reading_group_category_id"], name: "index_reading_group_resources_on_reading_group_category_id"
    t.index ["reading_group_id", "reading_group_category_id", "position"], name: "index_reading_group_resources_ordering"
    t.index ["reading_group_id", "resource_id"], name: "index_reading_group_resources_uniqueness", unique: true
    t.index ["reading_group_id"], name: "index_reading_group_resources_on_reading_group_id"
    t.index ["resource_id"], name: "index_reading_group_resources_on_resource_id"
  end

  create_table "reading_group_text_sections", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "reading_group_id", null: false
    t.uuid "text_section_id", null: false
    t.uuid "reading_group_category_id"
    t.integer "position"
    t.datetime "created_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["reading_group_category_id"], name: "index_reading_group_text_sections_on_reading_group_category_id"
    t.index ["reading_group_id", "reading_group_category_id", "position"], name: "index_rg_text_sections_ordering"
    t.index ["reading_group_id", "text_section_id"], name: "index_rg_text_sections_uniqueness", unique: true
    t.index ["reading_group_id"], name: "index_reading_group_text_sections_on_reading_group_id"
    t.index ["text_section_id"], name: "index_rg_text_section_reference"
  end

  create_table "reading_group_texts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "reading_group_id", null: false
    t.uuid "text_id", null: false
    t.uuid "reading_group_category_id"
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["reading_group_category_id"], name: "index_reading_group_texts_on_reading_group_category_id"
    t.index ["reading_group_id", "reading_group_category_id", "position"], name: "index_reading_group_texts_ordering"
    t.index ["reading_group_id", "text_id"], name: "index_reading_group_texts_uniqueness", unique: true
    t.index ["reading_group_id"], name: "index_reading_group_texts_on_reading_group_id"
    t.index ["text_id"], name: "index_reading_group_texts_on_text_id"
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
    t.uuid "reading_group_kind_id"
    t.jsonb "course", default: {}, null: false
    t.index ["course"], name: "index_reading_groups_on_course", using: :gin
    t.index ["creator_id"], name: "index_reading_groups_on_creator_id"
    t.index ["invitation_code"], name: "index_reading_groups_on_invitation_code", unique: true
    t.index ["reading_group_kind_id"], name: "index_reading_groups_on_reading_group_kind_id"
  end

  create_table "resource_collections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.uuid "project_id"
    t.string "fingerprint"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "thumbnail_file_name_deprecated"
    t.string "thumbnail_content_type_deprecated"
    t.integer "thumbnail_file_size_deprecated"
    t.datetime "thumbnail_updated_at_deprecated"
    t.string "slug"
    t.integer "collection_resources_count", default: 0
    t.integer "events_count", default: 0
    t.jsonb "thumbnail_data"
    t.jsonb "fa_cache", default: {}, null: false
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
    t.string "url"
    t.integer "header_row", default: 1
    t.jsonb "column_map", default: {}, null: false
    t.jsonb "column_automap", default: {}, null: false
    t.boolean "parse_error", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "data_file_name_deprecated"
    t.string "data_content_type_deprecated"
    t.integer "data_file_size_deprecated"
    t.datetime "data_updated_at_deprecated"
    t.jsonb "data_data"
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
    t.jsonb "attachment_data"
    t.jsonb "high_res_data"
    t.jsonb "transcript_data"
    t.jsonb "translation_data"
    t.jsonb "variant_format_one_data"
    t.jsonb "variant_format_two_data"
    t.jsonb "variant_thumbnail_data"
    t.jsonb "variant_poster_data"
    t.string "pending_sort_title"
    t.jsonb "fa_cache", default: {}, null: false
    t.index ["project_id"], name: "index_resources_on_project_id"
    t.index ["slug"], name: "index_resources_on_slug", unique: true
  end

  create_table "roles", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "resource_type"
    t.uuid "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "kind", default: "unknown", null: false
    t.index ["kind"], name: "index_roles_on_kind"
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
    t.jsonb "press_logo_data"
    t.jsonb "press_logo_footer_data"
    t.jsonb "press_logo_mobile_data"
    t.jsonb "favicon_data"
    t.jsonb "fa_cache", default: {}, null: false
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

  create_table "system_entitlements", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "kind", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["kind"], name: "index_system_entitlements_on_kind", unique: true
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
    t.index ["taggable_type", "taggable_id"], name: "index_taggings_on_taggable_type_and_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
    t.index ["tagger_type", "tagger_id"], name: "index_taggings_on_tagger_type_and_tagger_id"
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
    t.jsonb "fa_cache", default: {}, null: false
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
    t.jsonb "cover_data"
    t.boolean "published", default: false, null: false
    t.text "fingerprint", null: false
    t.jsonb "export_configuration", default: {}, null: false
    t.boolean "ignore_access_restrictions", default: false
    t.jsonb "fa_cache", default: {}, null: false
    t.index "((export_configuration @> '{\"epub_v3\": true}'::jsonb))", name: "index_texts_export_configuration_exports_as_epub_v3"
    t.index ["category_id"], name: "index_texts_on_category_id"
    t.index ["created_at"], name: "index_texts_on_created_at", using: :brin
    t.index ["fingerprint"], name: "index_texts_on_fingerprint"
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

  create_table "user_collected_composite_entries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "collectable_type", null: false
    t.uuid "collectable_id", null: false
    t.uuid "project_id"
    t.uuid "user_collected_project_id"
    t.uuid "user_collected_resource_id"
    t.uuid "user_collected_resource_collection_id"
    t.uuid "user_collected_text_id"
    t.text "collectable_jsonapi_type", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_collected_text_section_id"
    t.index ["collectable_type", "collectable_id"], name: "index_ucce_collectable_reference"
    t.index ["project_id"], name: "index_ucce_inferred_project_reference"
    t.index ["user_collected_project_id"], name: "index_ucce_project_reference"
    t.index ["user_collected_resource_collection_id"], name: "index_ucce_resource_collection_reference"
    t.index ["user_collected_resource_id"], name: "index_ucce_resource_reference"
    t.index ["user_collected_text_id"], name: "index_ucce_text_reference"
    t.index ["user_collected_text_section_id"], name: "index_ucce_text_section_reference"
    t.index ["user_id", "collectable_type", "collectable_id"], name: "index_ucce_uniqueness", unique: true
    t.index ["user_id"], name: "index_ucce_user_reference"
  end

  create_table "user_collected_projects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "project_id", null: false
    t.datetime "created_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["project_id"], name: "index_uc_project_reference"
    t.index ["user_id", "project_id"], name: "index_uc_project_uniqueness", unique: true
    t.index ["user_id"], name: "index_user_collected_projects_on_user_id"
  end

  create_table "user_collected_resource_collections", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "resource_collection_id", null: false
    t.datetime "created_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["resource_collection_id"], name: "index_uc_resource_collection_reference"
    t.index ["user_id", "resource_collection_id"], name: "index_uc_resource_collection_uniqueness", unique: true
    t.index ["user_id"], name: "index_user_collected_resource_collections_on_user_id"
  end

  create_table "user_collected_resources", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "resource_id", null: false
    t.datetime "created_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["resource_id"], name: "index_uc_resource_reference"
    t.index ["user_id", "resource_id"], name: "index_uc_resource_uniqueness", unique: true
    t.index ["user_id"], name: "index_user_collected_resources_on_user_id"
  end

  create_table "user_collected_text_sections", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "text_section_id", null: false
    t.datetime "created_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["text_section_id"], name: "index_uc_text_section_reference"
    t.index ["user_id", "text_section_id"], name: "index_uc_text_section_uniqueness", unique: true
    t.index ["user_id"], name: "index_user_collected_text_sections_on_user_id"
  end

  create_table "user_collected_texts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "text_id", null: false
    t.datetime "created_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["text_id"], name: "index_uc_text_reference"
    t.index ["user_id", "text_id"], name: "index_uc_text_uniqueness", unique: true
    t.index ["user_id"], name: "index_user_collected_texts_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.citext "email"
    t.string "first_name"
    t.string "last_name"
    t.string "password_digest"
    t.string "password"
    t.string "password_confirmation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.jsonb "avatar_data"
    t.text "role", null: false
    t.text "kind", null: false
    t.index ["classification"], name: "udx_users_anonymous", unique: true, where: "((classification)::text = 'anonymous'::text)"
    t.index ["classification"], name: "udx_users_cli", unique: true, where: "((classification)::text = 'command_line'::text)"
    t.index ["import_source_id"], name: "index_users_on_import_source_id", unique: true, where: "(import_source_id IS NOT NULL)"
    t.index ["kind"], name: "index_users_on_kind"
    t.index ["role"], name: "index_users_on_role"
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "role_id", null: false
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id", unique: true
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "version_associations", force: :cascade do |t|
    t.integer "version_id"
    t.string "foreign_key_name", null: false
    t.integer "foreign_key_id"
    t.string "foreign_type"
    t.index ["foreign_key_name", "foreign_key_id", "foreign_type"], name: "index_version_associations_on_foreign_key"
    t.index ["version_id"], name: "index_version_associations_on_version_id"
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
    t.integer "transaction_id"
    t.string "title_fallback"
    t.index ["created_at"], name: "index_versions_on_created_at", using: :brin
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
    t.index ["parent_item_type", "parent_item_id"], name: "index_versions_on_parent_item_type_and_parent_item_id"
    t.index ["transaction_id"], name: "index_versions_on_transaction_id"
  end

  add_foreign_key "annotations", "reading_groups", on_delete: :nullify
  add_foreign_key "cached_external_source_links", "cached_external_sources", on_delete: :cascade
  add_foreign_key "cached_external_source_links", "texts", on_delete: :cascade
  add_foreign_key "entitlement_user_links", "entitlements", on_delete: :cascade
  add_foreign_key "entitlement_user_links", "users", on_delete: :cascade
  add_foreign_key "entitlements", "entitlers", on_delete: :restrict
  add_foreign_key "identities", "users", on_delete: :cascade
  add_foreign_key "import_selection_matches", "annotations", on_delete: :nullify
  add_foreign_key "import_selection_matches", "import_selections", on_delete: :cascade
  add_foreign_key "import_selection_matches", "text_sections", on_delete: :cascade
  add_foreign_key "import_selections", "texts", on_delete: :cascade
  add_foreign_key "ingestions", "projects", on_delete: :restrict
  add_foreign_key "ingestions", "texts", on_delete: :nullify
  add_foreign_key "ingestions", "users", column: "creator_id", on_delete: :restrict
  add_foreign_key "notification_preferences", "users", on_delete: :cascade
  add_foreign_key "project_exportation_transitions", "project_exportations", on_delete: :cascade
  add_foreign_key "project_exportations", "export_targets", on_delete: :cascade
  add_foreign_key "project_exportations", "project_exports", on_delete: :nullify
  add_foreign_key "project_exportations", "projects", on_delete: :cascade
  add_foreign_key "project_exportations", "users", on_delete: :nullify
  add_foreign_key "project_exports", "projects", on_delete: :restrict
  add_foreign_key "reading_group_categories", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_composite_entries", "reading_group_categories", on_delete: :nullify
  add_foreign_key "reading_group_composite_entries", "reading_group_projects", on_delete: :cascade
  add_foreign_key "reading_group_composite_entries", "reading_group_resource_collections", on_delete: :cascade
  add_foreign_key "reading_group_composite_entries", "reading_group_resources", on_delete: :cascade
  add_foreign_key "reading_group_composite_entries", "reading_group_text_sections", on_delete: :cascade
  add_foreign_key "reading_group_composite_entries", "reading_group_texts", on_delete: :cascade
  add_foreign_key "reading_group_composite_entries", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_memberships", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_memberships", "users", on_delete: :cascade
  add_foreign_key "reading_group_projects", "projects", on_delete: :cascade
  add_foreign_key "reading_group_projects", "reading_group_categories", on_delete: :nullify
  add_foreign_key "reading_group_projects", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_resource_collections", "reading_group_categories", on_delete: :nullify
  add_foreign_key "reading_group_resource_collections", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_resource_collections", "resource_collections", on_delete: :cascade
  add_foreign_key "reading_group_resources", "reading_group_categories", on_delete: :nullify
  add_foreign_key "reading_group_resources", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_resources", "resources", on_delete: :cascade
  add_foreign_key "reading_group_text_sections", "reading_group_categories", on_delete: :nullify
  add_foreign_key "reading_group_text_sections", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_text_sections", "text_sections", on_delete: :cascade
  add_foreign_key "reading_group_texts", "reading_group_categories", on_delete: :nullify
  add_foreign_key "reading_group_texts", "reading_groups", on_delete: :cascade
  add_foreign_key "reading_group_texts", "texts", on_delete: :cascade
  add_foreign_key "reading_groups", "reading_group_kinds", on_delete: :nullify
  add_foreign_key "reading_groups", "users", column: "creator_id", on_delete: :nullify
  add_foreign_key "resource_import_row_transitions", "resource_import_rows"
  add_foreign_key "resource_import_rows", "resource_imports", on_delete: :cascade
  add_foreign_key "resource_import_transitions", "resource_imports"
  add_foreign_key "resource_imports", "projects", on_delete: :cascade
  add_foreign_key "resource_imports", "users", column: "creator_id"
  add_foreign_key "text_exports", "texts", on_delete: :restrict
  add_foreign_key "user_collected_composite_entries", "projects", on_delete: :cascade
  add_foreign_key "user_collected_composite_entries", "user_collected_projects", on_delete: :cascade
  add_foreign_key "user_collected_composite_entries", "user_collected_resource_collections", on_delete: :cascade
  add_foreign_key "user_collected_composite_entries", "user_collected_resources", on_delete: :cascade
  add_foreign_key "user_collected_composite_entries", "user_collected_text_sections", on_delete: :cascade
  add_foreign_key "user_collected_composite_entries", "user_collected_texts", on_delete: :cascade
  add_foreign_key "user_collected_composite_entries", "users", on_delete: :cascade
  add_foreign_key "user_collected_projects", "projects", on_delete: :cascade
  add_foreign_key "user_collected_projects", "users", on_delete: :cascade
  add_foreign_key "user_collected_resource_collections", "resource_collections", on_delete: :cascade
  add_foreign_key "user_collected_resource_collections", "users", on_delete: :cascade
  add_foreign_key "user_collected_resources", "resources", on_delete: :cascade
  add_foreign_key "user_collected_resources", "users", on_delete: :cascade
  add_foreign_key "user_collected_text_sections", "text_sections", on_delete: :cascade
  add_foreign_key "user_collected_text_sections", "users", on_delete: :cascade
  add_foreign_key "user_collected_texts", "texts", on_delete: :cascade
  add_foreign_key "user_collected_texts", "users", on_delete: :cascade
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
  create_view "text_export_statuses", sql_definition: <<-SQL
    SELECT t.id AS text_id,
    te.id AS text_export_id,
        CASE te.export_kind
            WHEN 'epub_v3'::text THEN (t.export_configuration @> '{"epub_v3": true}'::jsonb)
            ELSE false
        END AS autoexport,
    te.export_kind,
    te.fingerprint AS export_fingerprint,
    (t.fingerprint = te.fingerprint) AS current,
    (t.fingerprint <> te.fingerprint) AS stale,
    te.created_at AS exported_at
   FROM (texts t
     JOIN text_exports te ON ((t.id = te.text_id)));
  SQL
  create_view "project_export_statuses", sql_definition: <<-SQL
    SELECT p.id AS project_id,
    pe.id AS project_export_id,
        CASE pe.export_kind
            WHEN 'bag_it'::text THEN (p.export_configuration @> '{"bag_it": true}'::jsonb)
            ELSE false
        END AS autoexport,
    pe.export_kind,
    pe.fingerprint AS export_fingerprint,
    (p.fingerprint = pe.fingerprint) AS current,
    (p.fingerprint <> pe.fingerprint) AS stale,
    pe.created_at AS exported_at
   FROM (projects p
     JOIN project_exports pe ON ((p.id = pe.project_id)));
  SQL
  create_view "user_derived_roles", sql_definition: <<-SQL
    SELECT u.id AS user_id,
    COALESCE((array_agg(r.name ORDER BY
        CASE r.name
            WHEN 'admin'::text THEN 1
            WHEN 'editor'::text THEN 2
            WHEN 'project_creator'::text THEN 3
            WHEN 'marketeer'::text THEN 4
            WHEN 'reader'::text THEN 8
            ELSE 20
        END) FILTER (WHERE (r.kind = 'global'::text)))[1], 'reader'::character varying) AS role,
    COALESCE((array_agg(r.name ORDER BY
        CASE r.name
            WHEN 'admin'::text THEN 1
            WHEN 'editor'::text THEN 2
            WHEN 'project_creator'::text THEN 3
            WHEN 'marketeer'::text THEN 4
            WHEN 'project_editor'::text THEN 5
            WHEN 'project_resource_editor'::text THEN 6
            WHEN 'project_author'::text THEN 7
            WHEN 'reader'::text THEN 8
            ELSE 20
        END) FILTER (WHERE (r.kind = ANY (ARRAY['global'::text, 'scoped'::text]))))[1], 'reader'::character varying) AS kind
   FROM ((users u
     LEFT JOIN users_roles ur ON ((ur.user_id = u.id)))
     LEFT JOIN roles r ON (((r.id = ur.role_id) AND (r.kind = ANY (ARRAY['global'::text, 'scoped'::text])))))
  GROUP BY u.id;
  SQL
  create_view "entitlement_assigned_roles", sql_definition: <<-SQL
    SELECT ur.user_id,
    er.id AS entitlement_role_id,
    r.resource_id,
    r.resource_type,
    r.name AS role_name,
    r.id AS role_id
   FROM ((roles r
     JOIN entitlement_roles er ON (((r.name)::text = er.name)))
     JOIN users_roles ur ON ((ur.role_id = r.id)));
  SQL
  create_view "user_entitlements", sql_definition: <<-SQL
    SELECT ent.id,
    eul.user_id,
    eul.entitlement_id,
    ent.target_type,
    ent.target_id,
    ent.entitler_id,
    ent.subject_type,
    ent.subject_id,
    ent.expires_on,
    ent.expired_at,
    ent.kind,
    ent.description,
    ent.global_roles,
    ent.scoped_roles,
    ent.options,
    ent.metadata,
    ent.created_at,
    ent.updated_at
   FROM (entitlement_user_links eul
     JOIN entitlements ent ON ((ent.id = eul.entitlement_id)));
  SQL
  create_view "entitlement_derived_roles", sql_definition: <<-SQL
    SELECT ent.user_id,
    ent.id AS entitlement_id,
    ent.created_at AS granted_at,
    COALESCE(most_recent_entitlement_transition.to_state, 'pending'::text) AS current_state,
    r.entitlement_role_id,
    r.role_name,
    r.role_kind,
    r.resource_id,
    r.resource_type,
    r.inferred,
    ent.expires_on,
    ent.expired_at,
    (ent.expired_at IS NOT NULL) AS expired
   FROM ((user_entitlements ent
     LEFT JOIN entitlement_transitions most_recent_entitlement_transition ON (((ent.id = most_recent_entitlement_transition.entitlement_id) AND (most_recent_entitlement_transition.most_recent = true))))
     LEFT JOIN LATERAL ( SELECT er.id AS entitlement_role_id,
            er.name AS role_name,
            er.kind AS role_kind,
            ent.subject_id AS resource_id,
            ent.subject_type AS resource_type,
            false AS inferred
           FROM (jsonb_each(ent.global_roles) t(name, value)
             JOIN entitlement_roles er USING (name))
          WHERE (t.value = to_jsonb(true))
        UNION ALL
         SELECT er.id AS entitlement_role_id,
            er.name AS role_name,
            er.kind AS role_kind,
            ent.subject_id AS resource_id,
            ent.subject_type AS resource_type,
            false AS inferred
           FROM (jsonb_each(ent.scoped_roles) t(name, value)
             JOIN entitlement_roles er USING (name))
          WHERE (t.value = to_jsonb(true))
        UNION ALL
         SELECT er.id AS entitlement_role_id,
            er.name AS role_name,
            er.kind AS role_kind,
            cp.project_id AS resource_id,
            'Project'::character varying AS resource_type,
            true AS inferred
           FROM ((jsonb_each(ent.scoped_roles) t(name, value)
             JOIN entitlement_roles er USING (name))
             JOIN collection_projects cp ON ((cp.project_collection_id = ent.subject_id)))
          WHERE (((ent.subject_type)::text = 'ProjectCollection'::text) AND (t.value = to_jsonb(true)))) r ON (true));
  SQL
  create_view "entitlement_grants", materialized: true, sql_definition: <<-SQL
    SELECT entitlement_derived_roles.user_id,
    entitlement_derived_roles.entitlement_role_id,
    entitlement_derived_roles.resource_id,
    entitlement_derived_roles.resource_type,
    entitlement_derived_roles.role_name,
    entitlement_derived_roles.role_kind,
    COALESCE((array_agg(entitlement_derived_roles.current_state ORDER BY cs."position"))[1], 'pending'::text) AS current_state,
    bool_and(entitlement_derived_roles.expired) AS expired,
    bool_and(entitlement_derived_roles.inferred) AS inferred,
    bool_or(entitlement_derived_roles.expired) AS has_ever_been_expired,
    bool_or(entitlement_derived_roles.inferred) AS has_ever_been_inferred,
    count(DISTINCT entitlement_derived_roles.entitlement_id) FILTER (WHERE (entitlement_derived_roles.current_state = 'active'::text)) AS active_entitlements_count,
    count(DISTINCT entitlement_derived_roles.entitlement_id) FILTER (WHERE (entitlement_derived_roles.current_state = 'expiring_soon'::text)) AS expiring_soon_entitlements_count,
    count(DISTINCT entitlement_derived_roles.entitlement_id) FILTER (WHERE (entitlement_derived_roles.current_state = 'expired'::text)) AS expired_entitlements_count,
    min(entitlement_derived_roles.granted_at) AS first_granted_at,
    max(entitlement_derived_roles.expired_at) AS last_expired_at,
    jsonb_agg(DISTINCT s.summary) AS summaries
   FROM ((entitlement_derived_roles
     LEFT JOIN LATERAL ( SELECT
                CASE entitlement_derived_roles.current_state
                    WHEN 'active'::text THEN 1
                    WHEN 'expiring_soon'::text THEN 2
                    WHEN 'expired'::text THEN 3
                    ELSE 5
                END AS "position") cs ON (true))
     LEFT JOIN LATERAL ( SELECT jsonb_build_object('current_state', entitlement_derived_roles.current_state, 'entitlement_id', entitlement_derived_roles.entitlement_id, 'expired', entitlement_derived_roles.expired, 'expires_on', entitlement_derived_roles.expires_on, 'expired_at', entitlement_derived_roles.expired_at, 'granted_at', entitlement_derived_roles.granted_at) AS summary
          ORDER BY entitlement_derived_roles.expired_at DESC, cs."position", entitlement_derived_roles.expires_on DESC) s ON (true))
  GROUP BY entitlement_derived_roles.user_id, entitlement_derived_roles.entitlement_role_id, entitlement_derived_roles.resource_id, entitlement_derived_roles.resource_type, entitlement_derived_roles.role_name, entitlement_derived_roles.role_kind;
  SQL
  add_index "entitlement_grants", ["user_id", "entitlement_role_id", "resource_id", "resource_type", "role_name", "role_kind"], name: "entitlement_grants_pkey", unique: true

  create_view "entitlement_grant_audits", materialized: true, sql_definition: <<-SQL
    SELECT user_id,
    entitlement_role_id,
    resource_id,
    resource_type,
    role_name,
    x.has_entitlement,
    x.has_assigned_role,
        CASE
            WHEN (x.has_entitlement AND (NOT x.has_assigned_role)) THEN 'add_role'::text
            WHEN ((NOT x.has_entitlement) AND x.has_assigned_role) THEN 'remove_role'::text
            ELSE 'skip'::text
        END AS action
   FROM ((entitlement_grants eg
     FULL JOIN entitlement_assigned_roles ear USING (user_id, entitlement_role_id, resource_id, resource_type, role_name))
     LEFT JOIN LATERAL ( SELECT ((eg.summaries IS NOT NULL) AND (NOT eg.expired)) AS has_entitlement,
            (ear.role_id IS NOT NULL) AS has_assigned_role) x ON (true));
  SQL
  add_index "entitlement_grant_audits", ["action"], name: "index_entitlement_grant_audits_on_action"
  add_index "entitlement_grant_audits", ["user_id", "entitlement_role_id", "resource_id", "resource_type", "role_name"], name: "entitlement_grant_audits_pkey", unique: true

  create_view "entitlement_targets", sql_definition: <<-SQL
    SELECT 'User'::text AS target_type,
    users.id AS target_id,
    concat('gid://manifold-api/User/', users.id) AS target_url,
    concat(users.first_name, ' ', users.last_name) AS name,
    'public'::text AS visibility,
    concat('1', users.first_name, ' ', users.last_name) AS sort_key
   FROM users
  WHERE ((users.classification)::text = 'default'::text)
UNION ALL
 SELECT 'ReadingGroup'::text AS target_type,
    reading_groups.id AS target_id,
    concat('gid://manifold-api/ReadingGroup/', reading_groups.id) AS target_url,
    reading_groups.name,
        CASE reading_groups.privacy
            WHEN 'public'::text THEN 'public'::text
            ELSE 'private'::text
        END AS visibility,
    concat('2', reading_groups.name) AS sort_key
   FROM reading_groups;
  SQL
  create_view "permissions", sql_definition: <<-SQL
    SELECT ((((ur.user_id || ':'::text) || r.resource_id) || ':'::text) || (r.resource_type)::text) AS id,
    ur.user_id,
    r.resource_id,
    r.resource_type,
    array_agg(r.name) AS role_names
   FROM (roles r
     JOIN users_roles ur ON ((ur.role_id = r.id)))
  WHERE (r.kind = 'scoped'::text)
  GROUP BY ur.user_id, r.resource_id, r.resource_type
 HAVING ((r.resource_id IS NOT NULL) AND (r.resource_type IS NOT NULL));
  SQL
  create_view "reading_group_membership_counts", sql_definition: <<-SQL
    SELECT rgm.id AS reading_group_membership_id,
    count(*) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND (NOT a.orphaned))) AS annotations_count,
    count(*) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND a.orphaned)) AS orphaned_annotations_count,
    count(*) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND (NOT a.orphaned))) AS highlights_count,
    count(*) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND a.orphaned)) AS orphaned_highlights_count
   FROM (reading_group_memberships rgm
     LEFT JOIN annotations a ON (((a.creator_id = rgm.user_id) AND (a.reading_group_id = rgm.reading_group_id))))
  GROUP BY rgm.id;
  SQL
  create_view "reading_group_counts", sql_definition: <<-SQL
    SELECT rg.id AS reading_group_id,
    count(*) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND (NOT a.orphaned))) AS annotations_count,
    count(*) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND a.orphaned)) AS orphaned_annotations_count,
    count(*) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND (NOT a.orphaned))) AS highlights_count,
    count(*) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND a.orphaned)) AS orphaned_highlights_count
   FROM (reading_groups rg
     LEFT JOIN annotations a ON ((a.reading_group_id = rg.id)))
  GROUP BY rg.id;
  SQL
  create_view "text_title_summaries", sql_definition: <<-SQL
    SELECT text_titles.text_id,
    jsonb_object_agg(text_titles.kind, (jsonb_build_object('raw', text_titles.value) || (text_titles.fa_cache -> 'value'::text)) ORDER BY text_titles.created_at DESC) AS titles
   FROM text_titles
  WHERE (text_titles.kind IS NOT NULL)
  GROUP BY text_titles.text_id;
  SQL
  create_view "project_summaries", sql_definition: <<-SQL
    SELECT p.id,
    p.id AS project_id,
    p.title,
    (p.fa_cache #>> '{title,formatted}'::text[]) AS title_formatted,
    (p.fa_cache #>> '{title,plaintext}'::text[]) AS title_plaintext,
    p.subtitle,
    (p.fa_cache #>> '{subtitle,formatted}'::text[]) AS subtitle_formatted,
    (p.fa_cache #>> '{subtitle,plaintext}'::text[]) AS subtitle_plaintext,
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
     LEFT JOIN LATERAL ( SELECT string_agg((m.cached_full_name)::text, ', '::text ORDER BY c."position") FILTER (WHERE ((c.role)::text = 'creator'::text)) AS creator_names,
            string_agg((m.cached_full_name)::text, ', '::text ORDER BY c."position") FILTER (WHERE ((c.role)::text = 'collaborator'::text)) AS collaborator_names
           FROM (collaborators c
             JOIN makers m ON ((m.id = c.maker_id)))
          WHERE (((c.collaboratable_type)::text = 'Project'::text) AND (c.collaboratable_id = p.id))) pm ON (true));
  SQL
  create_view "reading_group_composite_entry_rankings", sql_definition: <<-SQL
    SELECT rgce.id AS reading_group_composite_entry_id,
    rgce.reading_group_id,
    rgce.reading_group_category_id,
    rgce.collectable_type,
    rgce.collectable_id,
    rgce.collectable_jsonapi_type,
    rgc."position" AS category_position,
    COALESCE(rgep."position", rger."position", rgerc."position", rget."position") AS "position"
   FROM (((((reading_group_composite_entries rgce
     LEFT JOIN reading_group_categories rgc ON ((rgce.reading_group_category_id = rgc.id)))
     LEFT JOIN reading_group_projects rgep ON ((rgce.reading_group_project_id = rgep.id)))
     LEFT JOIN reading_group_resources rger ON ((rgce.reading_group_resource_id = rger.id)))
     LEFT JOIN reading_group_resource_collections rgerc ON ((rgce.reading_group_resource_collection_id = rgerc.id)))
     LEFT JOIN reading_group_texts rget ON ((rgce.reading_group_text_id = rget.id)));
  SQL
  create_view "reading_group_visibilities", sql_definition: <<-SQL
    SELECT rg.id AS reading_group_id,
    rgm.id AS reading_group_membership_id,
    u.id AS user_id,
    rg.privacy,
    ((rgm.id IS NULL) AND ((rg.privacy)::text = 'public'::text)) AS joinable,
    ((rgm.id IS NOT NULL) AND (rgm.aasm_state = 'active'::text)) AS joined,
    ((rgm.id IS NOT NULL) AND (rgm.aasm_state = 'archived'::text)) AS archived,
    (((rgm.id IS NULL) AND ((rg.privacy)::text = 'public'::text)) OR ((rgm.id IS NOT NULL) AND (rgm.aasm_state = 'active'::text))) AS visible,
    (rg.creator_id = u.id) AS created
   FROM ((users u
     CROSS JOIN reading_groups rg)
     LEFT JOIN reading_group_memberships rgm ON (((rgm.reading_group_id = rg.id) AND (rgm.user_id = u.id))));
  SQL
  create_view "annotation_reading_group_memberships", sql_definition: <<-SQL
    SELECT a.id AS annotation_id,
    a.reading_group_id,
    a.creator_id AS user_id,
    rgm.id AS reading_group_membership_id,
    rgm.aasm_state
   FROM (annotations a
     LEFT JOIN reading_group_memberships rgm ON (((rgm.reading_group_id = a.reading_group_id) AND (rgm.user_id = a.creator_id))))
  WHERE ((a.creator_id IS NOT NULL) AND (a.reading_group_id IS NOT NULL));
  SQL
  create_view "favorites", sql_definition: <<-SQL
    SELECT user_collected_composite_entries.id,
    user_collected_composite_entries.user_id,
    user_collected_composite_entries.collectable_type AS favoritable_type,
    user_collected_composite_entries.collectable_id AS favoritable_id,
    user_collected_composite_entries.project_id,
    user_collected_composite_entries.created_at,
    user_collected_composite_entries.updated_at
   FROM user_collected_composite_entries;
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
    (t.fa_cache #>> '{description,formatted}'::text[]) AS description_formatted,
    (t.fa_cache #>> '{description,plaintext}'::text[]) AS description_plaintext,
    t.start_text_section_id,
    t.publication_date,
    t.cover_data,
    t.toc,
    t.ignore_access_restrictions,
    tb.id AS toc_section,
    (tts.titles #>> '{subtitle,raw}'::text[]) AS subtitle,
    (tts.titles #>> '{subtitle,formatted}'::text[]) AS subtitle_formatted,
    (tts.titles #>> '{subtitle,plaintext}'::text[]) AS subtitle_plaintext,
    (tts.titles #>> '{main,raw}'::text[]) AS title,
    (tts.titles #>> '{main,formatted}'::text[]) AS title_formatted,
    (tts.titles #>> '{main,plaintext}'::text[]) AS title_plaintext,
    tts.titles,
    tm.creator_names,
    tm.collaborator_names,
    COALESCE(tac.annotations_count, (0)::bigint) AS annotations_count,
    COALESCE(tac.highlights_count, (0)::bigint) AS highlights_count,
    COALESCE(tac.orphaned_annotations_count, (0)::bigint) AS orphaned_annotations_count,
    COALESCE(tac.orphaned_highlights_count, (0)::bigint) AS orphaned_highlights_count
   FROM ((((texts t
     LEFT JOIN LATERAL ( SELECT count(*) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND (NOT a.orphaned))) AS annotations_count,
            count(*) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND a.orphaned)) AS orphaned_annotations_count,
            count(*) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND (NOT a.orphaned))) AS highlights_count,
            count(*) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND a.orphaned)) AS orphaned_highlights_count
           FROM (annotations a
             JOIN text_sections ts ON ((ts.id = a.text_section_id)))
          WHERE (ts.text_id = t.id)) tac ON (true))
     LEFT JOIN text_title_summaries tts ON ((t.id = tts.text_id)))
     LEFT JOIN LATERAL ( SELECT ts.id
           FROM text_sections ts
          WHERE ((ts.text_id = t.id) AND ((ts.kind)::text = 'navigation'::text))
          ORDER BY ts.created_at
         LIMIT 1) tb ON (true))
     LEFT JOIN LATERAL ( SELECT string_agg((m.cached_full_name)::text, ', '::text ORDER BY c."position") FILTER (WHERE ((c.role)::text = 'creator'::text)) AS creator_names,
            string_agg((m.cached_full_name)::text, ', '::text ORDER BY c."position") FILTER (WHERE ((c.role)::text = 'collaborator'::text)) AS collaborator_names
           FROM (collaborators c
             JOIN makers m ON ((m.id = c.maker_id)))
          WHERE (((c.collaboratable_type)::text = 'Text'::text) AND (c.collaboratable_id = t.id))) tm ON (true));
  SQL
  create_view "user_collections", sql_definition: <<-SQL
    WITH category_type_ids AS (
         SELECT x.user_id,
            '$uncategorized$'::text AS category_id,
            x.collectable_jsonapi_type,
            jsonb_agg(x.collectable_id ORDER BY x.created_at DESC) AS ids
           FROM user_collected_composite_entries x
          GROUP BY x.user_id, '$uncategorized$'::text, x.collectable_jsonapi_type
        ), category_mappings AS (
         SELECT cti.user_id,
            cti.category_id,
            jsonb_object_agg(cti.collectable_jsonapi_type, cti.ids) AS mapping
           FROM category_type_ids cti
          GROUP BY cti.user_id, cti.category_id
        ), collection_mappings AS (
         SELECT cm_1.user_id,
            jsonb_object_agg(cm_1.category_id, cm_1.mapping) AS mapping
           FROM category_mappings cm_1
          GROUP BY cm_1.user_id
        )
 SELECT ((u.id)::text || '-collection'::text) AS id,
    u.id AS user_id,
    '[]'::jsonb AS categories,
    COALESCE(cm.mapping, '{}'::jsonb) AS category_mappings
   FROM (users u
     LEFT JOIN collection_mappings cm ON ((cm.user_id = u.id)));
  SQL
  create_view "reading_group_collections", sql_definition: <<-SQL
    WITH category_type_ids AS (
         SELECT x.reading_group_id,
            COALESCE((x.reading_group_category_id)::text, '$uncategorized$'::text) AS category_id,
            x.collectable_jsonapi_type,
            jsonb_agg(x.collectable_id ORDER BY x."position") AS ids
           FROM reading_group_composite_entry_rankings x
          GROUP BY x.reading_group_id, COALESCE((x.reading_group_category_id)::text, '$uncategorized$'::text), x.collectable_jsonapi_type
        ), category_mappings AS (
         SELECT cti.reading_group_id,
            cti.category_id,
            jsonb_object_agg(cti.collectable_jsonapi_type, cti.ids) AS mapping
           FROM category_type_ids cti
          GROUP BY cti.reading_group_id, cti.category_id
        ), collection_mappings AS (
         SELECT cm_1.reading_group_id,
            jsonb_object_agg(cm_1.category_id, cm_1.mapping) AS mapping
           FROM category_mappings cm_1
          GROUP BY cm_1.reading_group_id
        ), category_lists AS (
         SELECT rgc.reading_group_id,
            jsonb_agg(jsonb_build_object('id', rgc.id, 'title', (rgc.fa_cache -> 'title'::text), 'description', (rgc.fa_cache -> 'description'::text), 'position', rgc."position") ORDER BY rgc."position") AS categories
           FROM reading_group_categories rgc
          GROUP BY rgc.reading_group_id
        )
 SELECT ((rg.id)::text || '-collection'::text) AS id,
    rg.id AS reading_group_id,
    COALESCE(cl.categories, '[]'::jsonb) AS categories,
    COALESCE(cm.mapping, '{}'::jsonb) AS category_mappings
   FROM ((reading_groups rg
     LEFT JOIN category_lists cl ON ((cl.reading_group_id = rg.id)))
     LEFT JOIN collection_mappings cm ON ((cm.reading_group_id = rg.id)));
  SQL
end
