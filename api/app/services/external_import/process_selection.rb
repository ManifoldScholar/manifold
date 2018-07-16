module ExternalImport
  class ProcessSelection < ActiveInteraction::Base
    string :source_text_id
    string :text_id

    string :previous_text, default: nil
    string :previous_body, default: nil

    string :body

    string :next_text, default: nil
    string :next_body, default: nil

    array :comments, default: proc { [] } do
      hash strip: false
    end

    array :highlights, default: proc { [] } do
      hash strip: false
    end

    def execute
      attributes = inputs.without(:comments, :highlights)

      ImportSelection.where(attributes).first_or_create! do |is|
        is.comments   = comments
        is.highlights = highlights
      end
    end
  end
end
