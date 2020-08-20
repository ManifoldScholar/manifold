require "dynamic_mailer/configuration"

module DynamicMailer
  class Mailer
    def initialize(_values)
      @config = DynamicMailer::Configuration.new(Settings.instance)
    end

    def deliver!(mail)
      add_defaults!(mail)
      return deliver_test!(mail) if Rails.env.test?
      return deliver_smtp!(mail) if @config.use_smtp?
      return deliver_sendmail!(mail) if @config.use_sendmail?

      handle_send_failure(mail)
    rescue StandardError => e
      handle_exception(e)
    end

    private

    # rubocop:disable Metrics/MethodLength
    def handle_exception(e)
      msg =
        case e.class.name
        when "Net::SMTPAuthenticationError"
          "Manifold wasn't able to authenticate against the SMTP server using the stored credentials."
        when "Net::SMTPServerBusy"
          "The SMTP server appears to be busy. Is it available?"
        when "Net::SMTPSyntaxError"
          "Manifold received a Net::SMTPSyntaxError while trying to send your message. Double check your SMTP configuration"
        when "Net::SMTPFatalError", "Net::SMTPUnknownError"
          "Manifold ran into a fatal SMTP error. Double check your configuration."
        else
          "Manifold was unable to send the email. The exception was of the type
           \"#{e.class.name}.\" The message was \"#{e.message}.\" Double check your
          configuration."
        end
      raise APIExceptions::StandardError, msg
    end
    # rubocop:enable Metrics/MethodLength

    def add_defaults!(mail)
      mail.from = @config.from unless mail.from
      mail.reply_to = @config.reply_to unless mail.reply_to
    end

    def handle_send_failure(mail)
      # TODO: How to handle this?
    end

    def deliver_test!(mail)
      mailer = Mail::TestMailer.new(@config.test_config)
      mailer.deliver!(mail)
    end

    def deliver_smtp!(mail)
      mailer = Mail::SMTP.new(@config.smtp_config)
      mailer.deliver!(mail)
    end

    def deliver_sendmail!(mail)
      mailer = Mail::Sendmail.new(@config.sendmail_config)
      mailer.deliver!(mail)
    end

  end
end
