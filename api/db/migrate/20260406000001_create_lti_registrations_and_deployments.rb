# frozen_string_literal: true

class CreateLtiRegistrationsAndDeployments < ActiveRecord::Migration[7.0]
  def change
    create_enum :lti_token_endpoint_auth_method, %w[
      private_key_jwt
      client_secret_post
    ]

    create_enum :lti_grant_type, %w[
      implicit
      client_credentials
    ]

    create_enum :lti_scope, %w[
      nrps_membership_readonly
      ags_lineitem
      ags_lineitem_readonly
      ags_result_readonly
      ags_score
    ]

    create_table :lti_registrations, id: :uuid do |t|
      t.text :name, null: false
      t.text :issuer, null: false
      t.text :client_id, null: false
      t.text :authorization_endpoint, null: false
      t.text :token_endpoint, null: false
      t.text :jwks_uri, null: false
      t.enum :token_endpoint_auth_method, enum_type: :lti_token_endpoint_auth_method, null: false, default: "private_key_jwt"
      t.column :grant_types, :lti_grant_type, array: true, null: false, default: []
      t.column :scopes, :lti_scope, array: true, null: false, default: []
      t.text :registration_access_token
      t.boolean :enabled, null: false, default: true

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index [:issuer, :client_id], unique: true
    end

    create_table :lti_deployments, id: :uuid do |t|
      t.references :lti_registration, type: :uuid, null: false, foreign_key: true
      t.text :deployment_id, null: false
      t.boolean :enabled, null: false, default: true

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index [:lti_registration_id, :deployment_id], unique: true, name: "index_lti_deployments_on_registration_and_deployment"
    end
  end
end
