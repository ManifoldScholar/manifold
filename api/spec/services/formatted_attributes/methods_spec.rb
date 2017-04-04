require 'rails_helper'

RSpec.describe FormattedAttributes::Methods do
  let(:attribute_name) { :title }

  let(:definition) do
    instance_spy(FormattedAttributes::Definition,
                 attribute: attribute_name,
                 :include_wrap? => true
                )
  end

  let(:generated_module) { described_class.new(definition) }

  def method_name_for(key)
    generated_module.method_name(key)
  end

  describe 'public instance methods' do
    subject { generated_module.instance_methods }

    specify { is_expected.to include method_name_for(:refresh) }
    specify { is_expected.to include method_name_for(:format) }
    specify { is_expected.to include method_name_for(:formatted) }
  end

  describe 'private instance methods' do
    subject { generated_module.private_instance_methods }

    specify { is_expected.to include method_name_for(:cache_key) }
  end
end
