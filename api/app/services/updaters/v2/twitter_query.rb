module Updaters
  module V2
    class TwitterQuery < Updaters::AbstractUpdater
      with_options default: nil do
        string :query
        boolean :active
        string :result_type
        record :project
        # TODO add in result
      end
    end
  end
end
