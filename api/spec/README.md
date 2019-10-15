# spec

This project uses [rswag](https://github.com/domaindrivendev/rswag) to automatically generate a swagger specification of the API based on the tests that rely on the swagger_helper library.

To run a test and make sure the rswag spec matches the project: `rspec -fd spec/requests`

If all of those tests pass, you can safely assume that the documentation will accurately reflect the project.
To generate a swagger doc with rswag: `rake rswag:specs:swaggerize`

The swagger documentation will be generated in `api/swagger/v1/swagger.json`


## How to document a route

### General steps

#### Setting up
1. Find a file in `api/spec/requests/` that has an undocumented route
2. Create a file in `api/spec/swagger_definitions/`. This is where we will define the schema for the requests and responses. Use the template in the readme for that folder.
3. `rails routes` to find all the routes in the project and see which controllers are associated with them
4. Open the associated controller for the routes

#### Finding the route response attributes
Assuming that the route we are documenting has both a get "individual" and a get "all" route:

```
GET /route
GET /route/:id
```
The following steps will guide you through setting up both. 
If you only have one of the two, the setup is pretty much the same and it should be pretty clear what to leave out if you do not need both.
If there are two serializers for the route, that means there is a full and a partial response. 

The following assumes that there is only one serializer.
If there is more than one serializer, the steps are similar, you just need to make sure that the `get_model` and `get_models` methods in the file return the correct amount of data. 
If that does not make sense now, read through this section and then come back to this.


1. The serializer is in charge of defining what is included in the response. It has the same name as the controller and can be found in the `api/app/serializers/` folder.

2. Open up the file and find the `attributes` method with the names of all the attributes that will be returned.

3. Open the associated file that you made in the `swagger_definitions` folder and write all the attributes in the `get_model_attributes` hash. I have only found two ways to be confident of the associated data types with each attribute. This has a lot of room for improvement.

	1. Look into the schema and find the value of each attribute. Usually they all exist within the same table.

	2. Test the route using whatever http test method you preffer (web browser, curl, insomnia, postman, etc) and see what kind of response it gives. This might require you to open the rails console, create a fake record if it does not exist in the db, and look at the data types of a response. This is not a great way to get the data types, however it is also the most reliable way to make sure that things are working from a user perspective, which is the point of writing documentation.

4. Back in the serializer file, find the `relationships` variable if it exists on that route. 

	1. If it does, your `get_model` method will be using the helper `Type.response_with_relationships` method. Pass in the response attributes first (that you defined in the `get_model_attributes` method), and a relationships hash as the second param.

		* A problem with this is that there is no easy way for me to know whether this relationship will return a single record or an array of them. I have found this out by testing the routes manually. If it returns more than one value in the relationship `Type.relationship_data_attribute` is the helper method to use. If it has multiple values, the `Type.relationship_data_attributes` is the helper method to use. 
 
	2. If it does not, your `get_model` method will be using the helper `response` method. The only param will be the result of the `get_model_attributes` method.

5. If the controller has a `with_pagination!` method anywhere in the file, it is likely that the response from the `get_models` method will need to be paginated. 
	1. If it is, you can use the `Type.paginated` method and pass the results of the `get_model` method as the only param. 
	2. If it is not, you can use the `Type.data_array` method and pass the results of the `get_model` method as the only param.

#### Finding the route request parameters
1. In the controller, you will find information about the data that the controller will accept and what fields it will respond with.

2. All validations for the project are located in `api/app/controllers/concerns/validation.rb`. Find the params with the same name as the controller and you should see `attributes` and `relationships`.

3. The `attributes` are the values that the validator will allow to pass to the controller. I have only found two ways to be sure of the associated data types with each attribute. This has a lot of room for improvement.

	1. Look into the schema and find the value of each attribute. Usually they all exist within the same table.

	2. Test the route using whatever http test method you preffer (web browser, curl, insomnia, postman, etc) and see what kind of response it gives. This might require you to open the rails console, create a fake record, and look at the data types of a response. Whatever data type it responds with is the data type that it will request. This is pretty guess and check, however it is also the most reliable way to make sure that things are working from a user perspective, which is the point of writing documentation.


#### Hooking the schemas to the integration tests
1. Open up the `swagger_helper` file and require the new file you created in the `swagger_definitions` folder. In the `definitions` section, you should see keys listed in alphabetical order associated with the results of the `swagger_definitions` module methods.

2. When you define a key, this makes it accessible to the tests in the requests integration test files. These keys should be replaced with the associated `RESOURCE_DEFINITION` variable in the test file.

3. Follow the descriptions in `api/spec/requests/README.md`


## Why I use a rest client to check the data structure

1. It's good to see something from a user perspective while I'm documenting

2. It is an easy way to find out the data types for the responses from the serializer (Sometimes this does not work perfectly, such as the case where a field is null, or there is a related attribute that could be more than one type of object)

3. It forces me to create fake data using the factory bots. This is important because I will need to use those same factory bots to generate the fake data for the test. If no fake data is generated for the test and an empty object is returned for the data structure, rswag will mark the test as a success.
