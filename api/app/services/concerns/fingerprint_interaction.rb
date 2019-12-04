module Concerns
  # Defines an interaction that generates a fingerprint for a model.
  module FingerprintInteraction
    extend ActiveSupport::Concern

    include Concerns::MonadicInteraction
    include Fingerprints

    JSONISH = Dux[:to_json].freeze

    included do
      isolatable!

      haltable!

      object :digest, class: "Digest::SHA512", default: proc { Digest::SHA512.new }

      boolean :nested, default: false
      boolean :raw, default: false
    end

    # @return [Digest::SHA512] when nested or raw
    # @return [String] when not nested
    def execute
      add_details!

      return digest if raw || nested

      digest.hexdigest
    end

    private

    # @abstract
    # @return [void]
    def add_details!
      raise NotImplementedError, "Must implement #{self.class}#add_details!"
    end

    # @param [ClassyEnum::Base, String, #to_json]
    # @return [String, nil]
    def make_digestable(value)
      return unless value.present?

      case value
      when ClassyEnum::Base then value.to_s
      when String then value
      when JSONISH then value.to_json
      end
    end

    # @param [<ApplicationRecord>] models
    # @param [Symbol] as the key to provide to the interaction for the given model
    #   (can be derived per {Fingerprints#derive_fingerprint_interaction_key_for})
    # @param [Class] with the interaction to use (can be derived per {Fingerprints#derive_fingerprint_interaction_for})
    # @return [void]
    def calculate_fingerprints_for!(models, as: nil, with: nil)
      models.each do |model|
        calculate_fingerprint_for! model, as: as, with: with
      end
    end

    # @param [ApplicationRecord] model
    # @param [Symbol] as the key to provide to the interaction for the given model
    #   (can be derived per {Fingerprints#derive_fingerprint_interaction_key_for})
    # @param [Class] with the interaction to use (can be derived per {Fingerprints#derive_fingerprint_interaction_for})
    # @return [void]
    def calculate_fingerprint_for!(model, as: nil, with: nil)
      input_key = as.presence || derive_fingerprint_interaction_key_for(model)
      interaction = with.presence || derive_fingerprint_interaction_for(model)

      compose interaction, nested: true, digest: digest, input_key => model
    end

    # @param [Object] value (see #make_digestable)
    # @return [void]
    def update_digest!(value)
      digestable = make_digestable value

      return unless digestable.present?

      digest << digestable
    end

    # @param [Object] obj
    # @param [<Symbol>] method_names
    # @return [void]
    def update_digest_with!(obj, *method_names)
      method_names.flatten.each do |method_name|
        update_digest! obj.public_send method_name
      end
    end
  end
end
