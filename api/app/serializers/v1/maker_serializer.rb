module V1
  class MakerSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :id, NilClass
    typed_attribute :first_name, NilClass
    typed_attribute :last_name, NilClass
    typed_attribute :middle_name, NilClass
    typed_attribute :display_name, NilClass
    typed_attribute :full_name, NilClass
    typed_attribute :suffix, NilClass
    typed_attribute :prefix, NilClass
    typed_attribute :avatar_styles, Hash

  end
end
