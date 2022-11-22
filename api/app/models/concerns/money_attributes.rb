# Model concern that money calculations
module MoneyAttributes
  extend ActiveSupport::Concern

  included do
  end

  class_methods do
    # rubocop:disable Metrics/MethodLength
    def money_attributes(*args)
      args.each do |attribute|
        cents_attribute = "#{attribute}_in_cents"
        define_method attribute do
          send(cents_attribute).try("/", 100.0)
        end
        define_method "#{attribute}=" do |value|
          value.gsub!(/[^\d.]/, "") if value.is_a? String
          send("#{cents_attribute}=", value.try(:to_f).try("*", 100))
        end
        define_method "#{attribute}_money" do
          Money.locale_backend = :i18n
          I18n.locale = :en
          Money.new(send("#{attribute}_in_cents").to_f ||
                      0, send("#{attribute}_currency")).format
        end
      end
    end
    # rubocop:enable Metrics/MethodLength
  end
end
