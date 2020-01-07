module ExportStrategies
  module Operations
    # Split a path by its component parts and pass each component through `Zaru`
    # to ensure that the names are safe to use on filesystems. Not all strategies
    # might require this level of safety, but it's better for portability.
    #
    # @see https://github.com/madrobby/zaru
    class Sanitize
      include Shared::PipelineOperation

      # @api private
      ABSOLUTE_PATH = %r{\A/.+}.freeze

      # @param [String] input
      # @return [String]
      def call(input)
        is_absolute = input.match? ABSOLUTE_PATH

        parts = input.split(File::SEPARATOR)

        return Failure([:empty_path, "Cannot sanitize #{input.inspect}"]) if parts.blank?

        parts.map.with_index do |part, index|
          is_absolute && index.zero? ? "" : Zaru.sanitize!(part)
        end.join(File::SEPARATOR)
      end
    end
  end
end
