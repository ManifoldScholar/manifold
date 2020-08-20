# Defines a sliceable PORO object
module Sliceable
  extend ActiveSupport::Concern

  include SliceWith

  # @param [<Symbol>] method_names
  # @return [{ Symbol => Object }]
  def slice(*method_names)
    Types::METHOD_NAMES[method_names].each_with_object({}) do |method_name, h|
      h[method_name] = public_send(method_name)
    end
  end

  # @param [<Symbol>] method_names
  # @return [<Object>]
  def values_at(*method_names)
    Types::METHOD_NAMES[method_names].map do |method_name|
      public_send(method_name)
    end
  end
end
