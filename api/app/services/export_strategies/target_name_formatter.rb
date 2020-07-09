module ExportStrategies
  class TargetNameFormatter
    extend Dry::Initializer
    extend FormatEngine::AttrFormatter
    extend Memoist

    include Dry::Transaction::Operation
    include Dry::Matcher.for(:format, with: Dry::Matcher::ResultMatcher)
    include ExportStrategies::Import[format_pipeline: "pipelines.format_target_name"]

    DATE_FORMAT = "%Y-%m-%d".freeze
    TIME_FORMAT = "%Y-%m-%dT%H%M%S".freeze
    NO_LEADING_DOT = /\A(?!\.)(.+)\z/.freeze

    option :export_asset_extension, Types::Coercible::String, default: proc { ".zip" }
    option :export_created_at, Types::Time, default: proc { Time.current }
    option :export_id, Types::Coercible::String, default: proc { SecureRandom.uuid }
    option :project_id, Types::Coercible::String, default: proc { SecureRandom.uuid }
    option :project_name, Types::Coercible::String, default: proc { "A Manifold Project" }
    option :project_slug, Types::Coercible::String, default: proc { "manifold-project" }

    attr_formatter(
      :format_with,
      "%d" => -> { cat "%#{fmt.width_str}s" % src.export_created_at.strftime(DATE_FORMAT) },
      "%e" => -> { cat "%#{fmt.width_str}s" % src.normalized_extension },
      "%i" => -> { cat "%#{fmt.width_str}s" % src.project_id },
      "%I" => -> { cat "%#{fmt.width_str}s" % src.export_id },
      "%n" => -> { cat "%#{fmt.width_str}s" % src.project_name },
      "%s" => -> { cat "%#{fmt.width_str}s" % src.project_slug },
      "%t" => -> { cat "%#{fmt.width_str}s" % src.export_created_at.strftime(TIME_FORMAT) },
      "%u" => -> { cat "%#{fmt.width_str}d" % src.unix_timestamp }
    )

    # @see ExportStrategies::Operations::FormatTargetName
    # @param [String] format
    def call(format, &block)
      format_pipeline.with_step_args(apply_format: [{ format: format }]).call(self, &block)
    end

    # @api private
    # @param [String] format
    # @return [Dry::Monads::Result::Success(String)]
    # @return [Dry::Monads::Result::Failure((:invalid_format, String))]
    def apply_format(format)
      Success format_with format
    rescue RuntimeError => e
      Failure [:invalid_format, e.message]
    end

    # @!attribute [r] normalized_extension
    # @return [String]
    memoize def normalized_extension
      export_asset_extension.to_s.sub(NO_LEADING_DOT, '.\1')
    end

    # @!attribute [r] unix_timestamp
    # @return [Integer]
    memoize def unix_timestamp
      export_created_at.to_i
    end
  end
end
