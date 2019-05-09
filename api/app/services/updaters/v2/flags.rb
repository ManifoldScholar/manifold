module Updaters
  module V2
    class Flags < Updaters::AbstractUpdater
      string :creator_id
      string :flaggable_id
    end
  end
end
