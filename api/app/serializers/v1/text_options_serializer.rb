module V1
  class TextOptionsSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :title, NilClass

  end
end
