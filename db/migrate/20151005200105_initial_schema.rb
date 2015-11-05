class InitialSchema < ActiveRecord::Migration
  def change
    create_table "collaborators", force: :cascade do |t|
      t.integer "text_id"
      t.integer "maker_id"
      t.string "role"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.integer "position"
    end

    create_table "text_sections", force: :cascade do |t|
      t.string "name"
      t.integer "resource_id"
      t.text "source_body"
      t.text "body"
      t.string "source_identifier"
      t.integer "text_id"
      t.integer "position"
      t.datetime "created_at",        null: false
      t.datetime "updated_at",        null: false
    end

    create_table "ingestion_sources", force: :cascade do |t|
      t.integer "text_id"
      t.integer "resource_id"
      t.string "source_identifier"
      t.datetime "created_at",        null: false
      t.datetime "updated_at",        null: false
      t.string "kind"
      t.text "source_path"
    end

    create_table "makers", force: :cascade do |t|
      t.string "name"
      t.string "sort_name"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end

    create_table "resources", force: :cascade do |t|
      t.string "name"
      t.string "type"
      t.string "attachment_file_name"
      t.string "attachment_content_type"
      t.integer "attachment_file_size"
      t.datetime "attachment_updated_at"
      t.datetime "created_at",              null: false
      t.datetime "updated_at",              null: false
    end

    create_table "subjects", force: :cascade do |t|
      t.string "name"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end

    create_table "text_subjects", force: :cascade do |t|
      t.integer "text_id"
      t.integer "subject_id"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end

    create_table "text_titles", force: :cascade do |t|
      t.string "value"
      t.string "kind"
      t.integer "position"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.integer "text_id"
    end

    create_table "texts", force: :cascade do |t|
      t.string "title"
      t.datetime "created_at",        null: false
      t.datetime "updated_at",        null: false
      t.string "unique_identifier"
      t.string "language"
      t.date "publication_date"
      t.string "rights"
      t.string "description"
      t.text "toc"
      t.text "page_list"
      t.text "landmarks"
      t.text "structure_titles"
    end
  end
end
