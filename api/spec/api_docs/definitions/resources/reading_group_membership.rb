module APIDocs
  module Definitions
    module Resources
      class ReadingGroupMembership
        class << self
          include APIDocs::Definitions::Resource

          def create_relationships
            {
              data: Types::Hash.schema(
                relationships: Types::Hash.schema(
                  user: Types::Hash.schema(
                    data: Types::Hash.schema(
                      id: Types::Serializer::ID
                    )
                  ),
                  readingGroup: Types::Hash.schema(
                    data: Types::Hash.schema(
                      id: Types::Serializer::ID
                    )
                  )
                )
              )
            }
          end
        end
      end
    end
  end
end
