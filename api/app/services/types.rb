module Types
  include Dry.Types

  CALLABLE = Types.Interface(:call)

  ENUM_OF_TYPE = ->(klass) { Types.Constructor(klass) { |v| klass.build(v) } }

  HTTP_METHOD = Types::Coercible::Symbol.enum(:get, :head, :post, :put, :delete)

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
    begin
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

  EXISTING_PATH = Types.Constructor(Types.Instance(::Pathname)) do |value|
    next Dry::Types::Undefined if value.blank?

    ENSURE_EXISTING_PATH[value]
  end

  class FlexibleStruct < Dry::Struct
    extend Memoist

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
end
