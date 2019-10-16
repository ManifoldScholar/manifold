require_relative 'base_types'

module Subjects
  class << self

    def get_resource_attributes
      { name: Type.string }
    end

    def create_request
      Type.request( get_resource_attributes )
    end

    def get_resource
      Type.resource_response({
        attributes: get_resource_attributes
      })
    end

    def get_collection
      Type.collection_response({
        attributes: get_resource_attributes,
        paginated: true
      })
    end
  end
end
