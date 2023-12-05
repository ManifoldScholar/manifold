# rubocop:disable Naming/MethodName
module Types
  include Dry.Types

  # @api private
  MANIFOLD_CONFIG = Rails.configuration.manifold

  private_constant :MANIFOLD_CONFIG

  ATTACHMENT_TYPE = Types::Coercible::Symbol.enum(*MANIFOLD_CONFIG.attachments.validations.keys.map(&:to_sym))

  # Matches a simple attribute name, like `foo` or `bar_baz`. Does not allow numerals
  # or consecutive / initial / terminal underscores per good sense and Ruby idioms.
  ATTRIBUTE_NAME_FORMAT = /
  \A
  [a-z]
  (?:[a-z]|_(?!_))+
  [a-z]
  \z
  /xms.freeze

  # @see ATTRIBUTE_NAME_FORMAT
  ATTRIBUTE_NAME = Types::Coercible::Symbol.constrained(format: ATTRIBUTE_NAME_FORMAT)

  CALLABLE = Types.Interface(:call)

  ENUM_OF_TYPE = ->(klass) { Types.Constructor(klass) { |v| klass.build(v) } }

  HTTP_METHOD = Types::Coercible::Symbol.enum(:get, :head, :post, :put, :delete)

  METHOD_NAMES = Types::Coercible::Array.of(Types::Coercible::Symbol)

  MONADIC_RESULT = Instance(Dry::Monads::Result).constructor do |v|
    case v
    when Dry::Monads::Result then v
    when StandardError then Dry::Monads.Failure(v)
    else
      Dry::Monads.Success(v)
    end
  end

  NOKOGIRI_DOCUMENT = Types.Instance(Nokogiri::XML::Document)
  NOKOGIRI_FRAGMENT = Types.Instance(Nokogiri::XML::DocumentFragment)
  NOKOGIRI_NODE = Types.Instance(Nokogiri::XML::Node)

  URI = Types.Constructor(Types.Instance(Addressable::URI)) do |value|
    case value
    when Addressable::URI then value
    when String
      Addressable::URI.parse value
    else
      Dry::Types::Undefined
    end
  rescue Addressable::URI::InvalidURIError, TypeError
    Dry::Types::Undefined
  end

  RULE_PREDICATE = ->(predicate_name, *curried_args) do
    predicate = Dry::Logic::Predicates[predicate_name]

    rule = Dry::Logic::Rule::Predicate.new(predicate)

    curried_args.present? ? rule.curry(*curried_args) : rule
  end

  RULE_INCLUSION = ->(*list) do
    RULE_PREDICATE.call(:included_in?, list)
  end

  RULE_TYPE = ->(type) do
    RULE_PREDICATE.call(:type?, type)
  end

  HTTP_SCHEME = RULE_TYPE.call(Addressable::URI) & Dry::Logic::Operations::Attr.new(RULE_INCLUSION.("http", "https"), name: :scheme)

  HTTP_URI = URI.constrained_type.new(URI, rule: HTTP_SCHEME)

  SAFE_BOOL = Params::Bool.fallback { false }

  SHA512_HEX = Types::String.constrained(format: /\A[a-z0-9]{128}\z/)

  SHA512_DIGEST = Types.Instance(Digest::SHA512)

  SHA512_FINGERPRINT = Types.Constructor(Types::Strict::String) do |v|
    case v
    when SHA512_HEX then v
    when SHA512_DIGEST then v.hexdigest
    else
      # :nocov:
      Dry::Types::Undefined
      # :nocov:
    end
  end

  NON_BLANK_STRING = Types::String.constrained(format: /\S+/)

  # A type that matches `{ String => String }`
  STRING_MAP = Types::Hash.map(Types::String, Types::String)

  # A type that matches `{ Symbol => #to_sym }`
  SYMBOL_MAP = Types::Hash.map(Types::Symbol, Types::Coercible::Symbol)

  ENSURE_EXISTING_PATH = ->(path) do
    case path
    when NON_BLANK_STRING
      return ENSURE_EXISTING_PATH[Pathname.new(path)]
    when Pathname
      raise ArgumentError, "Expected path #{path.to_s.inspect} to exist" unless path.exist?
    else
      raise TypeError, "Expected #{path.inspect} to be a Pathname or String"
    end

    path
  end

  PATH = Types.Constructor(Types.Instance(::Pathname)) do |value|
    Pathname.new(value)
  end

  EXISTING_PATH = Types.Constructor(Types.Instance(::Pathname)) do |value|
    next Dry::Types::Undefined if value.blank?

    ENSURE_EXISTING_PATH[value]
  end

  ClassName = Types::Class.constructor do |value|
    case value
    when String then value.safe_constantize
    when Class then value
    end
  end

  UUID = String.constrained(uuid_v4: true)

  UUIDList = Array.of(UUID)

  class FlexibleStruct < Dry::Struct
    extend Memoist

    include Sliceable

    transform_keys(&:to_sym)

    transform_types do |type|
      if type.default?
        type.constructor do |value|
          value.nil? ? Dry::Types::Undefined : value
        end
      else
        type
      end
    end
  end

  class << self
    def Implements(mod)
      Types::Class.constrained(lt: mod)
    end

    def InstanceOrClass(mod)
      instance = Instance(mod)
      klass = Implements(mod)

      instance | klass
    end
  end

  Model = InstanceOrClass(ActiveRecord::Base)

  ModelProxy = Constructor(Utility::ModelProxy) do |value|
    case value
    when Utility::ModelProxy then value
    when String then Utility::ModelProxy.new value
    end
  end
end
# rubocop:enable Naming/MethodName
