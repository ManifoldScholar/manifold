module V1
  class SubjectSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :name, NilClass

  end
end
