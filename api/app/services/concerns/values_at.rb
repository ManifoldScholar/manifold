module ValuesAt
  extend ActiveSupport::Concern

  def values_at(*method_names)
    Types::METHOD_NAMES[method_names].map do |method_name|
      public_send method_name
    end
  end
end
