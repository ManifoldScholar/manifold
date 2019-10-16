require_relative 'base_types'

module Subjects
  class << self
    def create_request
      Type.request(
        Type.object({
          name: Type.string
        })
      )
    end

    def get_resource
      Type.object(
        Type.data_response_hash(
          Type.object({
            name: Type.string
          })
        )
      )
    end

    def get_collection
      Type.paginated( get_resource )
    end
  end
end
