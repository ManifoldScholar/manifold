module ExternalAuth
  class UpsertUser < ActiveInteraction::Base
    include AuthAction

    object :identity

    # @!attribute [r] mode
    # Whether we are attaching to an existing,
    # user, creating a new user, or just returning
    # a found user.
    # @return [:attach, :create, :ignore]
    attr_reader :mode

    attr_reader :user

    # @return [User]
    def execute
      setup!

      return user if mode == :ignore

      attach_identity!

      save_user!
    end

    private

    def setup!
      @provisioner = ExternalAuth::Provisioners::User.new(
        inputs.slice(:provider, :auth_hash)
      )
      @user = identity.user || find_or_initialize_user
      @mode = detect_mode
    end

    # @return [:attach, :create, :ignore]
    def detect_mode
      if identity.new_record? && user.persisted?
        :attach
      elsif user.new_record?
        :create
      else
        :ignore
      end
    end

    def find_or_initialize_user
      User.where(email: auth_info.email).first_or_initialize do |user|
        @provisioner.call(user)
      end
    end

    def attach_identity!
      user.identities << identity
    end

    # @return [User]
    def save_user!
      return user if user.save

      user.errors.full_messages.each do |message|
        errors.add :base, message
      end
    end
  end
end
