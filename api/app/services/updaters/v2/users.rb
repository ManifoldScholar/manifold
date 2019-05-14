module Updaters
  module V2
    class Users < Updaters::AbstractUpdater

      attachment_field :avatar

      with_options default: nil do
        string :email
        string :first_name
        string :last_name
        string :nickname
        string :password
        string :password_confirmation
      end
    end
  end
end
