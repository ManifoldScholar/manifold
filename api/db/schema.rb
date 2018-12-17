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

ActiveRecord::Schema.define(version: 20190122232410) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"
  enable_extension "pg_trgm"
  enable_extension "citext"

  create_table "annotations", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "start_node"
    t.string   "end_node"
    t.integer  "start_char"
    t.integer  "end_char"
    t.text     "subject"
    t.uuid     "text_section_id"
    t.string   "format"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.uuid     "creator_id"
    t.uuid     "resource_id"
    t.text     "body"
    t.boolean  "private",         default: false
    t.integer  "comments_count",  default: 0
    t.uuid     "collection_id"
    t.integer  "events_count",    default: 0
    t.boolean  "orphaned",        default: false, null: false
    t.integer  "flags_count",     default: 0
    t.index ["created_at"], name: "index_annotations_on_created_at", using: :brin
    t.index ["format"], name: "index_annotations_on_format", using: :btree
  end

  create_table "categories", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid    "project_id"
    t.string  "title"
    t.string  "role"
    t.integer "position"
  end

  create_table "collaborators", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "maker_id"
    t.string   "role"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.integer  "position"
    t.string   "collaboratable_type"
    t.uuid     "collaboratable_id"
  end

  create_table "collection_projects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "project_collection_id", null: false
    t.uuid     "project_id",            null: false
    t.integer  "position"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.index ["project_collection_id"], name: "index_collection_projects_on_project_collection_id", using: :btree
    t.index ["project_id", "project_collection_id"], name: "by_project_and_project_collection", unique: true, using: :btree
    t.index ["project_id"], name: "index_collection_projects_on_project_id", using: :btree
  end

  create_table "collection_resources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "resource_id"
    t.uuid     "collection_id"
    t.integer  "position",      default: 0
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "collections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.uuid     "project_id"
    t.string   "thumbnail_checksum"
    t.string   "fingerprint"
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.string   "thumbnail_file_name_deprecated"
    t.string   "thumbnail_content_type_deprecated"
    t.integer  "thumbnail_file_size_deprecated"
    t.datetime "thumbnail_updated_at_deprecated"
    t.string   "slug"
    t.integer  "collection_resources_count",        default: 0
    t.integer  "events_count",                      default: 0
    t.jsonb    "thumbnail_data",                    default: {}
    t.index ["slug"], name: "index_collections_on_slug", unique: true, using: :btree
  end

  create_table "comment_hierarchies", id: false, force: :cascade do |t|
    t.uuid    "ancestor_id",   null: false
    t.uuid    "descendant_id", null: false
    t.integer "generations",   null: false
    t.index ["ancestor_id", "descendant_id", "generations"], name: "comment_anc_desc_idx", unique: true, using: :btree
    t.index ["descendant_id"], name: "comment_desc_idx", using: :btree
  end

  create_table "comments", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.text     "body"
    t.uuid     "creator_id"
    t.uuid     "parent_id"
    t.uuid     "subject_id"
    t.string   "subject_type"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.boolean  "deleted",        default: false
    t.integer  "children_count", default: 0
    t.integer  "flags_count",    default: 0
    t.integer  "sort_order"
    t.integer  "events_count",   default: 0
    t.index ["created_at"], name: "index_comments_on_created_at", using: :brin
  end

  create_table "content_block_references", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid   "content_block_id"
    t.string "referencable_type"
    t.uuid   "referencable_id"
    t.string "kind",              null: false
    t.index ["content_block_id"], name: "index_content_block_references_on_content_block_id", using: :btree
    t.index ["referencable_type", "referencable_id"], name: "index_content_block_references_on_referencable", using: :btree
  end

  create_table "content_blocks", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string  "type",                       null: false
    t.jsonb   "configuration", default: {}, null: false
    t.integer "position"
    t.uuid    "project_id"
    t.index ["project_id"], name: "index_content_blocks_on_project_id", using: :btree
  end

  create_table "events", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "event_type"
    t.string   "event_url"
    t.uuid     "subject_id"
    t.string   "subject_type"
    t.string   "subject_title"
    t.string   "subject_subtitle"
    t.string   "attribution_name"
    t.string   "attribution_url"
    t.string   "attribution_identifier"
    t.text     "excerpt"
    t.uuid     "project_id"
    t.string   "event_title"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "event_subtitle"
    t.string   "external_subject_id"
    t.string   "external_subject_type"
    t.uuid     "twitter_query_id"
  end

  create_table "favorites", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "favoritable_id"
    t.string   "favoritable_type"
    t.uuid     "user_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "features", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "header"
    t.string   "subheader"
    t.string   "body"
    t.string   "link_text"
    t.string   "link_url"
    t.string   "link_target"
    t.integer  "position"
    t.text     "style",                              default: "dark"
    t.boolean  "hidden",                             default: false
    t.uuid     "creator_id"
    t.datetime "created_at",                                          null: false
    t.datetime "updated_at",                                          null: false
    t.string   "background_file_name_deprecated"
    t.string   "background_content_type_deprecated"
    t.integer  "background_file_size_deprecated"
    t.datetime "background_updated_at_deprecated"
    t.string   "foreground_file_name_deprecated"
    t.string   "foreground_content_type_deprecated"
    t.integer  "foreground_file_size_deprecated"
    t.datetime "foreground_updated_at_deprecated"
    t.string   "background_color"
    t.string   "foreground_color"
    t.string   "header_color"
    t.string   "layout"
    t.string   "foreground_top"
    t.string   "foreground_left"
    t.string   "foreground_position"
    t.boolean  "live",                               default: false
    t.jsonb    "background_data",                    default: {}
    t.jsonb    "foreground_data",                    default: {}
    t.boolean  "include_sign_up",                    default: false,  null: false
  end

  create_table "flags", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "creator_id"
    t.uuid     "flaggable_id"
    t.string   "flaggable_type"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string   "slug",                      null: false
    t.integer  "sluggable_id",              null: false
    t.string   "sluggable_type", limit: 50
    t.string   "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true, using: :btree
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type", using: :btree
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id", using: :btree
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type", using: :btree
  end

  create_table "identities", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "user_id",                   null: false
    t.text     "provider",                  null: false
    t.text     "uid",                       null: false
    t.jsonb    "info",       default: "{}", null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["uid", "provider"], name: "index_identities_on_uid_and_provider", unique: true, using: :btree
    t.index ["user_id"], name: "index_identities_on_user_id", using: :btree
  end

  create_table "import_selection_matches", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "import_selection_id", null: false
    t.uuid     "searchable_node_id"
    t.uuid     "text_section_id",     null: false
    t.uuid     "annotation_id"
    t.integer  "start_char"
    t.integer  "end_char"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["annotation_id"], name: "index_import_selection_matches_on_annotation_id", using: :btree
    t.index ["import_selection_id"], name: "index_import_selection_matches_on_import_selection_id", using: :btree
    t.index ["searchable_node_id"], name: "index_import_selection_matches_on_searchable_node_id", using: :btree
    t.index ["text_section_id"], name: "index_import_selection_matches_on_text_section_id", using: :btree
  end

  create_table "import_selections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "text_id",                     null: false
    t.string   "source_text_id",              null: false
    t.text     "previous_text"
    t.text     "previous_body"
    t.text     "body",                        null: false
    t.text     "next_body"
    t.text     "next_text"
    t.integer  "matches_count",  default: 0,  null: false
    t.jsonb    "comments",       default: [], null: false
    t.jsonb    "highlights",     default: [], null: false
    t.datetime "imported_at"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.index ["imported_at"], name: "index_import_selections_on_imported_at", using: :btree
    t.index ["matches_count"], name: "index_import_selections_on_matches_count", using: :btree
    t.index ["source_text_id"], name: "index_import_selections_on_source_text_id", using: :btree
    t.index ["text_id"], name: "index_import_selections_on_text_id", using: :btree
  end

  create_table "ingestion_sources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "text_id"
    t.string   "source_identifier"
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.string   "kind"
    t.text     "source_path"
    t.string   "attachment_file_name_deprecated"
    t.string   "attachment_content_type_deprecated"
    t.integer  "attachment_file_size_deprecated"
    t.datetime "attachment_updated_at_deprecated"
    t.jsonb    "attachment_data",                    default: {}
  end

  create_table "ingestions", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "state"
    t.string   "log",                                           array: true
    t.string   "strategy"
    t.string   "external_source_url"
    t.string   "ingestion_type"
    t.uuid     "creator_id",                       null: false
    t.uuid     "text_id"
    t.uuid     "project_id",                       null: false
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.string   "source_file_name"
    t.string   "source_content_type"
    t.integer  "source_file_size"
    t.datetime "source_updated_at"
    t.jsonb    "source_data",         default: {}, null: false
    t.index ["creator_id"], name: "index_ingestions_on_creator_id", using: :btree
    t.index ["project_id"], name: "index_ingestions_on_project_id", using: :btree
    t.index ["state"], name: "index_ingestions_on_state", using: :btree
    t.index ["text_id"], name: "index_ingestions_on_text_id", using: :btree
  end

  create_table "makers", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
    t.string   "display_name"
    t.string   "avatar_file_name_deprecated"
    t.string   "avatar_content_type_deprecated"
    t.integer  "avatar_file_size_deprecated"
    t.datetime "avatar_updated_at_deprecated"
    t.string   "suffix"
    t.jsonb    "avatar_data",                    default: {}
    t.string   "prefix"
    t.index "(((COALESCE(last_name, ''::character varying))::text || (COALESCE(first_name, ''::character varying))::text))", name: "index_makers_sort_by_name", using: :btree
  end

  create_table "notification_preferences", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "user_id",                      null: false
    t.string   "kind",                         null: false
    t.string   "frequency",  default: "never", null: false
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["frequency"], name: "index_notification_preferences_on_frequency", using: :btree
    t.index ["kind"], name: "index_notification_preferences_on_kind", using: :btree
    t.index ["user_id", "kind"], name: "index_notification_preferences_on_user_id_and_kind", unique: true, using: :btree
    t.index ["user_id"], name: "index_notification_preferences_on_user_id", using: :btree
  end

  create_table "pages", force: :cascade do |t|
    t.string   "title"
    t.string   "nav_title"
    t.boolean  "show_in_footer",   default: false
    t.boolean  "show_in_header",   default: false
    t.string   "slug"
    t.boolean  "hidden",           default: true
    t.text     "body"
    t.datetime "created_at",                                        null: false
    t.datetime "updated_at",                                        null: false
    t.boolean  "is_external_link", default: false
    t.text     "external_link"
    t.boolean  "open_in_new_tab",  default: false
    t.uuid     "creator_id"
    t.string   "purpose",          default: "supplemental_content"
    t.index ["slug"], name: "index_pages_on_slug", unique: true, using: :btree
  end

  create_table "project_collection_subjects", force: :cascade do |t|
    t.uuid     "project_collection_id", null: false
    t.uuid     "subject_id",            null: false
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.index ["project_collection_id"], name: "index_project_collection_subjects_on_project_collection_id", using: :btree
    t.index ["subject_id"], name: "index_project_collection_subjects_on_subject_id", using: :btree
  end

  create_table "project_collections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "title",                                                null: false
    t.integer  "position"
    t.string   "sort_order",                default: "created_at_asc", null: false
    t.boolean  "smart",                     default: false,            null: false
    t.boolean  "visible",                   default: false,            null: false
    t.boolean  "homepage",                  default: false,            null: false
    t.string   "icon"
    t.integer  "number_of_projects"
    t.boolean  "featured_only",             default: false,            null: false
    t.string   "slug"
    t.string   "description"
    t.uuid     "creator_id"
    t.integer  "collection_projects_count", default: 0,                null: false
    t.datetime "created_at",                                           null: false
    t.datetime "updated_at",                                           null: false
    t.text     "descriptions"
    t.date     "homepage_start_date"
    t.date     "homepage_end_date"
    t.integer  "homepage_count"
    t.index ["creator_id"], name: "index_project_collections_on_creator_id", using: :btree
    t.index ["slug"], name: "index_project_collections_on_slug", unique: true, using: :btree
  end

  create_table "project_subjects", force: :cascade do |t|
    t.uuid "project_id"
    t.uuid "subject_id"
  end

  create_table "projects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "title"
    t.string   "subtitle"
    t.text     "description"
    t.string   "cover_file_name_deprecated"
    t.string   "cover_content_type_deprecated"
    t.integer  "cover_file_size_deprecated"
    t.datetime "cover_updated_at_deprecated"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "featured",                                          default: false
    t.uuid     "published_text_id"
    t.string   "hashtag"
    t.string   "purchase_url"
    t.bigint   "purchase_price_in_cents"
    t.string   "purchase_price_currency"
    t.string   "purchase_call_to_action"
    t.string   "instagram_id"
    t.string   "twitter_id"
    t.string   "facebook_id"
    t.string   "hero_file_name_deprecated"
    t.string   "hero_content_type_deprecated"
    t.integer  "hero_file_size_deprecated"
    t.datetime "hero_updated_at_deprecated"
    t.string   "avatar_file_name_deprecated"
    t.string   "avatar_content_type_deprecated"
    t.integer  "avatar_file_size_deprecated"
    t.datetime "avatar_updated_at_deprecated"
    t.jsonb    "metadata",                                          default: {}
    t.uuid     "creator_id"
    t.date     "publication_date"
    t.string   "slug"
    t.string   "avatar_color",                                      default: "primary"
    t.jsonb    "citations",                                         default: {}
    t.boolean  "draft",                                             default: true,      null: false
    t.boolean  "hide_activity",                                     default: false
    t.string   "sort_title"
    t.integer  "events_count",                                      default: 0
    t.string   "download_url"
    t.string   "download_call_to_action"
    t.string   "published_text_attachment_file_name_deprecated"
    t.string   "published_text_attachment_content_type_deprecated"
    t.integer  "published_text_attachment_file_size_deprecated"
    t.datetime "published_text_attachment_updated_at_deprecated"
    t.jsonb    "cover_data",                                        default: {}
    t.jsonb    "hero_data",                                         default: {}
    t.jsonb    "avatar_data",                                       default: {}
    t.jsonb    "published_text_attachment_data",                    default: {}
    t.index ["slug"], name: "index_projects_on_slug", unique: true, using: :btree
  end

  create_table "resource_import_row_transitions", force: :cascade do |t|
    t.string   "to_state",                            null: false
    t.jsonb    "metadata",               default: {}
    t.integer  "sort_key",                            null: false
    t.uuid     "resource_import_row_id",              null: false
    t.boolean  "most_recent",                         null: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["resource_import_row_id", "most_recent"], name: "index_resource_import_row_transitions_parent_most_recent", unique: true, where: "most_recent", using: :btree
    t.index ["resource_import_row_id", "sort_key"], name: "index_resource_import_row_transitions_parent_sort", unique: true, using: :btree
  end

  create_table "resource_import_rows", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "resource_import_id"
    t.uuid     "resource_id"
    t.uuid     "collection_id"
    t.string   "row_type",           default: "data"
    t.integer  "line_number",                         null: false
    t.text     "values",             default: [],                  array: true
    t.text     "import_errors",      default: [],                  array: true
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["collection_id"], name: "index_resource_import_rows_on_collection_id", using: :btree
    t.index ["resource_id"], name: "index_resource_import_rows_on_resource_id", using: :btree
    t.index ["resource_import_id"], name: "index_resource_import_rows_on_resource_import_id", using: :btree
  end

  create_table "resource_import_transitions", force: :cascade do |t|
    t.string   "to_state",                        null: false
    t.jsonb    "metadata",           default: {}
    t.integer  "sort_key",                        null: false
    t.uuid     "resource_import_id",              null: false
    t.boolean  "most_recent",                     null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["resource_import_id", "most_recent"], name: "index_resource_import_transitions_parent_most_recent", unique: true, where: "most_recent", using: :btree
    t.index ["resource_import_id", "sort_key"], name: "index_resource_import_transitions_parent_sort", unique: true, using: :btree
  end

  create_table "resource_imports", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "creator_id"
    t.uuid     "project_id"
    t.string   "storage_type"
    t.string   "storage_identifier"
    t.string   "source",                                       null: false
    t.string   "url"
    t.integer  "header_row",                   default: 1
    t.jsonb    "column_map",                   default: {},    null: false
    t.jsonb    "column_automap",               default: {},    null: false
    t.boolean  "parse_error",                  default: false, null: false
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.string   "data_file_name_deprecated"
    t.string   "data_content_type_deprecated"
    t.integer  "data_file_size_deprecated"
    t.datetime "data_updated_at_deprecated"
    t.jsonb    "data_data",                    default: {}
    t.index ["creator_id"], name: "index_resource_imports_on_creator_id", using: :btree
    t.index ["project_id"], name: "index_resource_imports_on_project_id", using: :btree
  end

  create_table "resources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "title"
    t.string   "kind"
    t.string   "attachment_file_name_deprecated"
    t.string   "attachment_content_type_deprecated"
    t.integer  "attachment_file_size_deprecated"
    t.datetime "attachment_updated_at_deprecated"
    t.datetime "created_at",                                                 null: false
    t.datetime "updated_at",                                                 null: false
    t.uuid     "creator_id"
    t.uuid     "project_id"
    t.text     "caption"
    t.text     "description"
    t.string   "fingerprint"
    t.string   "external_url"
    t.string   "external_id"
    t.string   "external_type"
    t.boolean  "allow_high_res",                             default: true
    t.boolean  "allow_download",                             default: true
    t.boolean  "doi_requested",                              default: false
    t.datetime "doi_added"
    t.string   "high_res_checksum"
    t.string   "transcript_checksum"
    t.string   "translation_checksum"
    t.string   "attachment_checksum"
    t.string   "high_res_file_name_deprecated"
    t.string   "high_res_content_type_deprecated"
    t.integer  "high_res_file_size_deprecated"
    t.datetime "high_res_updated_at_deprecated"
    t.string   "transcript_file_name_deprecated"
    t.string   "transcript_content_type_deprecated"
    t.integer  "transcript_file_size_deprecated"
    t.datetime "transcript_updated_at_deprecated"
    t.string   "translation_file_name_deprecated"
    t.string   "translation_content_type_deprecated"
    t.integer  "translation_file_size_deprecated"
    t.datetime "translation_updated_at_deprecated"
    t.string   "variant_format_one_file_name_deprecated"
    t.string   "variant_format_one_content_type_deprecated"
    t.integer  "variant_format_one_file_size_deprecated"
    t.datetime "variant_format_one_updated_at_deprecated"
    t.string   "variant_format_two_file_name_deprecated"
    t.string   "variant_format_two_content_type_deprecated"
    t.integer  "variant_format_two_file_size_deprecated"
    t.datetime "variant_format_two_updated_at_deprecated"
    t.string   "variant_thumbnail_file_name_deprecated"
    t.string   "variant_thumbnail_content_type_deprecated"
    t.integer  "variant_thumbnail_file_size_deprecated"
    t.datetime "variant_thumbnail_updated_at_deprecated"
    t.string   "variant_poster_file_name_deprecated"
    t.string   "variant_poster_content_type_deprecated"
    t.integer  "variant_poster_file_size_deprecated"
    t.datetime "variant_poster_updated_at_deprecated"
    t.text     "embed_code"
    t.string   "sub_kind"
    t.string   "slug"
    t.integer  "comments_count",                             default: 0
    t.jsonb    "metadata",                                   default: {}
    t.integer  "events_count",                               default: 0
    t.integer  "minimum_width"
    t.integer  "minimum_height"
    t.boolean  "iframe_allow_fullscreen",                    default: true
    t.string   "sort_title"
    t.jsonb    "attachment_data",                            default: {}
    t.jsonb    "high_res_data",                              default: {}
    t.jsonb    "transcript_data",                            default: {}
    t.jsonb    "translation_data",                           default: {}
    t.jsonb    "variant_format_one_data",                    default: {}
    t.jsonb    "variant_format_two_data",                    default: {}
    t.jsonb    "variant_thumbnail_data",                     default: {}
    t.jsonb    "variant_poster_data",                        default: {}
    t.index ["slug"], name: "index_resources_on_slug", unique: true, using: :btree
  end

  create_table "roles", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "name",          null: false
    t.string   "resource_type"
    t.uuid     "resource_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id", unique: true, using: :btree
    t.index ["name"], name: "index_roles_on_name", using: :btree
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id", using: :btree
  end

  create_table "searchable_nodes", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "text_section_id"
    t.string   "node_uuid"
    t.text     "content"
    t.integer  "position"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.text     "contains",        default: [],              array: true
  end

  create_table "settings", force: :cascade do |t|
    t.jsonb    "general",                                   default: {}
    t.jsonb    "theme",                                     default: {}
    t.integer  "singleton_guard"
    t.datetime "created_at",                                             null: false
    t.datetime "updated_at",                                             null: false
    t.string   "press_logo_file_name_deprecated"
    t.string   "press_logo_content_type_deprecated"
    t.integer  "press_logo_file_size_deprecated"
    t.datetime "press_logo_updated_at_deprecated"
    t.jsonb    "integrations",                              default: {}
    t.jsonb    "secrets",                                   default: {}
    t.jsonb    "email",                                     default: {}
    t.string   "press_logo_footer_file_name_deprecated"
    t.string   "press_logo_footer_content_type_deprecated"
    t.integer  "press_logo_footer_file_size_deprecated"
    t.datetime "press_logo_footer_updated_at_deprecated"
    t.string   "press_logo_mobile_file_name_deprecated"
    t.string   "press_logo_mobile_content_type_deprecated"
    t.integer  "press_logo_mobile_file_size_deprecated"
    t.datetime "press_logo_mobile_updated_at_deprecated"
    t.jsonb    "press_logo_data",                           default: {}
    t.jsonb    "press_logo_footer_data",                    default: {}
    t.jsonb    "press_logo_mobile_data",                    default: {}
    t.jsonb    "favicon_data",                              default: {}
    t.index ["singleton_guard"], name: "index_settings_on_singleton_guard", unique: true, using: :btree
  end

  create_table "stylesheets", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "name"
    t.string   "source_identifier"
    t.text     "styles"
    t.text     "raw_styles"
    t.uuid     "text_id"
    t.uuid     "ingestion_source_id"
    t.boolean  "ingested",            default: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "position"
    t.uuid     "creator_id"
    t.string   "hashed_content"
  end

  create_table "subjects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "taggings", force: :cascade do |t|
    t.integer  "tag_id"
    t.string   "taggable_type"
    t.uuid     "taggable_id"
    t.string   "tagger_type"
    t.integer  "tagger_id"
    t.string   "context",       limit: 128
    t.datetime "created_at"
    t.index ["context"], name: "index_taggings_on_context", using: :btree
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true, using: :btree
    t.index ["tag_id"], name: "index_taggings_on_tag_id", using: :btree
    t.index ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context", using: :btree
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy", using: :btree
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id", using: :btree
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type", using: :btree
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type", using: :btree
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id", using: :btree
  end

  create_table "tags", force: :cascade do |t|
    t.string  "name"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true, using: :btree
  end

  create_table "text_section_stylesheets", force: :cascade do |t|
    t.uuid     "text_section_id", null: false
    t.uuid     "stylesheet_id",   null: false
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["stylesheet_id"], name: "index_text_section_stylesheets_on_stylesheet_id", using: :btree
    t.index ["text_section_id"], name: "index_text_section_stylesheets_on_text_section_id", using: :btree
  end

  create_table "text_sections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "name"
    t.text     "source_body"
    t.text     "body"
    t.string   "source_identifier"
    t.uuid     "text_id"
    t.integer  "position"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.string   "kind"
    t.uuid     "ingestion_source_id"
    t.jsonb    "body_json",           default: "{}", null: false
    t.jsonb    "citations",           default: {}
    t.index ["text_id"], name: "index_text_sections_on_text_id", using: :btree
  end

  create_table "text_subjects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "text_id"
    t.uuid     "subject_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "text_titles", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "value"
    t.string   "kind"
    t.integer  "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid     "text_id"
  end

  create_table "texts", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "title"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.date     "publication_date"
    t.string   "description"
    t.text     "toc"
    t.text     "page_list"
    t.text     "landmarks"
    t.text     "structure_titles"
    t.uuid     "project_id"
    t.uuid     "category_id"
    t.uuid     "creator_id"
    t.uuid     "start_text_section_id"
    t.integer  "position"
    t.string   "spine",                 default: [],              array: true
    t.jsonb    "metadata",              default: {}
    t.string   "slug"
    t.jsonb    "citations",             default: {}
    t.string   "section_kind"
    t.integer  "events_count",          default: 0
    t.jsonb    "cover_data",            default: {}
    t.index ["created_at"], name: "index_texts_on_created_at", using: :brin
    t.index ["slug"], name: "index_texts_on_slug", unique: true, using: :btree
  end

  create_table "thumbnail_fetch_attempts", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.boolean "successful",  default: false, null: false
    t.integer "attempts",    default: 0
    t.string  "reference"
    t.uuid    "resource_id"
    t.index ["resource_id"], name: "index_thumbnail_fetch_attempts_on_resource_id", using: :btree
  end

  create_table "twitter_queries", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.uuid     "project_id"
    t.uuid     "creator_id"
    t.string   "query"
    t.boolean  "active",               default: true,          null: false
    t.integer  "events_count",         default: 0
    t.string   "result_type",          default: "most_recent"
    t.string   "most_recent_tweet_id"
  end

  create_table "upgrade_results", primary_key: "version", id: :string, force: :cascade do |t|
    t.text     "output",     default: "", null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "users", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.citext   "email"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "password_digest"
    t.string   "password"
    t.string   "password_confirmation"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "nickname"
    t.string   "avatar_file_name_deprecated"
    t.string   "avatar_content_type_deprecated"
    t.integer  "avatar_file_size_deprecated"
    t.datetime "avatar_updated_at_deprecated"
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.jsonb    "raw_persistent_ui",              default: {},        null: false
    t.string   "classification",                 default: "default", null: false
    t.datetime "imported_at"
    t.string   "import_source_id"
    t.jsonb    "avatar_data",                    default: {}
    t.index ["classification"], name: "udx_users_anonymous", unique: true, where: "((classification)::text = 'anonymous'::text)", using: :btree
    t.index ["classification"], name: "udx_users_cli", unique: true, where: "((classification)::text = 'command_line'::text)", using: :btree
    t.index ["import_source_id"], name: "index_users_on_import_source_id", unique: true, where: "(import_source_id IS NOT NULL)", using: :btree
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "role_id", null: false
    t.index ["role_id"], name: "index_users_roles_on_role_id", using: :btree
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id", unique: true, using: :btree
    t.index ["user_id"], name: "index_users_roles_on_user_id", using: :btree
  end

  create_table "versions", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "item_type",        null: false
    t.uuid     "item_id",          null: false
    t.string   "parent_item_type"
    t.uuid     "parent_item_id"
    t.string   "event",            null: false
    t.string   "whodunnit"
    t.jsonb    "object"
    t.jsonb    "object_changes"
    t.datetime "created_at"
    t.index ["created_at"], name: "index_versions_on_created_at", using: :brin
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree
    t.index ["parent_item_type", "parent_item_id"], name: "index_versions_on_parent_item_type_and_parent_item_id", using: :btree
  end

  add_foreign_key "identities", "users", on_delete: :cascade
  add_foreign_key "import_selection_matches", "annotations", on_delete: :nullify
  add_foreign_key "import_selection_matches", "import_selections", on_delete: :cascade
  add_foreign_key "import_selection_matches", "searchable_nodes", on_delete: :cascade
  add_foreign_key "import_selection_matches", "text_sections", on_delete: :cascade
  add_foreign_key "import_selections", "texts", on_delete: :cascade
  add_foreign_key "ingestions", "projects", on_delete: :restrict
  add_foreign_key "ingestions", "texts", on_delete: :nullify
  add_foreign_key "ingestions", "users", column: "creator_id", on_delete: :restrict
  add_foreign_key "notification_preferences", "users", on_delete: :cascade
  add_foreign_key "resource_import_row_transitions", "resource_import_rows"
  add_foreign_key "resource_import_rows", "resource_imports", on_delete: :cascade
  add_foreign_key "resource_import_transitions", "resource_imports"
  add_foreign_key "resource_imports", "projects", on_delete: :cascade
  add_foreign_key "resource_imports", "users", column: "creator_id"
  add_foreign_key "users_roles", "roles", on_delete: :cascade
  add_foreign_key "users_roles", "users", on_delete: :cascade

  create_view "permissions",  sql_definition: <<-SQL
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

end
