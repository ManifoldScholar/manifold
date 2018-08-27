class EnforceIngestionReferentialIntegrity < ActiveRecord::Migration[5.0]
  def change

    nullify_text! "ingestions with a nonexistent text" do
      Ingestion.where.not(text_id: Text.unscoped.distinct.select(:id)).where.not(text_id: nil)
    end

    destroy_and_delete! "ingestions without a project" do
      Ingestion.where(project_id: nil).or(Ingestion.where.not(project_id: Project.distinct.select(:id)))
    end

    destroy_and_delete! "incomplete ingestions" do
      Ingestion.where.not state: "finished"
    end

    destroy_and_delete! "unowned ingestions" do
      Ingestion.where(creator_id: nil)
    end

    change_column_null :ingestions, :creator_id, false
    change_column_null :ingestions, :project_id, false

    change_table :ingestions do |t|
      # We should make sure that Rails callbacks always run, so shrine
      # attachments are cleaned up first
      t.foreign_key :projects, on_delete: :restrict
      t.foreign_key :users, column: :creator_id, on_delete: :restrict

      # Should a text be deleted, we'll let the ingestion go back to null
      t.foreign_key :texts, on_delete: :nullify

      t.index :creator_id
      t.index :project_id
      t.index :text_id
      t.index :state
    end
  end

  private

  def nullify_text!(description)
    scope = yield

    Ingestion.reset_column_information

    reversible do |dir|
      dir.up do
        say_with_time "Nullifying text for any #{description}" do
          count = 0

          scope.find_each do |ingestion|
            ingestion.update_columns(text_id: nil)
            count += 1
          end

          count
        end

      end
    end
  end

  def destroy_and_delete!(description)
    scope = yield

    Ingestion.reset_column_information

    reversible do |dir|
      dir.up do
        say_with_time "Removing any #{description}" do
          count = 0

          scope.find_each do |ingestion|
            ingestion.destroy

            count += 1 if ingestion.destroyed?
          end

          count
        end

        say_with_time "Ensuring #{description} were removed" do
          scope.delete_all
        end
      end
    end
  end
end
