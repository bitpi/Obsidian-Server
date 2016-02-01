![Tendigi Logo](assets/logo.png)
# Getting Started

## Installation

To install Obsidian Server locally, run:
```
$ sudo npm install obsidian-server -g
```

## Creating a Project

It's easy to get up-and-running with Obsidian Server.  To create a new project, run:

```
$ obsidian-server new
```

After following the prompts, you'll notice that the project generator created a directory (using the name you specified) with the following structure:

```
.
├── db
├── environment.json
└── resources.json
```

By default, new Obsidian Server projects are configured to store data as JSON in the `./db` directory. This is great for development but (obviously) not suitable for production. Visit the [configuration](./configuration.html) documentation for more information about project configurations (including the usage of production-grade databases).

## Registering a Client

Since Obsidian Server requires all requests to originate from authorized clients, we need to register one.  Run the following command and follow the prompts:

```
$ obsidian-server clients:add
```

For more information regarding both client and user authentication, consult the [authentication](./authentication.html) reference.

## Testing the Configuration


To test this basic configuration, run: 

```
$ obsidian-server serve
```

After the server starts, we can use `curl` to test the built-in `_metadata` endpoint.  Be sure to modify the request to include the client key/secret generated in the previous step.

```
$ curl -X "GET" "http://127.0.0.1:8000/_metadata" \
	-H "tendigi-client-key: <your client key>" \
	-H "tendigi-client-secret: <your client secret>"
```

If the project is configured correctly, `curl` should output JSON that looks something like this:

```
{
    "_type": "metadata",
    "_requestID": "fd6e28b3-d767-536e-a8eb-a7cdeac8424b",
    "_requestTimestamp": "2015-06-25T18:30:39.636Z",
    "_responseTimestamp": "2015-06-25T18:30:39.640Z",
    "_data": {
        "name": "My API",
        "version": "0.0.1"
    }
}
```

## Next Steps

Now that we've successfully accessed the `_metadata` resource, it's time to create our own.  Visit the [resources](./resources.html) documentation to learn more.