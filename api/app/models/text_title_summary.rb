# frozen_string_literal: true

class TextTitleSummary < ApplicationRecord
  include View

  self.primary_key = :text_id
end
