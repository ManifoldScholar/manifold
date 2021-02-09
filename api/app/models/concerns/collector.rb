# In the {Collections} domain, a `Collector` is a model that can collect something.
# Currently, that is {ReadingGroup} and {User}.
module Collector
  extend ActiveSupport::Concern

  include HasCollectables

  included do
    delegate :collector_definition, to: :class
  end

  def collectable_scope_for(collectable)
    collectable_definition = collector_definition[collectable]

    raise TypeError, "cannot collect #{collectable.inspect}" unless collectable_definition

    public_send(collectable_definition.associations.entry.collection).by_collectable(collectable)
  end

  def collect_model!(collectable)
    collectable_scope_for(collectable).first_or_create!
  end

  def composed_collection
    reflected_collection_name = collector_definition.collection.model_name.singular

    public_send(reflected_collection_name)
  end

  def serialized_collection
    composed_collection.slice(:categories, :category_mappings)
  end

  module ClassMethods
    extend Memoist

    memoize def collector_definition
      Collections::Mapping[self]
    end

    memoize def composed_collection_klass
      collector_definition.collection.klass
    end
  end
end
