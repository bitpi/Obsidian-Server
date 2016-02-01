
![Tendigi Logo](assets/logo.png)
# Resources

## Introduction

Obsidian Server uses `resources.json` to describe an API's functionality.  After running the creation script, `resources.json` should look something like this:  

```
{
    "metadata": {
        "name": "My API",
        "version": "0.0.1"
    },
    "resources": {}
}

```

## Creating a resource

Here's a great definition of a resource, more information about which can be found [here](http://restful-api-design.readthedocs.org/en/latest/resources.md).

> A resource is an object with a type, associated data, relationships to other resources, and a set of methods that operate on it.

To define a resource using Obsidian Server, we begin by adding an entry in the `resources` field of `resources.json`.  Each resource definition takes four sets of options: `attributes`, `methods`, `relationships`, and `modules`.

For the purposes of this demonstration, we'll create a `photo` resource.

```
{
    "metadata": {
        "name": "My API",
        "version": "0.0.1"
    },
    "resources": {
        "photo": {
            "attributes": {},
            "methods": {},
            "relationships": {},
            "modules": {}
        }
    }
}
```

## Attributes

For each attribute on a resource, you must specify its `type`.  Additionally, you may specify a default value for the attribute using the `default` field, and you may indicate whether or not the attribute should be indexed (for faster lookups) by setting a boolean on the `index` field.

Acceptable values for the `type` field are: `integer`, `float`, `string`, `boolean`, and `date`.

As an example, we'll add four fields to our `photo` resource: a `caption`, the number of `likes`, a `width`, and a `height`.

```
{
    "metadata": {
        "name": "My API",
        "version": "0.0.1"
    },
    "resources": {
        "photo": {
            "attributes": {
                "caption": {
                    "type": "string",
                    "default": "No Caption"
                },
                "likes": {
                    "type": "integer",
                    "default": 0,
                    "index": true
                },
                "width": {
                    "type": "integer"
                },
                "height": {
                    "type": "integer"
                }
            },
            "methods": {},
            "relationships": {},
            "modules": {}
        }
    }
}
```

All resources contain `createdAt` and `updatedAt` fields (of type `date`) by default. 

## Methods

Methods provide an interface for client applications to operate on your application's resources.

Obsidian Server natively supports four basic operations: `create`, `read`, `update` and `destroy`.  These basic functions can be enabled by (individually) setting their values to `true` in the `methods` field of the parent resource in  `resources.json`.

For the purposes of our demonstration, we'll turn on all four methods.

```
{
    "metadata": {
        "name": "My API",
        "version": "0.0.1"
    },
    "resources": {
        "photo": {
            "attributes": {
                "caption": {
                    "type": "string",
                    "default": "No Caption"
                },
                "likes": {
                    "type": "integer",
                    "default": 0,
                    "index": true
                },
                "width": {
                    "type": "integer"
                },
                "height": {
                    "type": "integer"
                }
            },
            "methods": {
                "create": true,
                "read": true,
                "update": true,
                "destroy": true
            },
            "relationships": {},
            "modules": {}
        }
    }
}
```

To that end, omitting a method will disable it.

## Relationships

Obsidian Server supports one-to-one, one-to-many, and many-to-many relationships between resources.  For configuration instructions, see the [relationships](./relationships.md) documentation.

## Modules

Currently, the only module available is the `user_authentication` module. For more information, consult the [authentication](./authentication.md) reference.

## Using your API

In an ideal situation, you should be able to use one of Obsidian Server's client SDKs to communicate with your application.  When an SDK doesn't exist for a given platform, you can use an HTTP client to access the methods directly.  For more information, see the [API](./API.md) documentation.