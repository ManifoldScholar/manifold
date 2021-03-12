module Testing
  class CollectEverything < ActiveInteraction::Base
    object :collector

    def execute
      definition = Collections::Mapping[collector]

      definition.collectables.map do |cdef|
        collectable_klass = cdef.collectable.klass
        entry_klass = cdef.entry.klass
        associations = cdef.associations

        attrs_for = ->(collectable) do
          {
            associations.collector.singular => collector,
            associations.collectable.singular => collectable,
          }
        end

        counter = 0

        collectable_klass.find_each do |collectable|
          attrs = attrs_for[collectable]

          entry_klass.upsert! attrs          

          counter += 1
        end

        [associations.collectable.singular, counter]
      end.to_h
    end
  end
end
