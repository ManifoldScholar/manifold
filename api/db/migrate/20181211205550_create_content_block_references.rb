class CreateContentBlockReferences < ActiveRecord::Migration[5.0]
  def change
    create_table :content_block_references, id: :uuid do |t|
      t.belongs_to :content_block, type: :uuid
      t.belongs_to :referencable, polymorphic: true, type: :uuid, index: { name: "index_content_block_references_on_referencable" }
      t.string :kind, null: false
    end
  end
end
