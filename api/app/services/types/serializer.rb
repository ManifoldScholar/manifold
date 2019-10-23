module Types
  module Serializer
    ID = Types::String.meta(example: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")
    URL = Types::String.meta(example: "http://some-website.com")
    Meta = Types::Hash.schema(partial: Types::Bool)

    Pointer = Types::Hash.schema(id: ID, type: Types::String)
    Collection = Types::Hash.schema(data: Types::Array.of(Pointer))
    Resource = Types::Hash.schema(data: Pointer)

    Abilities = Types::Hash.schema(
      create: Types::Bool,
      read: Types::Bool,
      update: Types::Bool,
      delete: Types::Bool
    )

    Attachtment = Types::Hash.schema(
      small: URL.optional,
      small_square: URL.optional,
      small_landscape: URL.optional,
      small_portrait: URL.optional,
      medium: URL.optional,
      medium_square: URL.optional,
      medium_landscape: URL.optional,
      medium_portrait: URL.optional,
      large_landscape: URL.optional,
      original: URL.optional
    )

    Upload = Types::Hash.schema(
      filename: Types::Bool,
      data: Types::String,
      content_type: Types::String
    )
  end
end
