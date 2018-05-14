module Contacts
  class SendMessage < ActiveInteraction::Base
    string :full_name
    string :email
    string :message

    validates :full_name, :email, :message, presence: true
    validates :email, email_format: { message: "is not a valid email address" }

    def execute
      ContactMailer.contact_message(full_name, email, message).deliver
    end

  end
end
