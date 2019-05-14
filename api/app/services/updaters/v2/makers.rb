module Updaters
  module V2
    class Makers < Updaters::AbstractUpdater
      attachment_field :avatar

      with_options default: nil do
        string :first_name
        string :middle_name
        string :last_name
        string :name
        string :prefix
        string :suffix
      end
    end
  end
end
