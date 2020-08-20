module HasModdableKlasses
  extend ActiveSupport::Concern

  class_methods do
    def moddable_klass!(reference_name, parent_klass)
      extend HasModdableKlasses::ModdableKlass.new(reference_name,
                                                   parent_klass)
    end
  end

  class ModdableKlass < Module
    def initialize(reference_name, parent_klass)
      @reference_name = reference_name
      @parent_klass   = parent_klass

      @ivar = :"@#{reference_name}"

      @const_name = :":#{@reference_name.to_s.camelize}"

      @instance_mod = Module.new

      @instance_mod.class_eval <<~RUBY, __FILE__, __LINE__ + 1
          def #{@reference_name}_klass
            self.class.#{@reference_name}
          end
      RUBY
      class_eval <<~RUBY, __FILE__, __LINE__ + 1
          def #{@reference_name}
            return nil if abstract?

            #{@ivar}.tap do |klass|
              klass.class_eval(&Proc.new) if block_given?
            end
          end

        def define_moddable_klasses!
          super if defined?(super)

          unless const_defined?(#{@const_name})
            #{@ivar} = Class.new(#{@parent_klass})

            const_set #{@const_name}, #{@ivar}
          end
        end
      RUBY
    end

    def extended(base)
      base.include(@instance_mod)
    end
  end
end
