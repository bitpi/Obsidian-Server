![Tendigi Logo](assets/logo.png)
# Relationships

Parmigiana supports associations between resources, and it is possible to create associations between resources that live in different data stores.  

## Defining Associations

Two types of resource relationships are supported: `has_one` and `has_many`.  

Relationship definitions require three parameters— a `name`, a `type`, and a `resource`.  If the relationship is reflexive, you must populate the `target_relationship` field so the ORM knows which keys refer to the same relationships. Consider this definition:

```
{
	...
	
    "resources": {
        "house": {
        
        	...
        
            "attributes": {
                "address": {
                    "type": "string"
                }
            },
            "relationships": {
                "owner": {
                    "resource": "user",
                    "type": "has_one",
                    "target_relationship": "houses"
                }
            }
            
            ...
            
        },
        "user": {
        
        	...
                
            "relationships": {
                "houses": {
                    "resource": "house",
                    "type": "has_many",
                    "target_relationship": "owner"
                }
            }
            
            ...
            
        }
    }
    
    ...
    
}
```

The above definition indicates that a user has a one-to-many relationship (named "houses") to the house resource.  Furthermore, it also indicates that each house has a relationship back to its owner.

## Saving Associations

Parmigiana does **not** provide any implicit saving of associations.  To assign a relationship during a create or update operation, pass the `id` of the record in question.  For example, to create a `house` and assign it to the `user` whose `id` is **1**, we would `POST` to `/house/create` with the following body:

```
{
    "record": {
        "address": "1515 Broadway, New York, New York 10036",
        "owner": 1
    }
}
```

## Querying Associations

To query for all the houses owned by a specific `user`, we'd simply construct a `criteria` with the `owner` key set to the user's `id`.  That criteria would then be passed to the `house` resource's `read` endpoint.  For more information on querying, see the [resources](./resources.md) documentation, as well as the [API](./API.md) documentation.

## Populating Associations

By default, the `read` method on a resource that contains `has_one` relationships will not automatically populate those relationships.  To recieve fully-populated objects instead of `id` references, pass the names of the relationships you'd like to populate in the `include` field of the query string.

To see the users associated with each `house` at lookup time, we'd issue a request like this:

```
GET /house/read?include[]=owner
```