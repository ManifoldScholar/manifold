# Includes strong parameter configuration
module Validation
  extend ActiveSupport::Concern

  def user_params
    params.require(:data)
    attributes = [:first_name, :last_name, :nickname, :name, :email, :password,
                  :password_confirmation, :remove_avatar, attachment(:avatar)]
    param_config = structure_params(attributes: attributes)
    params.permit(param_config)
  end

  def project_params
    params.require(:data)
    attributes = [:title, :subtitle, :featured, :hashtag, :description, :purchase_url,
                  :purchase_price_money, :purchase_price_currency, :twitter_id,
                  :instagram_id]
    relationships = [:collaborators, :creators, :contributors]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def collaborator_params
    params.require(:data)
    attributes = [:role]
    relationships = [:maker, :collaboratable]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def annotation_params
    params.require(:data)
    attributes = [:start_node, :end_node, :start_char, :end_char, :section_id, :format,
                  :subject]
    param_config = structure_params(attributes: attributes)
    params.permit(param_config)
  end

  def favorite_params
    params.require(:data).require(:relationships).require(:favoritable).require(:data)
    attributes = []
    relationships = [:favoritable]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def maker_params
    attributes = [:first_name, :last_name]
    param_config = structure_params(attributes: attributes)
    params.permit(param_config)
  end

  def favoritable_params
    structure_params
  end

  def attributes_from(valid_params)
    attr = valid_params["data"]["attributes"]
    attr[:id] = valid_params["data"]["id"] if
      valid_params["data"] && valid_params["data"]["id"]
    attr
  end

  private

  def attachment(name)
    { name => [:data, :filename, :content_type] }
  end

  def structure_params(attributes: nil, relationships: nil)
    data = [:type, :id]
    data << { attributes: attributes } unless attributes.nil?
    unless relationships.nil?
      relationships_config = {}
      relationships.each do |relationship|
        relationships_config[relationship] = { data: [:type, :id] }
      end
      data << { relationships: relationships_config }
    end
    {
      data: data
    }
  end
end
