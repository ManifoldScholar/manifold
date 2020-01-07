# Namespace that contains services related to uploading exported {Project}s
# with various {ExportTargetStrategy strategies}.
module ExportStrategies
  # @api private
  # @abstract
  class Error < StandardError; end

  # Error raised for strategies that are presently disabled
  # and cannot be used or configured.
  #
  # @api private
  class DisabledStrategy < Error; end

  # Error raised for strategies that are misconfigured,
  # because validations have changed or something else
  # has caused them to save with incomplete configurations.
  #
  # @api private
  class MisconfiguredStrategy < Error; end

  # Error raised on strategies that are either unknown
  # or not currently supported.
  #
  # @api private
  class UnsupportedStrategy < Error; end
end
