# frozen_string_literal: true

module JSONAPI
  module Types
    include Dry.Types

    AnonymousUser = Instance(::AnonymousUser)
    AuthorizedUser = Instance(::User)

    AnyUser = (AuthorizedUser | AnonymousUser).default { AnonymousUser.new }

    OperationOp = Types::String.enum("add", "update", "remove")
  end
end
