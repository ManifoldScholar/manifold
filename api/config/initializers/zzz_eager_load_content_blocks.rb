# frozen_string_literal: true

if Rails.env.development?
  Rails.application.configure do
    config.after_initialize do
      require Rails.root.join("app/models/content_block.rb")

      Rails.root.glob("app/models/**/*.rb").each do |content_block_model|
        require_relative content_block_model
      end
    rescue ActiveRecord::ActiveRecordError
      # purposely left blank
    end
  end
end
