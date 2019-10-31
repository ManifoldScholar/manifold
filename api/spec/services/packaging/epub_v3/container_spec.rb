require "rails_helper"

RSpec.describe Packaging::EpubV3::Container, packaging: true do
  class << self
    def with_entry(path, &block)
      describe "[#{path.inspect}]" do
        let(:path) { path }
        let(:entry) { described_class[path] }

        subject { entry }

        instance_eval(&block) if block_given?
      end
    end

    def with_callable_entry(path, &block)
      with_entry(path) do
        it { is_expected.to respond_to :call }

        instance_eval(&block) if block_given?
      end
    end
  end

  with_entry "api_url" do
    it { is_expected.to be_present }
  end

  with_entry "frontend_url" do
    it { is_expected.to be_present }
  end

  with_entry "reference_selectors" do
    it { is_expected.to all(a_kind_of(Packaging::Shared::ReferenceSelector)) }
  end

  with_callable_entry "book_compilation.pipeline"
  with_callable_entry "text_compilation.pipeline"
  with_callable_entry "text_section_compilation.pipeline"
end
