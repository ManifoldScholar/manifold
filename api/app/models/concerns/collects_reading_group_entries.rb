# rubocop:disable Metrics/AbcSize
module CollectsReadingGroupEntries
  extend ActiveSupport::Concern

  module ClassMethods
    # @param [String] model_name
    # @param [Boolean] categorized
    # @return [void]
    def collects_reading_group_entry!(model_name, categorized: false)
      model = model_name.constantize

      raise TypeError, "Expected #{model_name} to be a ReadingGroupEntry" unless model < ReadingGroupEntry

      definition = Collections::Mapping[ReadingGroup][model]

      associations = definition.associations

      entries = associations.entries
      collectables = associations.collectables
      collectable = associations.collectable.singular

      has_many entries, -> { in_order }, inverse_of: collection_inverse_name, dependent: :destroy
      has_many collectables, through: entries

      return unless categorized

      uncategorized_entries = associations.uncategorized_entries
      uncategorized_collectables = associations.uncategorized_collectables

      has_many uncategorized_entries, -> { uncategorized.in_order }, class_name: model_name
      has_many uncategorized_collectables, through: uncategorized_entries, source: collectable
    end

    # The inverse association used within {.collects_reading_group_entry!}.
    #
    # @return [Symbol]
    def collection_inverse_name
      @collection_inverse_name ||= model_name.element.to_sym
    end

    def collection_grouping?
      self < CollectionGrouping
    end
  end
end
# rubocop:enable Metrics/AbcSize
