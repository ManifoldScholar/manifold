# Includes serializer authorization
module SerializedMetadata
  extend ActiveSupport::Concern

  def metadata_properties
    object.metadata_properties.map { |p| p.camelize(:lower) }
  end
end
