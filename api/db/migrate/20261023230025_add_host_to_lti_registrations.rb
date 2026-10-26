# frozen_string_literal: true

class AddHostToLtiRegistrations < ActiveRecord::Migration[7.2]
  def change
    add_column :lti_registrations, :host, :text

    issuers = LtiRegistration.connection.select_all("SELECT id, issuer FROM lti_registrations").to_a.each do |row|
      row["host"] = URI.parse(row["issuer"]).host
    end

    issuers.each do |issuer|
      execute <<~SQL
      UPDATE lti_registrations
      SET host = '#{issuer["host"]}'
      WHERE id = '#{issuer["id"]}'
      SQL
    end

    change_column_null :lti_registrations, :host, false
  end
end
