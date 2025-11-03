# frozen_string_literal: true

class OauthConfig < ApplicationConfig
  include Enumerable
  class << self
    private

    def coerced_providers
      lambda do |providers_hash|
        providers_hash.transform_values do |value|
          OauthProviderConfig.new(**value)
        end
      end
    end
  end

  attr_config(oauth: {})
  coerce_types oauth: coerced_providers

  def [](name)
    oauth[name]
  end

  def each
    return enum_for(__method__) unless block_given?

    oauth.values.each do |provider|
      yield provider
    end
  end

  def known_strategies
    # returns list of all strategies on providers
    oauth.values.map { |p| p.strategy_name.to_s if p.strategy_name.present? }.compact_blank
  end

  def enabled
    # returns enumerable list of enabled providers
    oauth.values.select(&:enabled?)
  end
end
