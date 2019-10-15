# swagger_definitions

This folder contains definitions that make defining swagger input/output types.

Every file with the exception of the `base_types.rb` should be imported into
`swagger_helper.rb` so the structure that is defined in these files can be
validated in the request tests.

Swagger is a very verbose format, and creating some methods that return the
formats needed in the documentation makes it much easier for humans to read and
makes typos less likely.


## Sample definition

```
require 'rails_helper'
require_relative 'base_types'

# replace MODEL_NAME with the name of the model you are defining
module MODEL_NAME
  class << self
    ##############################
    ##   PARAMS & ATTRIBUTES    ##
    ##############################
    def create_request_params
      {

      }
    end

    def create_response_attributes
      {

      }
    end

    def update_request_params
      {

      }
    end

    def update_response_attributes
      {

      }
    end

    def get_model_attributes
      {

      }
    end

    def model
      Type.response_with_relationships(
        get_model_attributes,
        relationship_attributes
      )
      Type.response( get_model_attributes ) # no relationships
    end

    ##############################
    ##  CRUD OPERATION SCHEMAS  ##
    ##############################
    def create_request
      Type.request()
    end

    def create_response
      Type.object({ data: model })
    end

    def update_request
      Type.request(
        Type.object({})
      )
    end

    def update_response
      Type.object({ data: model })
    end

    def get_model
      Type.object({ data: model })
    end

    def get_models
      Type.data_array( model ) # it could be just a data array of models
      Type.paginated( model )  # or maybe it is a data array with pagination
    end
  end
end
```
### Explanation

I have found the best way to organize the data so it all makes sense is to
change up the contents of the params and attributes section as much as you
like but keep the CRUD operation schemas as straightforward as possible.

For example, your create request and update request may use the same parameters.
One might be tempted to define our schemas like so:

```
### SCHEMAS
def create_request
  Type.request( create_request_params )
end

def update_request
  Type.request( create_request_params )
end
```
This has two problems:

1. It looks confusing at a glance
2. This might be mistaken by another developer (or you in the future)
   as a copy-paste mistake. They might try to fix it and break your
   code.

It is more clear to reference the `create_request_params` method
from the `update_request_params`:

```
### PARAMS & ATTRIBUTES
def create_request_params
  {
	role: Type.string
  }
end

def update_request_params
  create_request_params
end
```

This looks more intentional, and makes our schema section easy to check
at a glance that everything is in place. Take at the first schema
vs the newer one:

```
### SCHEMAS
def create_request                      # create
  Type.request( create_request_params ) # create
end

def update_request                      # update
  Type.request( create_request_params ) # create ???
end
```
vs

```
### SCHEMAS
def create_request                      # create
  Type.request( create_request_params ) # create
end

def update_request                      # update
  Type.request( update_request_params ) # update
end
```
