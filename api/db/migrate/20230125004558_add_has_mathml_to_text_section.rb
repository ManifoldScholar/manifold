class AddHasMathmlToTextSection < ActiveRecord::Migration[6.0]
  def change
    add_column :text_sections, :has_mathml, :boolean, default: false
  end
end
