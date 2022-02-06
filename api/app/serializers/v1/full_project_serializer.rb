module V1
  class FullProjectSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::ProjectSerializer

    set_type :project

    class << self

      def full?(_params)
        true
      end

    end

  end
end
