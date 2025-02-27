# frozen_string_literal: true

module AuthorizesJSONAPIRelationships
  extend ActiveSupport::Concern

  # Occasionally we need to authorize based on attributes in a relationship.
  #
  # This provides a standardized way to do so based on params constructed in {Validation}.
  #
  # @param [ActionController::Parameters, #dig] params
  # @param [Symbol] relationship_key
  # @param [Class<ApplicationRecord>] model_klass
  # @param [Symbol] action
  # @return [void]
  def authorize_jsonapi_relationship_in!(params, model_klass, action: :update, relationship_key: model_klass.model_name.i18n_key)
    id = params.dig(:data, :relationships, relationship_key, :data, :id)

    record = load_jsonapi_relationship_for model_klass, id

    # :nocov:
    return if record.blank?
    # :nocov:

    Authority.enforce action, record, authority_user
  end

  # @param [Class<ApplicationRecord>] model_klass
  # @param [String] id
  # @return [ApplicationRecord, nil]
  def load_jsonapi_relationship_for(model_klass, id)
    case id
    when model_klass then id
    when String then model_klass.find id
    end
  rescue ActiveRecord::RecordNotFound
    # intentionally left blank, we don't try to authorize non-existing records
    # and the failure should be caught elsewhere in the validation stack.
  end
end
