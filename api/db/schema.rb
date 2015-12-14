# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20151209182138) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "collaborators", force: :cascade do |t|
    t.integer  "text_id"
    t.integer  "maker_id"
    t.string   "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "position"
    t.integer  "project_id"
  end

  create_table "ingestion_sources", force: :cascade do |t|
    t.integer  "text_id"
    t.integer  "resource_id"
    t.string   "source_identifier"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "kind"
    t.text     "source_path"
  end

  create_table "makers", force: :cascade do |t|
    t.string   "name"
    t.string   "sort_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "projects", force: :cascade do |t|
    t.string   "title"
    t.string   "subtitle"
    t.boolean  "published",          default: false, null: false
    t.datetime "published_datetime"
    t.text     "description"
    t.string   "cover_file_name"
    t.string   "cover_content_type"
    t.integer  "cover_file_size"
    t.datetime "cover_updated_at"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.boolean  "featured",           default: false
  end

  create_table "resources", force: :cascade do |t|
    t.string   "name"
    t.string   "type"
    t.string   "attachment_file_name"
    t.string   "attachment_content_type"
    t.integer  "attachment_file_size"
    t.datetime "attachment_updated_at"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "subjects", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "text_sections", force: :cascade do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.text     "source_body"
    t.text     "body"
    t.string   "source_identifier"
    t.integer  "text_id"
    t.integer  "position"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "kind"
    t.text     "body_json"
  end

  create_table "text_subjects", force: :cascade do |t|
    t.integer  "text_id"
    t.integer  "subject_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "text_titles", force: :cascade do |t|
    t.string   "value"
    t.string   "kind"
    t.integer  "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "text_id"
  end

  create_table "texts", force: :cascade do |t|
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
    t.integer  "project_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "password_digest"
    t.string   "password"
    t.string   "password_confirmation"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.string   "role"
  end

end
