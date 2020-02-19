class SerializerRegistry

  include Enumerable
  attr_reader :klass, :entries, :full, :active

  def initialize(klass, full: false)
    @klass = klass
    @full = full
    @entries = {}
    @active = false
  end

  def each(&block)
    entries.each(&block)
  end

  # rubocop:disable Lint/UnusedMethodArgument
  def typed_has_one(relationship_name, options = {}, &block)
    activate
    options = map_relationship_options(options)
    register_relationship(relationship_name, :has_one, options)
    klass.class_eval <<-RUBY, __FILE__, __LINE__ + 1
            has_one(relationship_name, options, &block)
    RUBY
  end
  # rubocop:enable Lint/UnusedMethodArgument

  # rubocop:disable Lint/UnusedMethodArgument
  def typed_belongs_to(relationship_name, options = {}, &block)
    activate
    options = map_relationship_options(options)
    register_relationship(relationship_name, :belongs_to, options)
    klass.class_eval <<-RUBY, __FILE__, __LINE__ + 1
            belongs_to(relationship_name, options, &block)
    RUBY
  end
  # rubocop:enable Lint/UnusedMethodArgument

  # rubocop:disable Lint/UnusedMethodArgument
  def typed_has_many(relationship_name, options = {}, &block)
    activate
    options = map_relationship_options(options)
    register_relationship(relationship_name, :has_many, options)
    klass.class_eval <<-RUBY, __FILE__, __LINE__ + 1
            has_many(relationship_name, options, &block)
    RUBY
  end
  # rubocop:enable Lint/UnusedMethodArgument

  def typed_attribute(attribute, type, options = {}, &block)
    activate
    options = map_options(options)
    register_attributes(attribute, type, options)
    _block = type == Hash ? build_camelize_proc(attribute, block) : block
    klass.class_eval <<-RUBY, __FILE__, __LINE__ + 1
      attributes(attribute, options, &_block)
    RUBY
  end

  # TODO: Change the type to a the dry types hash class.
  def abilities
    typed_attribute :abilities, Hash do |object, params|
      klass.calculate_abilities(object, params)
    end
  end

  # TODO: Change the type to a the dry types boolean class. Ruby doesn't have a native
  # Boolean type, so the NilClass is a placeholder here.
  def current_user_is_creator?
    typed_attribute :current_user_is_creator, NilClass do |object, params|
      klass.calculate_current_user_is_creator?(object, params)
    end
  end

  # rubocop:disable Naming/PredicateName
  def has_one_creator
    typed_has_one :creator, serializer: ::V1::UserSerializer, record_type: :user
  end
  # rubocop:enable Naming/PredicateName

  def metadata(metadata: true, formatted: true, properties: true)
    typed_attribute(:metadata, Hash) if metadata
    typed_attribute(:metadata_formatted, Hash) if formatted
    typed_attribute(:metadata_properties, Array, &:camelized_metadata_properties) if properties
  end

  def activated?
    @active
  end

  private

  def build_camelize_proc(attribute, block = nil)
    proc { |object, params|
      value = if block
                block.arity.abs == 1 ? block.call(object) : block.call(object, params)
              else
                object.public_send(attribute)
              end
      next nil if value.nil?

      unless value.respond_to? :keys
        raise "The typed attribute :#{attribute} on #{self.class} is not a hash.
              Consider changing the type to #{value.class}"
      end
      klass.camelize_hash(value)
    }
  end

  def full?
    full
  end

  def map_options(options)
    options[:full] = true if full?
    klass.map_options(options)
  end

  def map_relationship_options(options)
    map_options(options)
    klass.map_relationship_options(options)
  end

  def register_relationship(relationship_name, type, options)
    entries["relationship_#{relationship_name}"] = {
      key: relationship_name,
      type: type,
      relationship: true,
      serializer: options[:serializer]
    }
  end

  def register_attributes(attribute, type, _options)
    entries["attribute_#{attribute}"] = {
      key: attribute,
      relationship: false,
      type: type
    }
  end

  def activate
    @active = true
  end

  def page_params(relationship_name, params)
    return nil unless params[:pagination].present?

    pagination = params[:pagination]

    per = pagination.dig(relationship_name, :size)
    page = pagination.dig(relationship_name, :number) || 1
    [page, per]
  end

end
