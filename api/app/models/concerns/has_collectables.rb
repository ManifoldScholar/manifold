# rubocop:disable Naming/PredicateName
module HasCollectables
  extend ActiveSupport::Concern

  module ClassMethods
    extend Memoist

    # @return [void]
    def has_many_collectables!
      collector_definition.collectables.each do |collectable|
        associations = collectable.associations

        entries = associations.entries
        collectables = associations.collectables

        has_many entries, -> { in_order }, inverse_of: has_collectables_inverse_name, dependent: :destroy
        has_many collectables, through: entries
      end
    end

    memoize def has_collectables_inverse_name
      model_name.element.to_sym
    end
  end
end
# rubocop:enable Naming/PredicateName
