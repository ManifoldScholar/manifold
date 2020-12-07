class UuidValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    record.errors.add(attribute, "must be formatted as a UUID") unless UUID.validate(value)
  end
end
