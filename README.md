ArrowJS CMS
==================

[![dependencies Status](https://david-dm.org/arrowjs/CMS/status.svg)](https://david-dm.org/arrowjs/CMS)
[![devDependencies Status](https://david-dm.org/arrowjs/CMS/dev-status.svg)](https://david-dm.org/arrowjs/CMS?type=dev)

Join our online chat at [![Gitter](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/trquoccuong/arrowjs)

> Welcome to ArrowJS CMS! ArrowJS CMS is CMS base on ArrowJS framework. By default, we are blog platform support SQL database like Wordpress. We have many features like themes, widget , multi-language, authenticate , Role-base v.v
Our platform is easy to scale to build large system like e-commerce v.v.

Email us if you need any support to build your own business

Thanks.

## Demo Website

[Demo Website](http://cms.arrowjs.io/) 

Default account backend
```
    username: admin@example.com
    password: 123456
```

## Documents

Vietnamese documents:
[http://arrowjs.io](http://arrowjs.io)

English documents will be coming soon.

## Requirements

To run this CMS you need at least:

- Nodejs 4.0.0 or higher


## Install ArrowCMS on fresh VPS

```
    $ bash <(curl -s http://arrowjs.io/install.sh)

```

This bashscript auto install Redis, Postgres for you.

## Installation 

Clone project from github:

```
    git clone https://github.com/arrowjs/CMS.git
```

Go to project folder and install npm packages

```
    cd CMS
    sudo npm install
```
## Configuration

We tested with PostgreSQL and MySQL.
By default, Arrow CMS use PostgreSQL and Redis. If you don't have Redis or PostgreSQL modify the config file :


```
//Database config
//config/database.js
 db: {
        host: 'localhost',    // database host
        port: '5432',         // database port
        database: 'arrowjs',  // database name
        username: 'postgres', // database usename
        password: '',         // database password
        dialect: 'postgres',  // database type 
        logging: false
    },
    
```


```

//Redis cache config
//config/redis.js
redis: {
        host: 'localhost',
        port: '6379',
        type: 'fakeredis'  // if you installed redis, change it to "redis".
    },
    
```

## Run CMS

Start application:

```
    node server.js
```

or

```
    npm start
```

Now application start on port 8000 (default port, you can change it in file config/config.js or configure in server.js).

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
