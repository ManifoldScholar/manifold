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

ActiveRecord::Schema.define(version: 20170803195751) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

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
    t.string   "thumbnail_file_name"
    t.string   "thumbnail_content_type"
    t.integer  "thumbnail_file_size"
    t.datetime "thumbnail_updated_at"
    t.string   "thumbnail_checksum"
    t.string   "fingerprint"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "slug"
    t.integer  "collection_resources_count", default: 0
    t.index ["slug"], name: "index_collections_on_slug", unique: true, using: :btree
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
    t.integer  "flags_count"
    t.index ["created_at"], name: "index_comments_on_created_at", using: :brin
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
  end

  create_table "favorites", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "favoritable_id"
    t.string   "favoritable_type"
    t.uuid     "user_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
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

  create_table "ingestion_sources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "text_id"
    t.string   "source_identifier"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.string   "kind"
    t.text     "source_path"
    t.string   "attachment_file_name"
    t.string   "attachment_content_type"
    t.integer  "attachment_file_size"
    t.datetime "attachment_updated_at"
  end

  create_table "ingestions", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "state"
    t.string   "log",                              array: true
    t.string   "source_file_name"
    t.string   "source_content_type"
    t.integer  "source_file_size"
    t.datetime "source_updated_at"
    t.string   "strategy"
    t.string   "external_source_url"
    t.string   "ingestion_type"
    t.uuid     "creator_id"
    t.uuid     "text_id"
    t.uuid     "project_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "makers", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "sort_name"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
    t.string   "display_name"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
  end

  create_table "pages", force: :cascade do |t|
    t.string   "title"
    t.string   "nav_title"
    t.boolean  "show_in_footer",   default: false
    t.boolean  "show_in_header",   default: false
    t.string   "slug"
    t.boolean  "hidden",           default: false
    t.text     "body"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.boolean  "is_external_link", default: false
    t.text     "external_link"
    t.boolean  "open_in_new_tab",  default: false
    t.uuid     "creator_id"
    t.index ["slug"], name: "index_pages_on_slug", unique: true, using: :btree
  end

  create_table "project_subjects", force: :cascade do |t|
    t.uuid "project_id"
    t.uuid "subject_id"
  end

  create_table "projects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "title"
    t.string   "subtitle"
    t.text     "description"
    t.string   "cover_file_name"
    t.string   "cover_content_type"
    t.integer  "cover_file_size"
    t.datetime "cover_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "featured",                default: false
    t.uuid     "published_text_id"
    t.string   "hashtag"
    t.string   "purchase_url"
    t.bigint   "purchase_price_in_cents"
    t.string   "purchase_price_currency"
    t.string   "purchase_version_label"
    t.string   "instagram_id"
    t.string   "twitter_id"
    t.string   "facebook_id"
    t.string   "hero_file_name"
    t.string   "hero_content_type"
    t.integer  "hero_file_size"
    t.datetime "hero_updated_at"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.jsonb    "metadata",                default: {}
    t.uuid     "creator_id"
    t.jsonb    "tweet_fetch_config",      default: {}
    t.date     "publication_date"
    t.string   "slug"
    t.jsonb    "citations",               default: {}
    t.string   "avatar_color",            default: "primary"
    t.jsonb    "avatar_meta",             default: {},        null: false
    t.index ["slug"], name: "index_projects_on_slug", unique: true, using: :btree
  end

  create_table "resources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "title"
    t.string   "kind"
    t.string   "attachment_file_name"
    t.string   "attachment_content_type"
    t.integer  "attachment_file_size"
    t.datetime "attachment_updated_at"
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.uuid     "creator_id"
    t.uuid     "project_id"
    t.text     "caption"
    t.text     "description"
    t.string   "fingerprint"
    t.text     "keywords"
    t.string   "alt_text"
    t.string   "copyright_status"
    t.string   "copyright_holder"
    t.string   "credit"
    t.string   "external_url"
    t.string   "external_id"
    t.string   "external_type"
    t.boolean  "allow_high_res",                  default: true
    t.boolean  "allow_download",                  default: true
    t.boolean  "doi_requested",                   default: false
    t.datetime "doi_added"
    t.string   "doi",                             default: "f"
    t.string   "high_res_checksum"
    t.string   "transcript_checksum"
    t.string   "translation_checksum"
    t.string   "attachment_checksum"
    t.string   "high_res_file_name"
    t.string   "high_res_content_type"
    t.integer  "high_res_file_size"
    t.datetime "high_res_updated_at"
    t.string   "transcript_file_name"
    t.string   "transcript_content_type"
    t.integer  "transcript_file_size"
    t.datetime "transcript_updated_at"
    t.string   "translation_file_name"
    t.string   "translation_content_type"
    t.integer  "translation_file_size"
    t.datetime "translation_updated_at"
    t.string   "variant_format_one_file_name"
    t.string   "variant_format_one_content_type"
    t.integer  "variant_format_one_file_size"
    t.datetime "variant_format_one_updated_at"
    t.string   "variant_format_two_file_name"
    t.string   "variant_format_two_content_type"
    t.integer  "variant_format_two_file_size"
    t.datetime "variant_format_two_updated_at"
    t.string   "variant_thumbnail_file_name"
    t.string   "variant_thumbnail_content_type"
    t.integer  "variant_thumbnail_file_size"
    t.datetime "variant_thumbnail_updated_at"
    t.string   "variant_poster_file_name"
    t.string   "variant_poster_content_type"
    t.integer  "variant_poster_file_size"
    t.datetime "variant_poster_updated_at"
    t.string   "iframe_dimensions"
    t.text     "embed_code"
    t.string   "sub_kind"
    t.string   "slug"
    t.integer  "comments_count",                  default: 0
    t.index ["slug"], name: "index_resources_on_slug", unique: true, using: :btree
  end

  create_table "settings", force: :cascade do |t|
    t.jsonb    "general",                 default: {}
    t.jsonb    "theme",                   default: {}
    t.integer  "singleton_guard"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.string   "press_logo_file_name"
    t.string   "press_logo_content_type"
    t.integer  "press_logo_file_size"
    t.datetime "press_logo_updated_at"
    t.jsonb    "integrations",            default: {}
    t.jsonb    "secrets",                 default: {}
    t.jsonb    "email",                   default: {}
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
    t.string   "unique_identifier"
    t.string   "language"
    t.date     "publication_date"
    t.string   "rights"
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

  create_table "user_claims", force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "maker_id"
  end

  create_table "users", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "email"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "password_digest"
    t.string   "password"
    t.string   "password_confirmation"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "role",                   default: "reader"
    t.text     "nickname"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.boolean  "is_cli_user",            default: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
  end

  add_foreign_key "identities", "users", on_delete: :cascade
end
