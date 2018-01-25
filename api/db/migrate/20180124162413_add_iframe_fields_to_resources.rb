class AddIframeFieldsToResources < ActiveRecord::Migration[5.0]
  def change
    add_column :resources, :minimum_width, :integer
    add_column :resources, :minimum_height, :integer
    add_column :resources, :iframe_allow_fullscreen, :boolean, default: true
    remove_column :resources, :iframe_dimensions, :string
    reversible do |change|

      change.up do
        where = "WHERE kind = 'interactive' AND sub_kind = 'iframe'"
        update "UPDATE resources SET minimum_width = 800 #{where}"
        update "UPDATE resources SET minimum_height = 1000 #{where}"
        update "UPDATE resources SET sub_kind = NULL #{where}"
      end

    end

  end
end
