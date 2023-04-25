class RemoveHasMathMl < ActiveRecord::Migration[6.0]
  def change
    remove_column :text_sections, :has_mathml, :boolean
  end
end
