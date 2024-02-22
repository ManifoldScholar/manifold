# frozen_string_literal: true

module SettingSections
  # A module subclass that defines special writers for setting sections.
  #
  # @api private
  class Accessors < Module
    include Dry::Initializer[undefined: false].define -> do
      param :section, SettingSections::Types::Section
    end

    def initialize(...)
      super

      define_methods!
    end

    private

    # @return [void]
    def define_methods!
      define_writer!

      define_force_writer!
    end

    # @return [void]
    def define_writer!
      class_eval <<-RUBY, __FILE__, __LINE__ + 1
      def #{section}=(new_values)     # def general=(new_values)
        #{section}.merge!(new_values) #   general.merge!(new_values)
        #{section}_will_change!       #   general_will_change!
      end                             # end
      RUBY
    end

    # @deprecated Can't find any reference to this, but keeping for now.
    # @return [void]
    def define_force_writer!
      class_eval <<-RUBY, __FILE__, __LINE__ + 1
      def force_#{section}=(value)            # def force_general=(value)
        write_attribute(:#{section}, value)   #   write_attribute(:general, value)
      end                                     # end
      RUBY
    end
  end
end
