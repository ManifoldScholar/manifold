class ReferencedPathStrategy < ClassyEnum::Base
  include ActiveSupport::Configurable
  include Dry::Monads::Result::Mixin

  EXTERNAL_LINK = %r{\Ahttps?://}i.freeze
  INGESTION_SOURCE_PROXY = %r{\A
  /api/proxy/ingestion_sources
  /(?<ingestion_source_id>[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})
  }xmsi.freeze
  LEGACY_INGESTION_SOURCE_PATH = %r{\A
  /system/(?<attachment_id>ingestion\S+)
  }xmsi.freeze
  SECTION_READ_LINK = %r{\A
  /read
  /(?<text_id>[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})
  /section
  /(?<text_section_id>[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})
  }xmsi.freeze

  def known?
    !unknown?
  end

  def pattern
    config.pattern
  end

  def try_to_match(path)
    return nil unless known?
    return nil unless pattern =~ path

    match_data = Regexp.last_match.names.zip(Regexp.last_match.captures).to_h.with_indifferent_access

    Success([to_sym, match_data])
  end

  class << self
    include Dry::Matcher.for(:find_for, with: Dry::Matcher::ResultMatcher)

    # @param [String] path
    # @return [Dry::Monads::Result(Symbol, ActiveSupport::HashWithIndifferentAccess)]
    def find_for(path)
      catch :found do
        each do |enum|
          found = enum.try_to_match(path)

          throw :found, found unless found.nil?
        end

        Dry::Monads.Failure([:unknown, {}.with_indifferent_access])
      end
    end
  end
end

class ReferencedPathStrategy::External < ReferencedPathStrategy
  config.pattern = EXTERNAL_LINK
end

class ReferencedPathStrategy::IngestionSource < ReferencedPathStrategy
  config.pattern = INGESTION_SOURCE_PROXY
end

class ReferencedPathStrategy::LegacyIngestionSource < ReferencedPathStrategy
  config.pattern = LEGACY_INGESTION_SOURCE_PATH
end

class ReferencedPathStrategy::TextSectionLink < ReferencedPathStrategy
  config.pattern = SECTION_READ_LINK
end

class ReferencedPathStrategy::Unknown < ReferencedPathStrategy
end
