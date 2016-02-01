
![Tendigi Logo](assets/logo.png)
# Querying

## Available Criteria Modifiers

The following modifiers are available for use in `criteria` objects (see [resources](./resources.html) documentation):

* `'<'` (less than)
* `'<='` (less than or equal)
* `'>'` (greater than)
* `'>='` (greater than or equal)
* `'!'` (not)
* `'like'`
* `'contains'`
* `'startsWith'`
* `'endsWith'`

## Usage

Considering the resource example in the [resources](./resources.html) documentation, we'll aim to query for photos with more than 100 likes.

To `update` photos with _exactly_ 100 likes, we can send the following body in the request to `PATCH /photo/update/`:

```
{
    "record": {
        "caption": "I'm really popular!"
    },
    "criteria": {
        "likes": 100
    }
}
```

To query for records with *at least* 100 likes, we can modify the body to look like this:

```
{
    "record": {
        "caption": "I'm really, really popular!"
    },
    "criteria": {
        "likes": {
        	">=": 100
        }
    }
}
```



