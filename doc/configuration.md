![Tendigi Logo](assets/logo.png)
# Configuration

## Environments

Obsidian Server uses `environment.json` to store environment-specific variables used by Obsidian Server itself, installed modules, and any custom behavior implemented by the user.  

After running `$ obsidian-server new`, `environment.json` should look something like this:

```
{
    "config": {
        "server": {
            "host": "0.0.0.0",
            "port": 8000
        },
        "db": {
            "type": "file",
            "options": {
                "directory": "./db/"
            }
        }
    },
    "modules": {},
    "custom": {}
}
```

## HTTP Server Configuration

The `server` configuration object accepts two configuration options: a `host` and a `port`.  The `host` option provides the HTTP server with its listener interface, and the `port` option specifies the port.  To listen on all interfaces, specify `0.0.0.0` as the `host`.  Unless Obsidian Server is running as root (which it shouldn't be), you'll have to specifiy a port greater than 1024, as the first 1024 ports are reserved. **If the** `port` **option is unspecified, Obsidian Server will attempt to obtain its port from** `$PORT`.

## Database Configuration

Obsidian Server aims to support interchangable database backends, configurable in `environment.json`.  PostgreSQL is (currently) the only supported production database, but the underlying adapter system (based on [Waterline](https://github.com/balderdashy/waterline)) supports a variety of datastores.

### PostgreSQL

The PostgreSQL adapter takes three options: a `url`, a boolean indicating whether connection pooling should be used, and a boolean indicating whether or not `ssl` should be used.  The `db` entry in the `config` object of `environment.json` would therefore look something like this:

```
{
    "db": {
        "type": "postgres",
        "options": {
            "url": "postgres://username@127.0.0.1/",
            "pool": false,
            "ssl": false
        }
    }
}
```

** If the ** `url` ** option is not specified, Obsidian Server will attempt to obtain its PostgreSQL URL from ** `$POSTGRES_URL`.

Obsidian Server also has support for automatic database migrations.  Run `$ obsidian-server --help` to see the available migration strategies.

### Local Files

For development purposes, Obsidian Server also supports the `file` database adapter.  Instead of communicating with actual databases, the ORM will store your data in JSON files.  This is useful for developers who don't necessarily want to set up databases on their personal machines, and it is particularly handy for instances in which a developer needs to transfer the state of his local machine to  someone else's.

The only configuration option for the `file` adapter is a `directory`.  Obsidian Server will automatically place JSON files in this directory.

For example:

```
{
    "db": {
        "type": "file",
        "options": {
            "directory": "./db/"
        }
    }
}
```
## Module Configuration

Some modules may require their own configuration entries.  If a module's documentation calls for this, its options can be placed in under a key named after the module in the `modules` section of `environment.json`.

## Custom Configuration

Any configuration needed for application-specific custom methods goes here.  It will be made available to your method definitions at runtime.
