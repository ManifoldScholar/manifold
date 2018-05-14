class ContactMailer < ApplicationMailer
  def contact_message(full_name, email, message)
    installation_contact = @settings.general[:contact_email]
    return unless installation_contact.present?

    @full_name = full_name
    @email = email
    @message = message

    subject = "#{full_name} has a question about #{@installation_name}."
    mail(to: installation_contact, subject: subject)
  end
end
