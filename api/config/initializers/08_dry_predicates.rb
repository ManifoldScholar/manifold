# frozen_string_literal: true

Dry::Logic::Predicates.predicate :rails_blank? do |input|
  input.blank?
end

Dry::Logic::Predicates.predicate :rails_present? do |input|
  input.present?
end

Dry::Logic::Predicates.predicate :email? do |input|
  format? URI::MailTo::EMAIL_REGEXP, input
end

gid_uri = URI::DEFAULT_PARSER.make_regexp("gid")

Dry::Logic::Predicates.predicate :global_id_uri? do |input|
  str?(input) && format?(gid_uri, input)
end

Dry::Logic::Predicates.predicate :global_id? do |input|
  return false if rails_blank?(input) || !(global_id_uri?(input) || type?(::GlobalID, input))

  gid = GlobalID.parse input

  return false if gid.blank?

  begin
    gid.model_class.present?
  rescue NameError
    false
  end
end

Dry::Logic::Predicates.predicate :entitlement_subject_gid? do |input|
  return false unless global_id?(input)

  gid = GlobalID.parse input

  gid.app.to_s == "entitlements"
end

Dry::Logic::Predicates.predicate :entitlement_target_gid? do |input|
  return false unless global_id?(input)

  gid = GlobalID.parse input

  gid.model_class.model_name.to_s.in?(%w[ReadingGroup User])
end

Dry::Logic::Predicates.predicate :inherits? do |parent, input|
  type?(Class, input) && input < parent
end

Dry::Logic::Predicates.predicate :model? do |input|
  type?(ActiveRecord::Base, input)
end

Dry::Logic::Predicates.predicate :model_list? do |input|
  array?(input) && input.all? { |elm| model? elm }
end

Dry::Logic::Predicates.predicate :model_class? do |input|
  inherits?(ActiveRecord::Base, input)
end

Dry::Logic::Predicates.predicate :model_class_list? do |input|
  array?(input) && input.all? { |elm| model_class?(elm) }
end

Dry::Logic::Predicates.predicate :specific_model? do |model_name, input|
  model?(input) && str?(model_name) && input.model_name == model_name
end

# Use it like this:
#
#     MyContract = Dry::Validation.Contract do
#       params do
#         # for a hash:
#         required(:a).hash(OtherContract.schema)
#
#         # for an array of hashes:
#         required(:b).array(:hash, OtherContract.schema)
#       end
#
#       rule(:a).validate(contract: OtherContract)
#       rule(:b).each(contract: OtherContract)
#     end
#
Dry::Validation.register_macro(:contract) do |macro:, context:|
  next if value.nil? # skip if not a hash

  contract_instance = macro.args[0].then do |contract|
    contract.kind_of?(Class) ? contract.new : contract
  end

  contract_result = contract_instance.(value, context)

  unless contract_result.success?
    errors = contract_result.errors

    errors.each do |error|
      key(key.path.to_a + error.path).failure(error.text)
    end
  end
end
