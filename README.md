ArrowJS CMS
==================

Welcome to ArrowJS CMS! ArrowJS CMS is CMS base on ArrowJS framework, it helps you build your web application easier.

Please write us if you have any feedback.

Thanks.
## Documents

Vietnamese documents:
[http://arrowjs.io](http://arrowjs.io)

## Requirements

To run this CMS you need at least:
- Nodejs 4.0.0
- PostgreSQL 9.4 or higher ([http://www.postgresql.org/](http://www.postgresql.org/))
- Redis server. ([http://redis.io/](http://redis.io/))

If you have new VPS, you can auto install ArrowCMS with one command line :

```
    $ curl http://arrowjs.io/install.sh | sh
```

## Installation

Clone project from github:

```
    git clone https://github.com/TechMaster/ArrowCMS.git
```

Then you'll need to create the database from backup file:

```
    cd arrowjs-cms
    pg_restore -U [username] -d [dbname] "sql/arrowjs.backup"
    # [username]: user for database postgres
    # [dbname]: database name to restore (default is arrowjs)
```

## Run CMS

Go to project folder and start application:

```
    cd arrowjs-cms
    node server.js
```

Now application start on port 3333 (default port, you can change it in file config).

Admin account for backend (with URL /admin/login):

```
    username: admin
    password: 123456
```
You must change it after login for secure account.

## License

The MIT License (MIT)

Copyright (c) 2015 ArrowJS CMS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.