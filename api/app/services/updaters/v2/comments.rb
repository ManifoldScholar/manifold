module Updaters
  module V2
    class Comments < Updaters::AbstractUpdater
      with_options default: nil do
        record :subject

        string :body

        # default false
        boolean :deleted
      end

      validates :creator, presence: true
      validates :subject, presence: true
    end
  end
end
