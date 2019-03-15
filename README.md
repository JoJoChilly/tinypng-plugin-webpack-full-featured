# Tinypng Plugin for Webpack [Full Featured]

[![npm](https://img.shields.io/npm/v/tinypng-plugin-webpack-full-featured.svg)](https://www.npmjs.com/package/tinypng-plugin-webpack-full-featured)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Coverage Status](https://coveralls.io/repos/github/JoJoChilly/tinypng-plugin-webpack-full-featured/badge.svg?branch=master)](https://coveralls.io/github/JoJoChilly/tinypng-plugin-webpack-full-featured?branch=master)

This is a simple plugin that uses [Tinypng](https://tinypng.com/) to compress images in your project.

## Install

`npm install tinypng-plugin-webpack-full-featured`

## Example Usage

```js
const TinypngPlugin = require('tinypng-plugin-webpack-full-featured');

module.exports = {
    plugins: [
        new TinypngPlugin({
            from: path.resolve(__dirname, '../static/images'),
            extentions: ['png', 'jpeg', 'jpg'],
            silent: false,
            cache: true,
        }),
    ],
};
```

Working with [copy-webpack-plugin](https://github.com/kevlened/copy-webpack-plugin):

```js
module.exports = {
    plugins: [
        new TinypngPlugin({
            from: path.resolve(__dirname, '../static/images'),
            extentions: ['png', 'jpeg', 'jpg'],
            silent: false,
            cache: true,
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: path.resolve(__dirname, '../dist/static'),
                ignore: ['.*'],
            },
        ]),
    ],
};
```

_Note the order of the plugins matters. If you want to compress before, the `from` option should be the original path. But if you want it after, this `from` option should be the destination path._

## API

### new TinypngPlugin(options)

#### options.disable

**type**: `Boolean`
**default**: `false`

If we are not in production mode, we may not want to compress images.

```js
module.exports = {
    plugins: [
        new TinypngPlugin({
            from: path.resolve(__dirname, '../static/images'),
            extentions: ['png', 'jpeg', 'jpg'],
            silent: false,
            cache: true,
            disable: process.env.NODE_ENV !== 'production',
        }),
    ],
};
```

#### options.from (`required`)

**type**: `String`
**default**: `{your project}`

The directory to compress images. Currently, we only dig 2 levels, which means `{your project}/**.png` and `{your project}/**/**.png`.

#### options.extentions

**type**: `Array`
**default**: `['png', 'jpeg', 'jpg']`

Passes image type. Types like `.gif` or `.svg` is not supported.

#### options.silent

**type**: `Boolean`
**default**: `false`

Whether we show compressing result or not.

#### options.cache

**type**: `Boolean`
**default**: `true`

We use filepath and size to distinct images status. If we set it to false, images will always be compressed.

#### options.cacheLocation

**type**: `String`
**default**: `{your project}/node_modules/tinypng-plugin-webpack-full-featured/dict`

Location we save cache. If we set it to node_modules, team members would compress images again and again. So it is **recommended** that we set it to somewhere git included.

## FAQ

**Why?**
I was suprised that there weren't any Tinypng plugins for webpack which fit my request, so I made one!

**Why not use [tinypng-webpack-plugin](https://www.npmjs.com/package/tinypng-webpack-plugin)?**
Because the images need to preceed is not in webpack assets. And it is quite slow.

**Why not use [tinypng-loader](https://www.npmjs.com/package/tinypng-loader)?**
Because it is lack of silence option and it cannot proceed images not in webpack assets as well.

**Can you add this new feature?**
Sure. If the feature make sense, I would add it. And please understand that I need to keep it simple, so not all feature would be proved.

## Inspiration

-   Many thanks to [tinypng-webpack-plugin](https://www.npmjs.com/package/tinypng-webpack-plugin), [tinypng-loader](https://www.npmjs.com/package/tinypng-loader) and [imagemin-webpack-plugin](https://github.com/Klathmon/imagemin-webpack-plugin).

## Contributing

-   The code is written in ES6 using [Javascript Standard Style](https://github.com/feross/standard).
-   Please have PRs be single-purpose and try to stick to the coding style that the plugin uses.
-   Keep new features easily testable.
-   Documentation PRs are more than welcome! I'm really bad at words and things, so any improvement there is always a good thing!

## License

[MIT](LICENSE.md) Copyright (c) [Joan Qin](https://github.com/JoJoChilly)
