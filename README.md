<a href="http://manifold.umn.edu/">
    <img width="150" src="http://manifold.umn.edu/logo/manifold_avatar-01.png" alt="Manifold Scholarship" />
</a>

## Build Status

Branch       | Passing?
------------ | -------------
Development  | [![Build Status](https://travis-ci.org/ManifoldScholar/manifold.svg?branch=development)](https://travis-ci.org/ManifoldScholar/manifold-api)
Master       |[![Build Status](https://travis-ci.org/ManifoldScholar/manifold.svg?branch=master)](https://travis-ci.org/ManifoldScholar/manifold-api)

# Manifold
Manifold is an intuitive, collaborative platform for scholarly publishing. With iterative texts, powerful annotation tools, rich media support, and robust community dialogue, Manifold transforms scholarly publications into living digital works.

## About the Project

The [University of Minnesota Press](https://www.upress.umn.edu) in partnership with the [GC Digital Scholarship Lab](https://gcdsl.commons.gc.cuny.edu/) at the [Graduate Center](http://www.gc.cuny.edu/Home) of the [City University of New York](http://cuny.edu) has been awarded [a $732,000 grant](https://mellon.org/grants/grants-database/grants/university-of-minnesota-at-twin-cities/11500644/) from the [Andrew W. Mellon Foundation](https://mellon.org) to launch [Manifold Scholarship](http://manifold.umn.edu). The development of Manifold is performed by [Cast Iron Coding](http://castironcoding.com), a digital development agency in Portland, Oregon.

## Open Development

Our ultimate goal is to build an open source tool that other university presses will use. To that end, we want to hear from our prospective users throughout the design and development process. To participate in the discussion, join us on our [Building Manifold Development Blog](http://manifold.umn.edu). As we proceed with this project, we'll be using a [Pivotal Tracker project](https://www.pivotaltracker.com/n/projects/1457560) to plan our sprints.

## Manifold API

Manifold API is the server-side component of Manifold. It is currently being actively developed and should be considered pre-alpha.

While there may be parts of this API that will become stand-alone components, it is primarily intended to serve as a backend server for the Manifold frontend and admin interfaces, which are in separate repositories.

## Features

* Strategies for parsing EPUB3 documents and storing their content, resources, and metadata in a relational database
* Expose EPUB structure and content via a RESTful API
* Extracts all source document assets and persists them in storage layer (Filesystem, S3, etc.)
* Maintains internal structure and links in documents
* Idempotent import allows source documents to be updated without losing associated data

### Planned Features

* Additional text ingestion strategies: EPUB2, Markdown
* OAuth2 Authentication
* Storage and APIs for text annotations, comments, and assets

## Requirements

* Postgres Database
* Ruby 2.2.2

## Installation

The following instructions assume that you have Ruby 2.2.2 installed, a working Bundler executable, and a Postgres database.

**Before doing anything:**

- Ensure that /opt/boxen/config/nginx/sites/manifold-api.conf doesn't exist.
- Ensure that you have Intellij 15 with these JetBrains plugins: Ruby, NodeJS
- Ensure that you don't have an existing ~/src/manifold dir. Get rid of ~/src/manifold-api if you have it.

**First, setup Ruby and Gems.**

```
boxen manifold
cd ~/src/manifold

# Confirm that you're using Ruby 2.2.3
ruby -v
gem install bundler

# Confirm that rails is at ./bin/rails
cd api && which rails
bundle install
rbenv rehash
```

**Then setup your NPM modules**

```
cd ~/src/manifold/client
npm install
```

**Then setup the rails DB and ingest some texts**

```
cd ~/src/manifold/api
rake db:migrate
rails g manifold:install

# There's a spring + rake issue that hasn't been fixed yet.
spring stop && rake ingest:specpubs
```

**Open the project in your IDE**

- Open intellij. Click "open" and open the manifold directory.
- Start the client and API servers

## Text Ingestion

```bash
# Ingest one text, log level debug
rake ingest:text['relative/path/to/text','debug']
# Ingest all texts in "epubs" folder in project root
rake ingest:batch['debug']
```
## API Docs

Detailed API docs coming soon, it's very much a work in progress right now. In the meantime, try these:

```bash
curl -O ./texts.json http://localhost:3001/api/v1/texts.json
curl -O ./texts.json http://localhost:3001/api/v1/texts/1.json
```
