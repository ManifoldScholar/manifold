class ChangeUsersEmailToCitext < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        enable_extension("citext")

        change_column :users, :email, :citext

        User.reset_column_information

        # Destroy all, but the oldest user account for each email
        say_with_time "destroying duplicate user records" do
          dupe_emails = User.group("LOWER(email)").count.select { |_email, count| count > 1 }.keys
          dupe_emails.each do |email|
            User.where(email: email).order(created_at: :asc).offset(1).destroy_all
          end
        end
      end

      dir.down do
        change_column :users, :email, :string
        disable_extension("citext")
      end
    end
  end
end
