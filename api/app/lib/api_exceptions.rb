module APIExceptions
  class AccessDeniedError < ::StandardError; end
  class StandardError < ::StandardError; end
  class NotAuthenticatedError < ::StandardError; end
  class AuthenticationTimeoutError < ::StandardError; end
end
