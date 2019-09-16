require 'rails_helper'
require_relative 'base_types'

module Contacts
  class << self
    def request_create
      Type.request(
        Type.object({
          email: Type.email,
          fullName: Type.string,
          message: Type.string,
        })
      )
    end

    def error
      Type.object({
        errors: Type.array(
          type: Type.object({
            source: Type.object({
              pointer: Type.string({ example: '/data/attributes/fullName' })
            }),
            detail: Type.string({ example: 'is required' })
          })
        )
      })
    end
  end
end
