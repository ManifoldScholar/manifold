class AddDefaultToJournalHeroLayout < ActiveRecord::Migration[6.0]
  def change
    change_column :journals, :hero_layout, :integer, :default => 0
  end

  def up
    say_with_time 'Setting default hero_layout' do
      execute <<-SQL
        UPDATE journals SET hero_layout = 0 WHERE hero_layout IS NULL;
      SQL
    end
  end

end
