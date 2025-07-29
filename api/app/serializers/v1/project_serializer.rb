# frozen_string_literal: true

module V1
  class ProjectSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::ProjectSerializer
    include ::V1::Concerns::HasOAIRecordSerializer
  end
end
