module Collections
  class Definition
    extend Dry::Initializer
    extend Memoist

    include Dry::Equalizer.new(:collector)
    include MultiKeyable

    Type = Types.Instance(self)

    multi_keyable :collector, :collectable_entries

    param :collector, Types::ModelProxy

    option :collects, Types::ModelProxies, as: :collectable_models, default: proc { [] }

    option :grouping, Types::ModelProxy.optional, optional: true, default: proc { nil }

    option :entry_prefix, Types::String, default: proc { collector.model_name.name }

    option :collection_prefix, Types::String, default: proc { collector.model_name.name }

    option :collection, Types::ModelProxy, default: proc { "#{collection_prefix}Collection" }

    option :collector_foreign_key, Types::Symbol, default: proc { :"#{collector.model_name.singular}_id" }

    option :reorderable, Types::Bool, default: proc { false }

    delegate :[], to: :collectables
    delegate :name, to: :grouping, prefix: true, allow_nil: true

    alias reorderable? reorderable

    # @!attribute [r] collectables
    # @return [<Collections::CollectableDefinition>]
    attr_reader :collectables

    # @!attribute [r] collectable_entries
    # @return [<#to_s>]
    attr_reader :collectable_entries

    def initialize(*)
      super

      @collectables = collectable_models.map do |collectable|
        CollectableDefinition.new collectable, parent: self
      end.reduce(&:to_multi_keyable_map)

      @collectable_entries = @collectables.map(&:entry)
    end

    def has_grouping?
      grouping.present?
    end

    memoize def lookup
      Collections::Operations::CollectorLookups.new(self)
    end
  end
end
