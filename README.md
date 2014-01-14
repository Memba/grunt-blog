# grunt-blog

> A grunt plugin to organize content and generate indexes for [Memba Mini Blog Engine](http://miniblog.memba.com).

## Overview

This plugin works as a component of [Memba Mini Blog Engine](http://miniblog.memba.com). It performs 3 tasks:
1) Analysing and updating the markdown in all the md files located in the *new* directory,
2) Copying the new updated files in a chronological hierarchy under the *archive* directory,
3) Indexing these files in the form of an RSS file at the root of teh *archive* directory.

__Note: the plugin does not yet handle media files.__

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-blog --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-blog');
```

## The "blog" task

### Overview
In your project's Gruntfile, add a section named `blog` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  blog: {
    options: {
      //configuration
      home: 'http://localhost:63342/Blog/src/www/index.html',
      route: '#/blog/',
      index: 'index.rss',

      //directories to process
      newsRoot: 'new',
      archiveRoot: 'archive',

      //RRS channel: http://www.w3schools.com/rss/rss_channel.asp
      category: 'Web Development',
      //cloud: undefined,
      copyright: 'Copyright (c) 2013-2014 Memba. All rights reserved.',
      description: 'A simple blog engine built around 4 components: (1) markdown content files, (2) a twitter bootstrap layout, (3) an RSS index built by a Grunt task and (4) Javascript widgets to display the markdown files as blog posts and the RSS feed as categorized and chronological indexes. Contrary to Jekyll and other static web site generators, what you write is what you publish.',
      docs: 'http://cyber.law.harvard.edu/rss/',
      generator: 'http://blogengine.memba.com',
      image: undefined, //TODO from Flickr
      language: 'en-US',
      lastBuildDate: d.toISOString(),
      link: 'http://blogengine.memba.com',
      managingEditor: 'Memba',
      pubDate: d.toISOString(),
      rating: undefined,
      //skipDays: undefined,
      //skipHours: undefined,
      //textInput: undefined,
      title: 'Memba Blog Engine',
      ttl: '1440', //24 hours
      webMaster: 'Memba'
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.home
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever.

```js
grunt.initConfig({
  blog: {
    options: {}
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else.

```js
grunt.initConfig({
  blog: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_v0.1.2_ First functional release (more testing/polishing/documenting required though)
