require "rails_helper"

module ApiDocs
  module Definitions
    class DryTypesToJson
      class << self
        def convert(type)
          mapping = {}

          if type.respond_to?(:type)
            mapping[type] = set_simple_type(type)
          elsif type.respond_to?(:name) && split_multi_type(type).count > 1
            mapping[type] = set_nullable(type)
          end

          if type.respond_to?(:values)
            mapping[type] = mapping[type].merge({
              enum: type.values.map { |key, _| key }
            })
          end

          if type.respond_to?(:meta) && mapping[type]
            mapping[type] = mapping[type].merge(type.meta)
          end

          mapping[Dry::Types['date_time']] = base_date_time
          mapping[Dry::Types['bool']] = { type: 'boolean' }

          mapping[type] || type
        end

        private

        def set_simple_type(type)
          case type.name.downcase.to_sym
          when :array
            return set_array(type)
          when :hash
            return set_hash(type)
          when :float
            return base_float
          end

          { type: type.name.downcase }
        end

        def set_nullable(type)
          mapping = {}
          options = split_multi_type(type).map { |i| i.downcase.to_sym }
          nullable = options.delete(:nilclass)
          mapping[type] = { type: options[0].to_s }
          mapping[type] = mapping[type].merge(null_object) if nullable
          mapping[type] = mapping[type].merge(base_date_time) if options.include? :datetime
          mapping[type] = mapping[type].merge(base_float) if options.include? :float
          mapping[type]
        end

        def set_hash(type)
          if type.respond_to?(:keys)
            return {
              type: 'object',
              properties: type.keys.map { |item|
                [item.name, convert(item.type)]
              }.to_h
            }
          end

          return {}
        end

        def set_array(type)
          {
            type: 'array',
            items: convert(type.type.member)
          }
        end

        def split_multi_type(type)
          type.name.split(" | ")
        end

        def base_date_time
          { type: 'string', format: 'date-time' }
        end

        def base_float
          { type: 'number', format: 'float' }
        end

        def null_object
          { 'x-nullable': true }
        end
      end
    end
  end
end

RSpec.describe ::ApiDocs::Definitions::DryTypesToJson do
  let(:types) { Dry::Types }
  let(:serializer_types) { ::Types::Serializer }

  describe 'when defining primitive types' do
    it 'should map a string' do
      expect(
        described_class.convert(types['string'])
      ).to eq({
        type: 'string'
      })
    end

    it 'should map a bool' do
      expect(
        described_class.convert(types['bool'])
      ).to eq({
        type: 'boolean'
      })
    end

    it 'should map a integer' do
      expect(
        described_class.convert(types['integer'])
      ).to eq({
        type: 'integer'
      })
    end

    it 'should map a float' do
      expect(
        described_class.convert(types['float'])
      ).to eq({
        type: 'number',
        format: 'float'
      })
    end

    it 'should map a datetime' do
      expect(
        described_class.convert(types['date_time'])
      ).to eq({
        type: 'string',
        format: 'date-time'
      })
    end
  end

  it 'should be able to attatch metadata information' do
    expect(
      described_class.convert(types['string'].meta(example: 'foo'))
    ).to eq({
      type: 'string',
      example: 'foo'
    })
  end

  it 'should be able to convert an optional string' do
    expect(
      described_class.convert(types['string'].optional)
    ).to eq({
      type: 'string',
      'x-nullable': true
    })
  end

  it 'should be able to convert an optional datetime' do
    expect(
      described_class.convert(types['date_time'].optional)
    ).to eq({
      type: 'string',
      format: 'date-time',
      'x-nullable': true
    })
  end

  describe 'complex types' do
    it 'should be able to convert an enum string' do
      expect(
        described_class.convert(types['string'].enum('one', 'two'))
      ).to eq({
        type: 'string',
        enum: ['one', 'two']
      })
    end

    it 'should be able to convert an optional float' do
      expect(
        described_class.convert(types['float'].optional)
      ).to eq({
        type: 'number',
        format: 'float',
        'x-nullable': true
      })
    end

    it 'should be able to convert an empty hash' do
      expect(
        described_class.convert(types['hash'])
      ).to eq({})
    end

    it 'should be able to convert an array with a simple type' do
      expect(
        described_class.convert(types['array'].of(types['string']))
      ).to eq({
        type: 'array',
        items: {
          type: 'string'
        }
      })
    end

    it 'should be able to convert a hash with content' do
      expect(
        described_class.convert(types['hash'].schema(name: types['string']))
      ).to eq({
        type: 'object',
        properties: {
          name: described_class.convert(types['string'])
        }
      })
    end

    describe 'custom serializer types' do
      it 'should be able to convert a pointer' do
        expect(
          described_class.convert(serializer_types::Pointer)
        ).to eq({
          type: 'object',
          properties: {
            id: described_class.convert(serializer_types::ID),
            type: described_class.convert(types['string'])
          }
        })
      end

      it 'should be able to convert a resource' do
        expect(
          described_class.convert(serializer_types::Resource)
        ).to eq({
          type: 'object',
          properties: {
            data: described_class.convert(serializer_types::Pointer)
          }
        })
      end

      it 'should be able to convert an array of hashes' do
        expect(
          described_class.convert(types['array'].of(types['hash'].schema(name: types['string'])))
        ).to eq({
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: 'string' }
            }
          }
        })
      end

      it 'should be able to convert a collection' do
        expect(
          described_class.convert(serializer_types::Collection)
        ).to eq({
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: described_class.convert(serializer_types::Pointer)
            }
          }
        })
      end
    end
  end
end
