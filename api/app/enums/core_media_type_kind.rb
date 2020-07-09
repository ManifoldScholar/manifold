# The "Core Media Type" MIME groups as defined by the EPUBv3 spec.
#
# @see https://www.w3.org/publishing/epub3/epub-spec.html#sec-cmt-supported
# rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Style/Alias
class CoreMediaTypeKind < ClassyEnum::Base
  CSS = "text/css".freeze

  XHTML = "application/xhtml+xml".freeze

  MIME_TYPE = %r{\A(?<base_type>[^/]+)/(?<subtype>[^/]+)\z}.freeze

  config.mime_pattern = nil
  config.mime_types = []
  config.should_download = false

  delegate :mime_pattern, :mime_types, to: :class

  def core_media_type?
    !unknown?
  end

  def match?(content_type)
    return false unless content_type.present?

    matches_pattern?(content_type) || matches_types?(content_type)
  end

  alias_method :has_match?, :match?

  def should_download?
    config.should_download
  end

  private

  def matches_pattern?(content_type)
    config.mime_pattern =~ content_type if config.mime_pattern.present?
  end

  def matches_types?(content_type)
    content_type.in?(config.mime_types) if config.mime_types.present?
  end

  class << self
    # @param [String] content_type
    # @return [CoreMediaTypeKind]
    def match(content_type)
      detect do |enum|
        enum.match? content_type
      end || build(:unknown)
    end

    # @!attribute [r] mime_pattern
    # When called directly on {CoreMediaTypeKind}, it's a regex that
    # unifies all the known MIME types along with the MIME patterns.
    #
    # When called on a subclass, it either returns {.mime_pattern! the defined MIME pattern}
    # or a unioned version of {.mime_types}.
    # @return [Regexp]
    def mime_pattern
      if base_class == self
        @mime_pattern ||= calculate_global_mime_pattern.freeze
      elsif config.mime_pattern
        config.mime_pattern
      else
        @mime_pattern ||= Regexp.union(config.mime_types)
      end
    end

    # @!attribute [r] mime_types
    # All known core media MIME types.
    #
    # @note This excludes `video/*`, as according to the spec
    #   all are accepted and it depends on the reader whether
    #   the individual codec can be played.
    # @return [<String>]
    def mime_types
      if base_class == self
        @mime_types ||= reduce([]) do |sum, enum|
          sum | enum.config.mime_types
        end.freeze
      else
        config.mime_types
      end
    end

    private

    # @return [Regexp]
    def calculate_global_mime_pattern
      grouped_types = Hash.new do |h, k|
        h[k] = []
      end

      base_class.mime_types.each_with_object(grouped_types) do |mime_type, h|
        case mime_type
        when MIME_TYPE
          h[Regexp.last_match[:base_type]] << Regexp.last_match[:subtype]
        else
          # :nocov:
          raise "Could not match mime type: #{mime_type}"
          # :nocov:
        end
      end

      patterns = grouped_types.map do |type, subtypes|
        %r{\A#{type}/#{Regexp.union(subtypes)}\z}
      end

      base_class.each do |enum|
        pattern = enum.config.mime_pattern

        next unless pattern.is_a?(Regexp)

        patterns << pattern
      end

      Regexp.union(patterns)
    end

    # @param [Regexp] pattern
    # @return [void]
    def mime_pattern!(pattern)
      config.mime_pattern = Types.Instance(Regexp)[pattern]
    end

    # @param [<String>] types
    # @return [void]
    def mime_types!(*types)
      config.mime_types = config.mime_types | types.flatten.map(&:to_s)
    end

    def should_download!
      config.should_download = true
    end
  end
end
# rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Style/Alias

class CoreMediaTypeKind::Image < CoreMediaTypeKind
  mime_types! "image/gif", "image/jpeg", "image/png", "image/svg+xml"

  should_download!
end

class CoreMediaTypeKind::Audio < CoreMediaTypeKind
  mime_types! "audio/mpeg", "audio/mp4"
end

class CoreMediaTypeKind::Video < CoreMediaTypeKind
  mime_pattern! %r{\Avideo/\S+\z}
end

class CoreMediaTypeKind::Style < CoreMediaTypeKind
  mime_types! CSS

  should_download!
end

class CoreMediaTypeKind::Font < CoreMediaTypeKind
  mime_types! %w[
    font/ttf application/font-sfnt
    font/otf application/vnd.ms-opentype
    font/woff application/font-woff
    font/woff2
  ]
end

class CoreMediaTypeKind::Other < CoreMediaTypeKind
  mime_types! XHTML, %w[
    application/javascript
    text/javascript
    application/x-dtbncx+xml
    application/smil+xml
    application/pls+xml
  ]

  should_download!
end

class CoreMediaTypeKind::Unknown < CoreMediaTypeKind
  def match?(_content_type)
    false
  end
end
