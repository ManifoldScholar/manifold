# frozen_string_literal: true

class Inquiry < ActiveRecord::Type::String
  def cast(value)
    value.to_s.inquiry
  end
end
