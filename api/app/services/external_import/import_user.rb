module ExternalImport
  class ImportUser < ActiveInteraction::Base
    string :email
    string :encrypted_password
    string :source_id
    string :nickname
    string :first_name
    string :last_name

    # @return [User]
    def execute
      User.where(email: email).first_or_create! do |user|
        user.assign_attributes(inputs.slice(:nickname, :first_name, :last_name))
        user.password_digest = encrypted_password

        user.imported_at = Time.current
        user.import_source_id = source_id
      end
    end
  end
end
