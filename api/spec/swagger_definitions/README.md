# swagger_definitions

This folder contains definitions that make defining swagger input/output types.

Every file with the exception of the `base_types.rb` should be imported into `swagger_helper.rb` so the structure that is defined in these files can be validated in the request tests.

Swagger is a very verbose format, and creating some methods that return the formats needed in the documentation makes it much easier for humans to read and makes typos less likely. 
