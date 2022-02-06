module V1
  class ProjectSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::ProjectSerializer

  end
end
