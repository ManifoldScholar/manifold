# frozen_string_literal: true

class TextSectionStylesheet < ApplicationRecord
  belongs_to :text_section
  belongs_to :stylesheet
end
