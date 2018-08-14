class AddLiveToFeatures < ActiveRecord::Migration[5.0]
  def change
    add_column :features, :live, :boolean, default: false
    reversible do |dir|
      dir.up do
        say_with_time "Making the first feature live" do
          execute <<~SQL.strip
            UPDATE features SET live = true WHERE position = 1
          SQL
        end
      end
    end
  end
end
