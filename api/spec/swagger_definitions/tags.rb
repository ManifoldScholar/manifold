require_relative 'base_types'

module Tags
  class << self
    def response
      Type.object({
        id: Type.string,
        type: Type.string,
        attributes: Type.object({
          name: Type.string,
          taggingsCount: Type.number
        }),
        meta: Type.meta_partial
      })
    end

    def responses
      Type.object({
        data: Type.array({ type: self.response() })
      })
    end
  end
end
