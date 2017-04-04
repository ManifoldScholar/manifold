require 'rails_helper'

RSpec.describe SimpleFormatter do
  let(:input_text)    { "Random Text" }
  let(:include_wrap)  { true }

  let(:outcome) { described_class.run input: input_text, include_wrap: include_wrap }

  context 'when it comes to wrapping text' do
    subject { outcome.result }

    context 'when :include_wrap is true' do
      it 'should be wrapped in a P tag' do
        is_expected.to be_wrapped_with('p')
      end
    end

    context 'when :include_wrap is false' do
      let(:include_wrap) { false }

      it 'should have no wrapper' do
        is_expected.not_to be_wrapped_with('p')
      end
    end
  end
end
