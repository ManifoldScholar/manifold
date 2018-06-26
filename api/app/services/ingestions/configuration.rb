module Ingestions
  module Configuration
    class Error < StandardError; end
    class AlreadyDefined < Error; end
    class InvalidDefinition < Error; end
    class UnknownDefinition < Error; end
  end
end
