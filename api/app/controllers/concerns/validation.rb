module Validation
  extend ActiveSupport::Concern

  def favorite_params
    params.require(:data).require(:relationships).require(:favoritable).require(:data)
    param_config = build_params_structure(relationships: [ favoritable: favoritable_params])
    params.permit(param_config)
  end

  def favoritable_params
    build_params_structure()
  end

  def polymorphic_relationship_from(valid_params, entity)
    {
      "#{entity}_type" => entity_to_class(valid_params["data"]["relationships"][entity]["data"]["type"]),
      "#{entity}_id" => valid_params["data"]["relationships"][entity]["data"]["id"],
    }
  end

  def attributes_from(valid_params)
    attr = valid_params["data"]["attributes"]
    attr[:id] = valid_params["data"]["id"] if
      valid_params["data"] && valid_params["data"]["id"]
    attr
  end

  private

  def class_to_entity(klass)
    klass.underscore.pluralize
  end

  def entity_to_class(entity)
    entity.camelize.singularize
  end

  def build_data_structure(attributes = nil)
    out  = [:type, :id]
    out << { attributes: attributes } unless attributes.nil?
    out
  end

  def build_relationships_structure(relationships = nil)
    built = []
    return built if relationships.nil?
    relationships.each do |relationship|
      relationship.each_pair do |relationship_name, relationship_hash|
        if relationship_hash.is_a?(Hash)
          arrayified = []
          relationship_hash.each_pair do |key, value|
            arrayified << { key => value }
          end
          built << { relationship_name => arrayified}
        else
          built << { relationship_name => relationship_hash}
        end
      end
    end
    built
  end

  def build_params_structure(attributes: nil, relationships: nil)
    data = [:type, :id]
    data << { attributes: attributes } unless attributes.nil?
    data << { relationships: relationships } unless relationships.nil?
    {
      data: data
    }
  end



end
