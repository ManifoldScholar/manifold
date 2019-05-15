module Updaters
  module V2
    class Collaborators < Updaters::AbstractUpdater
      with_options default: nil do
        string :role
        record :maker
        # QUESTION where to get collaboratable?
      end

      validates :maker, presence: true
    end
  end
end
