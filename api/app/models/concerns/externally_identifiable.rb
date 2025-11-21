# frozen_string_literal: true

module ExternallyIdentifiable
  extend ActiveSupport::Concern

  included do
    has_one :external_identifier_record, class_name: "ExternalIdentifier", as: :identifiable, dependent: :destroy
  end

  def external_identifier
    external_identifier_record&.identifier || nil
  end

  def external_identifier=(new_id)
    unless external_identifier
      build_external_identifier_record(identifier: new_id)
    else
      external_identifier_record.identifier = new_id
    end
    external_identifier_record.save
  end
end
