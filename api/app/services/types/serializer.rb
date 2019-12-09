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
      smallSquare: Types::String.optional,
      smallLandscape: Types::String.optional,
      smallPortrait: Types::String.optional,
      medium: Types::String.optional,
      mediumSquare: Types::String.optional,
      mediumLandscape: Types::String.optional,
      mediumPortrait: Types::String.optional,
      largeLandscape: Types::String.optional,
      original: Types::String.optional
    )

    Upload = Types::Hash.schema(
      filename: Types::Bool,
      data: Types::String,
      contentType: Types::String
    )

    ID = Types::String.meta(example: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")
    URL = Types::String.meta(example: "http://some-website.com")
    Meta = Types::Hash.schema(partial: Types::Bool)

    Pointer = Types::Hash.schema(id: ID, type: Types::String)
    Collection = Types::Hash.schema(data: Types::Array.of(Pointer))
    Resource = Types::Hash.schema(data: Pointer)
  end
end
