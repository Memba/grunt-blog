# grunt-blog

> A grunt plugin to organize content and generate indexes for [Memba Mini Blog Engine](http://miniblog.memba.com).

## Overview

This plugin works as a component of [Memba Mini Blog Engine](http://miniblog.memba.com). It performs 3 tasks:
1. Analysing and updating the markdown in all the md files located in the *new* directory,
2. Copying the new updated files in a chronological hierarchy under the *archive* directory,
3. Indexing these files in the form of an RSS file at the root of teh *archive* directory.

*Note: the plugin does not yet handle media files.*

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-blog --save-dev
```

Once the plugin has been installed, it may be enabled inside your project's Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-blog');
```

add configured bt adding a section named `blog` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  blog: {
    options: {
      //
      //Web site options
      home: '...',
      route: '...',
      index: '...',
      //
      //File options
      newsRoot: '...',
      archiveRoot: '...',
      //
      //RSS options
      category: '...',
      copyright: '...',
      description: '...',
      docs: '...',
      generator: '...',
      image: '...',
      language: '...',
      lastBuildDate: '...',
      link: '...',
      managingEditor: '...',
      pubDate: '...',
      rating: '...',
      title: '...',
      ttl: '...',
      webMaster: '...'
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

## The "blog" task configuration

### Web site Options

#### options.home
Type: `String`
Default value: `'http://miniblog.memba.com'`

The home of your blog where index.html can be reached.

#### options.route
Type: `String`
Default value: `'#/blog/'`

The route .

#### options.index
Type: `String`
Default value: `'index.rss'`

A string value that is used to do something else with whatever else.

### File options

#### options.news
Type: `String`
Default value: `'news'`

A string value that is used to do something else with whatever else.

#### options.archive
Type: `String`
Default value: `'archive'`

A string value that is used to do something else with whatever else.

### RSS Options

For more information, see http://www.w3schools.com/rss/rss_channel.asp.

#### options.category
Type: `String`
Default value: `'Web Development'`

The category the RSS channel belongs to. Also used as default category for items.
See http://www.w3schools.com/rss/rss_tag_category_channel.asp
See http://www.w3schools.com/rss/rss_tag_category_item.asp

*Note: There can only be one category at this stage.*

#### options.copyright
Type: `String`
Default value: `'Copyright (c) 2013-2014 Memba. All rights reserved.'`

A string value that is used to do something else with whatever else.
http://www.w3schools.com/rss/rss_tag_copyright.asp

#### options.description
Type: `String`
Default value: `'A simple blog engine built around 4 components: (1) markdown content files, (2) a twitter bootstrap layout, (3) an RSS index built by a Grunt task and (4) Javascript widgets to display the markdown files as blog posts and the RSS feed as categorized and chronological indexes. Contrary to Octopress and other static web site generators, what you write is what you publish.'`

A string value that is used to do something else with whatever else.

#### options.docs
Type: `String`
Default value: `'http://cyber.law.harvard.edu/rss/'`

A string value that is used to do something else with whatever else.

#### options.generator
Type: `String`
Default value: `'http://miniblog.memba.com'`

A string value that is used to do something else with whatever else.

#### options.image
Type: `String`
Default value: `undefined`

A string value that is used to do something else with whatever else.

#### options.language
Type: `String`
Default value: `'en-US'`

A string value that is used to do something else with whatever else.

#### options.lastBuildDate
Type: `Date`
Default value: `new Date().toISOString()`

A string value that is used to do something else with whatever else.

#### options.link
Type: `String`
Default value: `'http://miniblog.memba.com'`

A string value that is used to do something else with whatever else.

#### options.managingEditor
Type: `String`
Default value: `'Memba'`

A string value that is used to do something else with whatever else.

#### options.pubDate
Type: `Date`
Default value: `new Date().toISOString()`

A string value that is used to do something else with whatever else.

#### options.rating
Type: `String`
Default value: `undefined`

A string value that is used to do something else with whatever else.

#### options.title
Type: `String`
Default value: `'Memba Mini Blog Engine'`

A string value that is used to do something else with whatever else.

#### options.ttl
Type: `String`
Default value: `'1440'`

A string value that is used to do something else with whatever else.

#### options.webMaster
Type: `String`
Default value: `'Memba'`

A string value that is used to do something else with whatever else.

### Usage Example

In this example, we show you the typical configuration you should be considering in your project.

```js
grunt.initConfig({
  blog: {
    options: {
          home: 'http://yoursite/blog/index.html', //The path to your Mini Blog Engine
          newsRoot: 'new', //your news directory
          archiveRoot: 'archive', //your archive directory
          title: 'Your title for your RSS channel',
          link: 'http://yoursite',
          description: 'Your description for your RSS channel',
          copyright: 'Copyright (c) 2013-2014 You. All rights reserved.',
          category: 'Web Development', //The default category for your blog posts
          managingEditor: 'The default author for your blog posts',
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_v0.1.2_ First functional release (more testing/polishing/documenting required though)
