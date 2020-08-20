class Inquiry < ActiveRecord::Type::String
  def cast(value)
    value.to_s.inquiry
  end
end
