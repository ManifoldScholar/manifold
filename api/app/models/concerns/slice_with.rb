# Adds a `slice_with` method that allows keys to be remapped.
module SliceWith
  extend ActiveSupport::Concern

  # Works a lot like `ApplicationRecord#slice`, but allows keys to be remapped.
  #
  # @param [<#to_sym>] attributes
  # @param [{ Symbol => Symbol }]
  # @return [{ Symbol => Object }]
  def slice_with(*attributes, **pairs)
    attributes = Types::METHOD_NAMES[attributes]

    mapping = Types::SYMBOL_MAP[pairs].reverse_merge(attributes.zip(attributes).to_h)

    mapping.transform_values do |source|
      public_send(source)
    end
  end
end
