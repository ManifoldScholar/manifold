module CachedExternalSources
  module Operation
    extend ActiveSupport::Concern

    include Dry::Transaction::Operation

    # @param [CachedExternalSource] external_source
    # @return [Dry::Monads::Result::Success(CachedExternalSource)]
    # @return [Dry::Monads::Result::Failure(Symbol, String)]
    def persist!(external_source)
      if external_source.save
        Success(external_source)
      else
        invalid_external_source(external_source)
      end
    end

    # @param [CachedExternalSource] external_source
    # @return [Dry::Monads::Result::Failure(Symbol, String)]
    def invalid_content_type(external_source)
      Failure(
        [
          :invalid_content_type,
          "Could not find content type for #{external_source.url}"
        ]
      )
    end

    # @param [CachedExternalSource] external_source
    # @return [Dry::Monads::Result::Failure(Symbol, String)]
    def invalid_download(external_source)
      Failure(
        [
          :invalid_download,
          "Could not download #{external_source.url}"
        ]
      )
    end

    # @param [CachedExternalSource] external_source
    # @return [Dry::Monads::Result::Failure(Symbol, String)]
    def invalid_external_source(external_source)
      prefix = "External source for #{external_source.url.inspect} failed to save:"
      suffix = external_source.errors.full_messages.to_sentence

      Failure(
        [
          :validation_error,
          "#{prefix} #{suffix}"
        ]
      )
    end
  end
end
