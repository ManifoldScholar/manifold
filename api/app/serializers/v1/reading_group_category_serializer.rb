module V1
  class ReadingGroupCategorySerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_belongs_to :reading_group

    typed_has_many :projects
    typed_has_many :resources
    typed_has_many :resource_collections
    typed_has_many :texts

    typed_attribute :slug, Types::String.meta(read_only: true)
    typed_attribute :position, Types::Integer

    ReadingGroupCategory.formatted_attributes.each do |attribute|
      name = attribute.attribute_name.to_sym

      typed_attribute name, Types::String

      typed_attribute :"#{name}_formatted", Types::String.meta(read_only: true)
      typed_attribute :"#{name}_plaintext", Types::String.meta(read_only: true)
    end
  end
end
