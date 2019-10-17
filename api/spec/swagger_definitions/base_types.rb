# base Type used by all swagger json definitions
require 'rails_helper'

module Type
  class << self
    # A helper function to handle merging params while making a special case for nullable attributes.
    # Rswag currently generates OpenAPI v2 documentation, and the method for declaring nullable
    # values changes in OpenAPI v3. To make the change easier whenever it happens, this helper function
    # will make it so passing a { nullable: true } value into any of these base Types will set the
    # nullable swagger definition properly
    def merge_params_with_nullable(base, params = {})
      nullable = params.delete(:nullable)
      base = base.merge({'x-nullable': true }) if nullable
      base = base.merge(params)
      return base
    end

    ######################
    # general data types #
    ######################

    def boolean(params = {})
      merge_params_with_nullable({ type: :boolean }, params)
    end

    def number(params = {})
      merge_params_with_nullable({ type: :integer }, params)
    end

    def id(params = {})
      merge_params_with_nullable({ type: :string }, params)
    end

    def integer(params = {})
      merge_params_with_nullable({ type: :number }, params)
    end

    def url(params = {})
      merge_params_with_nullable({ type: :string, example: 'http://url.com' }, params)
    end

    def nullable_string(params = {})
      { type: :string, 'x-nullable': true }.merge(params)
    end

    def object(contents)
      { type: :object, properties: contents }
    end

    def object(contents, params = {})
      { type: :object, properties: contents }.merge(params)
    end

    def reference(path)
      { '$ref': path }
    end

    # 'type' is a required param for the array
    def array(params = {})
      items = params.delete(:type)
      base = { type: :array }
      base = base.merge({ items: items })
      base = base.merge(params)
      return base
    end

    def enum(array)
      {
        type: :string,
        enum: array
      }
    end

    def enum(array, params = {})
      {
        type: :string,
        enum: array
      }.merge(params)
    end

    def string(params = {})
      merge_params_with_nullable({ type: :string }, params)
    end

    def email(params = {})
      merge_params_with_nullable({ type: :string, example: 'address@email.com' }, params)
    end

    def date_time(params = {})
      merge_params_with_nullable({ type: :string, format: "date-time" }, params)
    end

    def date(params = {})
      merge_params_with_nullable({ type: :string, format: "date" }, params)
    end

    ####################################
    # frequently used data structures  #
    ####################################

    def crud(params = {})
      {
        create: boolean,
        read: boolean,
        update: boolean,
        delete: boolean
      }.merge(params)
    end

    def permissions
      object({
        readDrafts: boolean,
        readLog: boolean,
        manageResources: boolean,
        createResources: boolean,
        manageResourceCollections: boolean,
        createResourceCollections: boolean,
        managePermissions: boolean,
        createPermissions: boolean,
        manageTexts: boolean,
        createTexts: boolean,
        manageTwitterQueries: boolean,
        createTwitterQueries: boolean,
        manageEvents: boolean,
        manageSocials: boolean,
        updateMakers: boolean,
        create: boolean,
        read: boolean,
        update: boolean,
        delete: boolean
      })
    end

    def image
      reference( '#/definitions/Image' )
    end

    def attachment
      reference( '#/definitions/Attachment' )
    end

    def meta_partial()
      object({
        partial: boolean
      })
    end

    def attributes_with_crud(array)
      hash = Hash.new
      array.each { |attribute|
        hash["#{attribute}"] = Type.object( Type.crud )
      }
      return hash
    end

    def relationships(params)
      singular = multiple = {}
      singular = params[:singular].map{ |x| [x, relationship_data_attribute] }.to_h if params[:singular]
      multiple = params[:multiple].map{ |x| [x, relationship_data_attributes] }.to_h if params[:multiple]
      return singular.merge(multiple)
    end

    def data_contents(params)
      if params.key?(:relationships)
        return object({
          id: id,
          type: string,
          attributes: object( params[:attributes] ),
          relationships: relationships( params[:relationships] ),
          meta: meta_partial
        }, { required: [ 'id', 'type', 'attributes', 'meta' ]})
      end

      return object({
        id: id,
        type: string,
        attributes: object( params[:attributes] ),
        meta: meta_partial
      }, { required: [ 'id', 'type', 'attributes', 'meta' ]})
    end


    def data_object(contents, params = {})
      return object({ data: contents }, { required: [ 'data' ] })
    end

    def data_array(contents, params = {})
      return object({
        data: array(
          type: contents
        )}, {
          required: [ 'data' ]
        }
      )
    end

    def paginated(contents)
      object({
        data: array( type: contents ),
        links: object({
          self: url( nullable: true ),
          first: url( nullable: true ),
          prev: url( nullable: true ),
          next: url( nullable: true ),
          last: url( nullable: true )
        }),
        meta: object({
          pagination: object({
            perPage: number,
            currentPage: number,
            nextPage: number,
            prevPage: number,
            totalPages: number,
            totalCount: number
          })
        })
      })
    end

    ### REQUEST ###

    def request(params = {})
      attributes = params.delete(:attributes)
      relation = params.delete(:relationships)

      if relation
        return data_object(
          object({
            attributes: attributes,
            relationships: relationships( relation )
          })
        )
      end

      data_object(
        object({
          attributes: object( attributes, params )
        })
      )
    end

    ### RESPONSE ###

    def resource_response(params)
      data_object(
        data_contents( params )
      )
    end

    def collection_response(params)
      is_paginated = params.delete(:paginated)
      is_array = params.delete(:array)

      return paginated( data_contents( params )) if is_paginated
      return data_array( data_contents( params )) if is_array
      # raise "Error: array or pagniated value required for collection type"
    end

    def response(params = {})
      type = params.delete(:type)

      return resource_response(params) if type == :resource
      return collection_response(params) if type == :collection
      # raise "Error: resource or collection type must be specified"
    end

    ###########################################
    ## Attributes located across the project ##
    ###########################################

    def slug() { description: I18n.t('attributes.descriptions.slug') } end
    def pending_slug() { description: I18n.t('attributes.descriptions.pending_slug') } end
    def standalone_mode() { enum: ['enabled', 'disabled', 'enforced'] } end
    def avatar_color()
      {
        enum: [
          "primary",
          "secondary",
          "tertiary",
          "quaternary",
          "quinary",
          "sentary"
        ]
      }
    end

    def currency_code()
      { example: "USD", description: "International currency codes (see http://www2.1010data.com/documentationcenter/discover/FunctionReference/DataTypesAndFormats/currencyUnitCodes.html)"}
    end

    ############################
    ## Helper data structures ##
    ############################

    def relationship_data_attribute
      object({
        data: object({
          id: id,
          type: string
        })
      })
    end

    def relationship_data_attributes
      object({
        data: array(
          type: object({
            id: id,
            type: string
          })
        )
      })
    end

    def attachment_attributes
      Type.object({
        data: string,
        filename: string,
        content_type: string,
      })
    end

    def image_attributes
      object({
        small: url( nullable: true ),
        smallSquare: url( nullable: true ),
        smallLandscape: url( nullable: true ),
        smallPortrait: url( nullable: true ),
        medium: url( nullable: true ),
        mediumSquare: url( nullable: true ),
        mediumLandscape: url( nullable: true ),
        mediumPortrait: url( nullable: true ),
        largeLandscape: url( nullable: true ),
        original: url( nullable: true )
      })
    end

    ###### DEPRECATED #######
    def relationship_data
      reference( '#/definitions/RelationshipData' )
    end

    def response_with_relationships(attributes, relationships)
      object({
        id: id,
        type: string,
        attributes: object( attributes ),
        relationships: object( relationships ),
        meta: meta_partial
      })
    end

    def data_response_hash(contents)
      return object({
        id: id,
        type: string,
        attributes: object( contents ),
        meta: 'meta_partial'
      }, { required: [ 'id', 'type', 'attributes', 'meta' ]})
    end
  end
end
