module V1
  class MakerSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities

    attributes :id,
               :first_name,
               :last_name,
               :middle_name,
               :display_name,
               :full_name,
               :suffix,
               :prefix

    camelized_attributes :avatar_styles

  end
end
