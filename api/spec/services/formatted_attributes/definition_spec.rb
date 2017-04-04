require 'rails_helper'

RSpec.describe FormattedAttributes::Definition do
  let(:attribute_name) { :title }
  let(:include_wrap)  { true }
  let(:definition) { described_class.new(attribute_name, include_wrap: include_wrap) }

  subject { definition }

  it 'has equality via :attribute' do
    other = described_class.new(attribute_name)

    is_expected.to eq other
    is_expected.not_to be other
  end

  it 'generates a module full of methods' do
    expect(definition.methods_module).to be_a_kind_of Module
  end
end
