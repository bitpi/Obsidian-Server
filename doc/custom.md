
![Tendigi Logo](assets/logo.png)
# Custom Functionality

In addition to basic CRUD behavior, Obsidian Server also allows developers to define methods with custom implementations.  These implementations have full access to all models defined within `resources.json`, and may import node.js packages obtained via `npm`.

## Defining a Custom Method

All methods, whether they are user-defined or built-in, belong to a parent resource.  A custom definition requires two parameters:  a `path` to its Javascript implementation, and the HTTP `method` it will use.  Such a definition in `resources.json` would look like this:

```
"resources": {
    "employee": {
        "attributes": {
            "name": {
                "type": "string"
            }
        },
        "methods": {
            "create": true,
            "read": true,
            "update": true,
            "destroy": true,
            "fire": {
                "implementation": "./fire_employee.js",
                "method": "GET"
            }
        }
    }
}
```
**NOTE:** Acceptable values for the `method` option are `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.

**NOTE:** Prefixing a custom method's implementation path with `./` indicates that Obsidian Server should look for it in the process's working directory.

## Implementing a Custom Method

Custom methods are implemented as CommonJS modules, with the module's `exports` property set to a function that will be called when a client invokes the custom method.  That function's signature is `function(request, info, callback)`.  The parameters have the following properties, respectively:

* `request`
  * `headers` - a Javascript object containing the HTTP request headers sent by the client
  * `params` - a Javascript object containing any parameters sent by the client.  _Obsidian Server automatically merges parameters from both the HTTP request body and the request's query string into this object._
* `info`
  * `config` - Any custom configuration specified in the `custom` portion of `environment.json`
  * `models` - a Javascript object containing interfaces for accessing your application's models.
* `callback` - A NodeJS-style callback that **must** be called to complete the request.  The signature for this callback is `function(error, responseObject)`.

A simple method implementation's Javascript file (`./fire_employee.js` in this case) might look like this:

```
module.exports = function(request, info, callback) {

	var response = {
		myAttribute: "He's a goner",
		myOtherAttribute: true
	};

	callback(null, response);

};
```
**NOTE:** The process's environment variables may be accessed in the traditional NodeJS fashion via `process.env`.

## Interacting with Models

Each model suppled in the `info.models` object of your method's handler function implements the `create`, `read`, `update` and `delete` methods.  These methods take the following parameters, respectively:

### Create

#### `function create(body: {}): Promise<{}>`

* `body` - a Javascript object containing the values that should be set on the new record

**returns** a promise that, when fulfilled, will contain a Javascript object representing the new record

### Read

#### `read(criteria: {}, sort: Array<string>, page: number, limit: number, include: Array<string>): Promise<Array<{}>>`

* `criteria` - a Javascript object describing the criteria under which records should be selected
* `sort` - An array of descriptors that dictate how the result set will be sorted
* `page` - The page of results to return
* `limit` - The maximum number of results to return
* `include` An array of has_one relationship names that the ORM should populate prior to sending the response

**returns** a promise that, when fulfilled, will contain an array of records that matched the parameters

### Update

#### `update(criteria: {}, body: {}): Promise<Array<{}>>`

* `criteria` - a Javascript object describing the criteria under which records should be selected for update
* `body` - a Javascript object containing the values that should be set on the record

**returns** a promise that, when fulfilled, will contain an array of records that were updated

### Destroy

#### `destroy(criteria: {}): Promise<Array<{}>>`

* `criteria` - a Javascript object describing the criteria under which records should be selected for deletion

**returns** a promise that, when fulfilled, will contain an array of records that were deleted