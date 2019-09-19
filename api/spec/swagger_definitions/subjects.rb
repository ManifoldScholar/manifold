require_relative 'base_types'

module Subjects
  class << self
    def request_create
      Type.request(
        Type.object({
          name: Type.string
        })
      )
    end

    def request_update
      request_create()
    end

    def response
      Type.object(
        Type.data_response_hash(
          Type.object({
            name: Type.string
          })
        )
      )
    end
  end
end
