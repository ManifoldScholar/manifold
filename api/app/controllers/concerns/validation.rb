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
                  :instagram_id, :remove_avatar, attachment(:avatar), attachment(:hero),
                  :remove_hero, :publication_date, metadata]
    relationships = [:collaborators, :creators, :contributors, :published_text]
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

  def category_params
    params.require(:data)
    attributes = [:title, :role, :position]
    relationships = [:project]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def favorite_params
    params.require(:data).require(:relationships).require(:favoritable).require(:data)
    attributes = []
    relationships = [:favoritable]
    param_config = structure_params(attributes: attributes, relationships: relationships)
    params.permit(param_config)
  end

  def text_params
    params.require(:data)
    attributes = [:title, :position, :publication_date, metadata]
    relationships = [:category]
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

  def collection_filter_params
    params.permit(filter: [])
  end

  def resource_filter_params
    params.permit(filter: [])
  end

  def user_filter_params
    params.permit(filter: [])
  end

  def project_filter_params
    params.permit(filter: [:featured, :subject])
  end

  def maker_filter_params
    params.permit(filter: [:name])
  end

  def attributes_from(valid_params)
    attr = valid_params["data"]["attributes"]
    attr[:id] = valid_params["data"]["id"] if
      valid_params["data"] && valid_params["data"]["id"]
    attr
  end

  private

  def metadata
    { metadata: [
      :isbn, :publisher, :place_of_publication, :doi, :series, :pages,
      :date_of_publication
    ] }
  end

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
