module Types
  module Serializer
    Abilities = Types::Hash.schema(
      create: Types::Bool,
      read: Types::Bool,
      update: Types::Bool,
      delete: Types::Bool
    )

    # each of these are URL's
    AttatchmentStyles = Types::Hash.schema(
      small: Types::String.optional,
      small_square: Types::String.optional,
      small_landscape: Types::String.optional,
      small_portrait: Types::String.optional,
      medium: Types::String.optional,
      medium_square: Types::String.optional,
      medium_landscape: Types::String.optional,
      medium_portrait: Types::String.optional,
      large_landscape: Types::String.optional,
      original: Types::String.optional
    )

    Upload = Types::Hash.schema(
      filename: Types::Bool,
      data: Types::String,
      content_type: Types::String
    )

    ID = Types::String.meta(example: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")
    URL = Types::String.meta(example: "http://some-website.com")
    Meta = Types::Hash.schema(partial: Types::Bool)

    Pointer = Types::Hash.schema(id: ID, type: Types::String)
    Collection = Types::Hash.schema(data: Types::Array.of(Pointer))
    Resource = Types::Hash.schema(data: Pointer)
  end
end
