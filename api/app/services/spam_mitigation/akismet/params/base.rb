# frozen_string_literal: true

module SpamMitigation
  module Akismet
    module Params
      # @abstract
      class Base < Types::FlexibleStruct
        extend ActiveModel::Callbacks
        extend Dry::Core::ClassAttributes

        attribute? :config, SpamMitigation::Akismet::Config.default { SpamMitigation::Akismet::Config.new }

        defines :sliced_attributes, type: Types::Array.of(Types::Symbol)
        defines :sends_blog, type: Types::Bool
        defines :sends_api_key, type: Types::Bool

        delegate :api_key, :blog, to: :config

        define_model_callbacks :build

        sends_api_key true
        sends_blog false
        sliced_attributes [].freeze

        before_build :add_api_key!, if: :sends_api_key?
        before_build :add_blog!, if: :sends_blog?

        def initialize(...)
          super

          @body = {}.with_indifferent_access
        end

        def sends_api_key?
          self.class.sends_api_key
        end

        def sends_blog?
          self.class.sends_blog
        end

        # @return [ActiveSupport::HashWithIndifferentAccess]
        def to_body
          @body = {}.with_indifferent_access

          run_callbacks :build do
            @body.merge!(sliced_attributes)
          end

          return @body
        ensure
          @body = {}.with_indifferent_access
        end

        private

        # @return [void]
        def add_api_key!
          @body[:api_key] = api_key
        end

        # @return [void]
        def add_blog!
          @body[:blog] = blog
        end

        def sliced_attributes
          slice(*self.class.sliced_attributes)
        end

        class << self
          # @return [void]
          def accepts_user!
            include AcceptsUser
          end

          # @return [void]
          def sends_blog!
            sends_blog true
          end

          # @param [Symbol] name
          # @param [Dry::Types::Type] type
          # @return [void]
          def sliced_attribute(name, type)
            attribute(name, type)

            slice_attribute!(name)
          end

          # @param [Symbol] name
          # @param [Dry::Types::Type] type
          # @return [void]
          def sliced_attribute?(name, type)
            attribute?(name, type)

            slice_attribute!(name)
          end

          private

          # @param [Symbol] name
          # @return [void]
          def slice_attribute!(name)
            current = sliced_attributes

            sliced_attributes (current | [name.to_sym]).freeze
          end
        end
      end
    end
  end
end
