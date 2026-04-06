# frozen_string_literal: true

class UserClassification < ClassyEnum::Base
  extend Dry::Core::ClassAttributes

  defines :unique, type: ::Users::Types::Bool

  unique false

  def cli?
    command_line?
  end

  def default_email
    "#{text.underscore}@manifold.app"
  end

  # @param [User] user
  # @return [void]
  def populate_values!(user)
    raise "Cannot populate a non-unique user classification" unless unique?

    user.email = default_email
    user.first_name = text
    user.last_name = "User"
    user.password = user.password_confirmation = SecureRandom.hex
  end

  def unique?
    self.class.unique
  end

  class << self
    def fetch(value)
      self[value].tap do |found|
        raise ArgumentError, "Unknown user classification: #{value}" unless found.present?
      end
    end
  end
end

class UserClassification::Default < UserClassification
end

class UserClassification::Anonymous < UserClassification
  unique true
end

class UserClassification::CommandLine < UserClassification
  unique true
end

class UserClassification::Deleted < UserClassification
  unique true
end

class UserClassification::Testing < UserClassification
  unique true
end
