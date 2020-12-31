require 'rails_helper'

RSpec.describe FormattedAttributes::Definition do
  let(:attribute_name) { :title }
  let(:definition) { described_class.new(attribute_name, options) }
  let(:container) { nil }
  let(:include_wrap)  { true }
  let(:renderer_options) { {} }

  let(:options) do
    {
      container: container,
      include_wrap: include_wrap,
      renderer_options: renderer_options,
    }.compact
  end

  let(:raw_value) { "_italic_ a **bold**" }
  let(:formatted_value) { "<p><em>italic</em> a <strong>bold</strong></p>" }
  let(:plaintext_value) { "italic a bold" }

  subject { definition }

  it 'has equality via :path' do
    other = described_class.new(attribute_name)

    is_expected.to eq other
    is_expected.not_to be other
  end

  it 'generates a module full of methods' do
    expect(definition.methods_module).to be_a_kind_of Module
  end

  context "transformations" do
    it "can format markdown" do
      expect(definition.format(raw_value)).to eq formatted_value
    end

    it "can convert markdown to plain text" do
      expect(definition.textify(formatted_value)).to eq plaintext_value
    end
  end

  shared_examples_for "accessor examples" do
    def maybe_wrap_container(accessor)
      if container
        double("model instance", container => accessor)
      else
        accessor
      end
    end

    let(:model_instance) do
      double("model instance")
    end

    let(:method_accessor) { double("method accessor", attribute_name => raw_value) }

    let(:dig_accessor) do
      double("dig accessor").tap do |dig|
        allow(dig).to receive(:dig) do |value|
          case value
          when attribute_name then raw_value
          else
            nil
          end
        end
      end
    end

    let(:bracket_accessor) do
      double("bracket accessor").tap do |ba|
        allow(ba).to receive(:[]) do |value|
          case value
          when attribute_name then raw_value
          else
            nil
          end
        end
      end
    end

    describe "#extract_raw_from" do
      shared_examples_for "finds the value" do
        it "finds the value" do
          expect(definition.extract_raw_from(model_instance)).to eq raw_value
        end
      end

      context "with a standard method accessor" do
        let(:model_instance) { maybe_wrap_container method_accessor }

        include_examples "finds the value"
      end

      context "with a #dig accessor" do
        let(:model_instance) { maybe_wrap_container dig_accessor }

        include_examples "finds the value"
      end

      context "with a #[] accessor" do
        let(:model_instance) { maybe_wrap_container bracket_accessor }

        include_examples "finds the value"
      end

      context "with a blank model" do
        let(:model_instance) { maybe_wrap_container double("blank model", :blank? => true) }

        it "returns nil" do
          expect(definition.extract_raw_from(model_instance)).to be_nil
        end
      end

      context "with a nil model" do
        it "returns nil" do
          expect(definition.extract_raw_from(nil)).to be_nil
        end
      end

      context "with an unknown model" do
        let(:model_instance) { maybe_wrap_container super() }

        it "raises an error" do
          expect do
            definition.extract_raw_from model_instance
          end.to raise_error FormattedAttributes::InvalidModel
        end
      end
    end
  end

  context "sans container" do
    it { is_expected.not_to have_container }

    its(:options) { are_expected.to be_present }

    its(:attribute_name) { is_expected.to eq "title" }
    its(:key) { is_expected.to eq :title }
    its(:path) { is_expected.to eq "title" }

    it { is_expected.to be_match :title }
    it { is_expected.to be_match "title" }

    include_examples "accessor examples"
  end

  context "with a container" do
    let(:container) { :metadata }

    it { is_expected.to have_container }

    its(:attribute_name) { is_expected.to eq "title" }
    its(:key) { is_expected.to eq :metadata__title }
    its(:path) { is_expected.to eq "metadata.title" }

    it { is_expected.to be_match :metadata__title }
    it { is_expected.to be_match "metadata.title" }
    it { is_expected.to be_match "title" }

    include_examples "accessor examples"
  end
end
