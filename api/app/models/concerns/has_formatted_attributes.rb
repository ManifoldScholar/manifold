module HasFormattedAttributes
  extend ActiveSupport::Concern

  included do
    self.formatted_attributes = FormattedAttributes::Configuration.new model: self

    formatted_attributes.add_cache_type_attribute!

    delegate :formatted_attributes, to: :class

    before_save :recalculate_formatted_attributes_cache!, if: :should_recalculate_formatted_attributes_cache?
  end

  # @param [String, Symbol] needle
  # @return [FormattedAttributes::FormattedAttributeType]
  def formatted_attribute(needle)
    fa_cache.fetch(needle)
  end

  # @return [void]
  def recalculate_formatted_attributes_cache!
    fa_cache.refresh_all!
  end

  # @return [void]
  def refresh_formatted_attributes_cache!
    recalculate_formatted_attributes_cache!

    maybe_save_formatted_attributes_cache!
  end

  # @return [void]
  def maybe_save_formatted_attributes_cache!
    update_column :fa_cache, fa_cache.as_json if fa_cache_changed?
  end

  def should_recalculate_formatted_attributes_cache?
    formatted_attributes.should_recalculate? self
  end

  module ClassMethods
    # rubocop:disable Naming/PredicateName

    # @!scope class
    # @return [FormattedAttributes::Configuration]
    attr_accessor :formatted_attributes

    # @param [<Symbol>] attributes
    # @param [Hash] shared_options
    # @see [.has_formatted_attribute]
    # @return [void]
    def has_formatted_attributes(*attributes, **shared_options)
      attributes.flatten.each do |attribute|
        has_formatted_attribute attribute, **shared_options
      end
    end

    def has_formatted_attributes?
      formatted_attributes.present?
    end

    # @param [Symbol] attribute
    # @param [Hash] options
    # @return [void]
    def has_formatted_attribute(attribute, **options)
      formatted_attributes.define! attribute, options
    end

    def inherited(subclass)
      super if defined? super

      subclass.formatted_attributes = formatted_attributes.clone_for subclass

      subclass.formatted_attributes.add_cache_type_attribute!
    end

    # @return [void]
    def refresh_all_formatted_attribute_caches!(synchronous: false)
      find_each do |model|
        if synchronous
          model.refresh_formatted_attributes_cache!
        else
          FormattedAttributes::RefreshCacheJob.perform_later model
        end
      end
    end

    # rubocop:enable Naming/PredicateName
  end
end
