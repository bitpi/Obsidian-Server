![Tendigi Logo](assets/logo.png)
# API

All built-in CRUD methods take one (or both) of the following objects:

* A `criteria` used to select the records that will be manipulated or retrieved.  For more information, see the [query](./querying.html) documentation.
* A `record` used to provide new/updated records with values for their attributes.

### Listing Routes

Obsidian Server includes a command to list all routes exposed by your application.  To see them, run:

```
$ obsidian-server routes
```

The `routes` command generates output in the following format: 

```
Resource `/` exposes the following routes:
┌────────┬──────────┬────────────┐
│ Method │ Resource │ Path       │
├────────┼──────────┼────────────┤
│ GET    │ /        │ /_metadata │
└────────┴──────────┴────────────┘

Resource `/photo` exposes the following routes:
┌────────┬──────────┬──────────┐
│ Method │ Resource │ Path     │
├────────┼──────────┼──────────┤
│ POST   │ /photo   │ /create  │
├────────┼──────────┼──────────┤
│ GET    │ /photo   │ /read    │
├────────┼──────────┼──────────┤
│ PATCH  │ /photo   │ /update  │
├────────┼──────────┼──────────┤
│ DELETE │ /photo   │ /destroy │
└────────┴──────────┴──────────┘
``` 

### Creating Records

To create a `photo` record, we'll `POST` the following JSON body (with the `record` object populated) to `/photo/create`:

```
{
    "record": {
        "caption": "Fun in the sun",
        "width": 640,
        "height": 480
    }
}
```
If the record is created successfully, we'll get a response like this:

```
{
    "_type": "photo",
    "_requestID": "e56db45d-69d0-5270-9c5f-4ecb0531a12b",
    "_requestTimestamp": "2015-06-25T19:33:54.964Z",
    "_responseTimestamp": "2015-06-25T19:33:54.974Z",
    "_data": {
        "caption": "Fun in the sun",
        "width": 640,
        "height": 480,
        "likes": 0,
        "createdAt": "2015-06-25T19:33:54.970Z",
        "updatedAt": "2015-06-25T19:33:54.970Z",
        "id": 1
    }
}
```

Try it yourself using `curl`:

```
$ curl -X "POST" "http://127.0.0.1:8000/photo/create" \
	-H "tendigi-client-key: <your client key>" \
	-H "tendigi-client-secret: <your client secret>" \
	-H "Content-Type: application/json" \
	-d '{ "record": { "caption": "Fun in the sun", "width": 640, "height": 480 }}'
```

### Reading Records

To look the photo record we just created, we'll perform a `GET` request to `/photo/read` with the `criteria[id]` query parameter set. This will yield the following response:

```
{
    "_type": "photo",
    "_requestID": "378e09a6-4f8c-51b8-9ca3-3314a4907239",
    "_requestTimestamp": "2015-06-25T19:43:42.088Z",
    "_responseTimestamp": "2015-06-25T19:43:42.093Z",
    "_data": [
        {
            "caption": "Fun in the sun",
            "width": 640,
            "height": 480,
            "likes": 0,
            "createdAt": "2015-06-25T19:33:54.970Z",
            "updatedAt": "2015-06-25T19:33:54.970Z",
            "id": 1
        }
    ]
}
```

Try it yourself using `curl` (note the URL-encoding of the query string):

```
curl -X "GET" "http://127.0.0.1:8000/photo/read?criteria%5Bid%5D=1" \
	-H "tendigi-client-key: <your client key>" \
	-H "tendigi-client-secret: <your client secret>"
```

To sort records, simply supply the `sort` parameter in your request's query string.  The format for this parameter is `"<field name> { ASC | DESC }"`.  To sort by multiple fields, separate sort descriptors by a comma.  In the context of our example, we'd sort our photos from most-liked to least-liked with the following request:

```
GET /photo/read?sort=likes+DESC
```

Obsidian Server also supports pagination.  To paginate the records returned, simply provide _both_ the `pagination[page]` and `pagination[limit]` parameters in your request's query string.  **The `pagination[page]` index is 1-based.**  Doing so yields a request like this:

```
GET /photo/read?pagination[page]=1&pagination[limit]=25
```


### Updating Records

To update a photo record, we'll `PATCH` to `/photo/update` with a JSON object containing both `criteria` and `record` objects.

```
{
    "record": {
        "caption": "A new caption!"
    },
    "criteria": {
        "id": 1
    }
}
```

If the record is updated successfully, we'll get a response like this:

```
{
    "_type": "photo",
    "_requestID": "09e409ba-2b18-5694-b2cb-88e0f0d1a6b9",
    "_requestTimestamp": "2015-06-25T19:50:56.914Z",
    "_responseTimestamp": "2015-06-25T19:50:56.929Z",
    "_data": [
        {
            "caption": "A new caption!",
            "width": 640,
            "height": 480,
            "likes": 0,
            "createdAt": "2015-06-25T19:33:54.970Z",
            "updatedAt": "2015-06-25T19:50:56.917Z",
            "id": 1
        }
    ]
}
```

Try it yourself using `curl`:

```
curl -X "PATCH" "http://127.0.0.1:8000/photo/update" \
	-H "tendigi-client-key: <your client key>" \
	-H "tendigi-client-secret: <your client secret>" \
	-H "Content-Type: application/json" \
	-d '{ "record": { "caption": "A new caption!" }, "criteria": { "id" : 1 } }'
```

### Destroying Records

To destroy a photo record, we'll `DELETE` to `/photo/destroy` with the `criteria[id]` query parameter set.  If the request succeeds, you'll get a response that includes the records that were deleted.

```
{
    "_type": "photo",
    "_requestID": "4ee28978-e3e3-57ad-8ba0-5af1bf14634c",
    "_requestTimestamp": "2015-06-25T19:58:11.152Z",
    "_responseTimestamp": "2015-06-25GET"T19:58:11.165Z",
    "_data": [
        {
            "caption": "A new caption!",
            "width": 640,
            "height": 480,
            "likes": 0,
            "createdAt": "2015-06-25T19:33:54.970Z",
            "updatedAt": "2015-06-25T19:50:56.917Z",
            "id": 1
        }
    ]
}
```

Try it yourself using curl (note the URL-encoding of the query string):

```
curl -X "DELETE" "http://127.0.0.1:8000/photo/destroy?criteria%5Bid%5D=1" \
	-H "tendigi-client-key: <your client key>" \
	-H "tendigi-client-secret: <your client secret>"
```
