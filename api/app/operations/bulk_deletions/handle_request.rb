# frozen_string_literal: true

module BulkDeletions
  # @see BulkDeletions::RequestHandler
  class HandleRequest
    # @see BulkDeletions::RequestHandler#call
    # @return [Dry::Monads::Result]
    def call(...)
      BulkDeletions::RequestHandler.new(...).call
    end
  end
end
