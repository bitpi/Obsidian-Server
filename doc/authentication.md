
![Tendigi Logo](assets/logo.png)
# Authentication

## Client Authentication

Obsidian Server requires every request to originate from an authorized client.  Requests that contain missing or invalid client credentials will return a `401 Unauthorized` error.

### Client Management

To facilitate client administration, the Obsidian Server command-line interface includes commands to manage your application's clients:

* `$ obsidian-server clients` will connect to the database and print a list of authorized clients, as well as their associated keys and secrets.
* `$ obsidian-server clients:add` will guide you step-by-step through the process of creating a client.  It will generate random keys and secrets by default, but these can be overridden if desired.
* `$ obsidian-server clients:remove` will guide you through the steps of removing a client from the database.

### Authenticating a client

To identify a client to the server, set the `tendigi-client-key` and `tendigi-client-secret` request headers to your client's key and secret, respectively.

## User Authentication

### Configuring the Module

Adding user authentication to a resource (typically, but not necessarily, named `user`) is accomplished via the `user_authentication` module.  The module takes two options: `username` and `email`.  If the `username` option is set to `true`, the module will add an attribute called `user_authentication_username` to the resource on which it has been enabled.  Similarly, if the `email` option is set to `true`, the module will add the `user_authentication_email` attribute.  You are free to use one or both of these identifiers, based on the requirements of your application.

Additionally, the module will add the `user_authentication_password` attribute, which is hashed and salted using the industry-standard BCrypt algorithm.

Here's an example of `resources.json` with the `user_authentication` module configured:

```
{

    ...    

    "resources": {
        "user": {

            ...

            "modules": {
                "user_authentication": {
                    "email": true
                }
            }
    
            ...
                
        }
    }

    ...
}
```

### Authenticating Users

The `user_authentication` module adds a `user_authentiation_login` method to its parent resource.  To use it, simply `POST` a body in one of the following formats to `/<resource>/user_authentication_login`:

```
{
	"criteria": {
		"user_authentication_username": <username>,
		"user_authentication_password": <password>
	}
}
```

```
{
	"criteria": {
		"user_authentication_email": <email>,
		"user_authentication_password": <password>
	}
}
```

If the request is successful, the response will contain the record of the user that was authenticated.  Additionally, the response will contain the `tendigi-bearer-token` header whose value should be persisted by the client and used for subsequent requests.

If authentication fails, the server will emit an `HTTP 401 Unauthorized` response.

## Method Authentication

Obsidian Server makes it easy to guard methods from unauthorized access.  Rather than passing `true` in the options for each method, pass a configuration object with the `filters` key set as follows:

```
{
    
    ...    

    "methods": {
    
        ...

        "update": {
            "filters": {
                "user_authentication": {
                    "resource": "user",
                    "match_attribute": "id"
                }
            }
        }

        ...

    }

    ...

}
```

In the above example, the `resource` field denotes the name of the resource that has been extended with the `user_authentication` module.  The `match_attribute` field, which is optional, ensures that the `id` of the resource being authenticated against matches the id of the resource being queried/updated.  If you had a `photo` resource with a relationship to its `owner`, and your application defined a resource called `user`, you could prevent users other than the photo's owner from modifying the photo by setting `match_attribute` to `owner`.  The `match_attribute` field is **optional**.

To successfully authenticate, pass the token obtained from a resource's login endpoint in your request's `tendigi-bearer-token` header field.
