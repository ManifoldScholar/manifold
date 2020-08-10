module V1
  class ContentBlockSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    # TODO: List other acceptable types in enum
    typed_attribute :type, Types::String.meta(example: "Content::RecentActivityBlock")
    typed_attribute :position, Types::Integer.meta(description: "Only writable for certain types")
    typed_attribute :visible, Types::Bool.meta(description: "Only writable for certain types")
    typed_attribute :access, Types::String.enum("always", "unauthorized", "authorized")

    # TODO: List other acceptable types in enum
    typed_attribute :incomplete_render_attributes,
                    Types::Array.of(
                      Types::String.meta(example: "resources_or_collections")
                    ).meta(read_only: true)
    typed_attribute :configurable, Types::Bool.meta(read_only: true), &:configurable?
    typed_attribute :orderable, Types::Bool.meta(read_only: true), &:orderable?
    typed_attribute :hideable, Types::Bool.meta(read_only: true), &:hideable?
    typed_attribute :renderable, Types::Bool.meta(read_only: true), &:renderable?

    typed_belongs_to :project

    def self.include_abilities?(_object, _params)
      true
    end

  end
end
