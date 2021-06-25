# Defines an interaction that generates a fingerprint for a model.
module FingerprintInteraction
  extend ActiveSupport::Concern

  include MonadicInteraction
  include Fingerprints

  DEFAULT_DIGEST = proc do
    Digest::SHA512.new.tap do |digest|
      digest << Settings.manifold_version.to_s
    end
  end

  JSONISH = Dux[:to_json].freeze

  included do
    isolatable!

    haltable!

    object :digest, class: "Digest::SHA512", default: DEFAULT_DIGEST

    boolean :nested, default: false
    boolean :raw, default: false
  end

  # @return [Digest::SHA512] when nested or raw
  # @return [String] when not nested
  def execute
    add_details!

    maybe_update_fingerprint!

    return digest if raw || nested

    digest.hexdigest
  end

  # @abstract
  # @see .fingerprint_target!
  # @return [ApplicationRecord]
  attr_reader :fingerprint_target

  private

  # @abstract
  # @return [void]
  def add_details!
    # :nocov:
    raise NotImplementedError, "Must implement #{self.class}#add_details!"
    # :nocov:
  end

  # @return [void]
  def maybe_update_fingerprint!
    return unless fingerprint_target.is_a? StoresFingerprints

    fingerprint_target.maybe_update_fingerprint! digest
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
    models.reload if models.respond_to?(:reload) && models.none?(&:changed_for_autosave?)

    models.each do |model|
      model.reload unless models.respond_to?(:reload) || model.changed_for_autosave?

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
    rescue Errno::ENOENT
      Rails.logger.error("File not found error while fingerprinting #{method_name} on #{obj}")
    end
  end

  # rubocop:disable Layout/LineLength
  class_methods do
    # @return [Symbol, nil]
    attr_reader :fingerprint_target

    # Set up a fingerprint target for the interaction on the associated key.
    #
    # @param [Symbol] input_key
    # @return [void]
    def fingerprint_target!(input_key, **options)
      raise "Cannot set fingerprint_target to #{input_key.inspect}, already set #{@fingerprint_target.inspect}" if @fingerprint_target.present?

      @fingerprint_target = input_key.to_sym

      record @fingerprint_target, **options

      alias_method :fingerprint_target, @fingerprint_target
    end
  end
  # rubocop:enable Layout/LineLength
end
