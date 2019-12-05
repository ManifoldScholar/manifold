module V1
  class CategorySerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :title, NilClass
    typed_attribute :position, NilClass

  end
end
