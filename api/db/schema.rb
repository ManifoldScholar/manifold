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

ActiveRecord::Schema.define(version: 20161024193939) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "annotations", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "start_node"
    t.string   "end_node"
    t.integer  "start_char"
    t.integer  "end_char"
    t.text     "subject"
    t.uuid     "user_id"
    t.uuid     "text_section_id"
    t.string   "format"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "categories", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid   "project_id"
    t.string "title"
    t.string "role"
  end

  create_table "collaborators", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "text_id"
    t.uuid     "maker_id"
    t.string   "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "position"
    t.uuid     "project_id"
  end

  create_table "events", force: :cascade do |t|
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
  end

  create_table "favorites", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.uuid     "favoritable_id"
    t.string   "favoritable_type"
    t.uuid     "user_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
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

  create_table "makers", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "name"
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
    t.boolean  "featured",                 default: false
    t.uuid     "published_text_id"
    t.string   "hashtag"
    t.integer  "publication_year"
    t.integer  "publication_month"
    t.integer  "publication_day_of_month"
    t.string   "purchase_url"
    t.integer  "purchase_price_in_cents"
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
    t.jsonb    "metadata",                 default: {}
    t.uuid     "creator_id"
  end

  create_table "resources", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "name"
    t.string   "type"
    t.string   "attachment_file_name"
    t.string   "attachment_content_type"
    t.integer  "attachment_file_size"
    t.datetime "attachment_updated_at"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.uuid     "creator_id"
  end

  create_table "stylesheets", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string "name"
    t.string "source_identifier"
    t.text   "styles"
    t.text   "raw_styles"
    t.uuid   "text_id"
    t.uuid   "ingestion_source_id"
  end

  create_table "subjects", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "text_sections", id: :uuid, default: -> { "uuid_generate_v4()" }, force: :cascade do |t|
    t.string   "name"
    t.text     "source_body"
    t.text     "body"
    t.string   "source_identifier"
    t.uuid     "text_id"
    t.integer  "position"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "kind"
    t.text     "body_json"
    t.uuid     "ingestion_source_id"
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
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
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
    t.string   "role"
    t.text     "nickname"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.boolean  "is_cli_user",           default: false
  end

end
