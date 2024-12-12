# frozen_string_literal: true

module Users
  module Types
    include Dry.Types

    User = Instance(::User)
  end
end
