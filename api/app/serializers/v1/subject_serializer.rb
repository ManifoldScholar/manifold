module V1
  class SubjectSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    attributes :name

  end
end
