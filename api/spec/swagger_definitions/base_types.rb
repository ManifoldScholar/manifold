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

    def request(contents, params = {})
      object({
        data: object({
          attributes: Type.object( contents, params )
        })
      })
    end

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

    # TODO refactor out for collection_response
    def data_array(dataType)
      object({
        data: array( type: dataType )
      })
    end

    def paginated(dataType)
      object({
        data: array( type: dataType ),
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

    def meta_partial()
      object({
        partial: boolean
      })
    end

    def relationship_data
      reference( '#/definitions/RelationshipData' )
    end

    def relationships(array)
      base = {}
      array.each do |item|
        base = base.merge({ "#{item}" => relationship_data })
      end
      return base
    end

    def data_response_hash(attributes)
      object({
        id: id,
        type: string,
        attributes: Type.object( attributes ),
        meta: meta_partial
      }, { required: [ 'id', 'type', 'attributes', 'meta' ]})
    end

    # TODO refactor out for resource_response and collection_response
    def response(attributes)
      object({
        id: id,
        type: string,
        attributes: object( attributes ),
        meta: meta_partial
      })
    end

    def resource_response(params = {})
      object data: data_response_hash( params[:attributes] ), required: [ 'data' ]
    end

    def collection_response(params = {})
      return paginated( data_response_hash( params[:attributes] )) if params[:paginated]

      if params[:relationships]
        return object({
          id: id,
          type: string,
          attributes: object( params[:attributes] ),
          relationships: object( params[:relationships] ),
          meta: meta_partial
        }, { required: [ 'id', 'type', 'attributes', 'meta' ]})
      end

      object({
        data: array({
          type: data_response_hash( params[:attributes] )
        })
      }, { required: [ 'data' ] })
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

    def attributes_with_crud(array)
      hash = Hash.new
      array.each { |attribute|
        hash["#{attribute}"] = Type.object( Type.crud )
      }
      return hash
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
  end
end
