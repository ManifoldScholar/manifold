module ManifoldEnv
  module HasConfigurationDSL
    extend ActiveSupport::Concern

    included do
      extend ActiveModel::Callbacks
      extend Uber::InheritableAttr

      define_model_callbacks :configure, only: %i(before after)

      inheritable_attr :dsl_klass

      self.dsl_klass = create_dsl_klass

      delegate :dsl_klass, to: :class
    end

    def configure
      run_callbacks :configure do
        yield dsl_klass.new(self) if block_given?
      end

      return self
    end

    def manifold_settings
      Rails.application.config.manifold
    end
    class_methods do
      def dsl(&configuration_block)
        dsl_klass.class_eval(&configuration_block)
      end

      def configurable_property(name, declarative: true, &default_value)
        define_method name do
          instance_variable_get(:"@#{name}").presence || instance_eval(&default_value)
        end

        dsl_klass.declarative_setter name if declarative
      end

      def configurable_hash(name, declarative: true)
        class_eval <<-RUBY, __FILE__, __LINE__ + 1
          def #{name}
            @#{name}.presence
          end
        RUBY

        dsl_klass.declarative_hash name if declarative
      end

      protected

      def create_dsl_klass
        Class.new(DelegateClass(self)) do
          include ConfigurationDSLMethods
        end
      end
    end

    module ConfigurationDSLMethods
      extend ActiveSupport::Concern

      NO_ARG = Object.new.freeze

      def ivar_get(name)
        __getobj__.instance_variable_get(:"@#{name}")
      end

      def ivar_set(name, value)
        __getobj__.instance_variable_set(:"@#{name}", value)
      end

      class_methods do
        def declarative_setter(name)
          class_eval <<-RUBY, __FILE__, __LINE__ + 1
            def #{name}(new_value = NO_ARG)
              return __getobj__.#{name} if new_value.eql?(NO_ARG)

              ivar_set __method__, new_value
            end
          RUBY
        end

        def declarative_hash(name)
          class_eval <<-RUBY, __FILE__, __LINE__ + 1
            def #{name}(**new_pairs)
              yield new_pairs if block_given?

              ivar_set(:#{name}, new_pairs)
            end
          RUBY
        end

        def ivar_accessor(name)
          ivar_reader(name)
          ivar_writer(name)
        end

        def ivar_reader(name)
          class_eval <<-RUBY, __FILE__, __LINE__ + 1
            def #{name}
              ivar_get(:#{name})
            end
          RUBY
        end

        def ivar_writer(name)
          class_eval <<-RUBY, __FILE__, __LINE__ + 1
            def #{name}=(new_value)
              ivar_set(:#{name}, new_value)
            end
          RUBY
        end
      end
    end
  end
end
