class UserClassification < ClassyEnum::Base
  include ActiveSupport::Configurable

  config.unique = false

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
    config.unique.present?
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
  config.unique = true
end

class UserClassification::CommandLine < UserClassification
  config.unique = true
end

class UserClassification::Testing < UserClassification
  config.unique = true
end
