
# zliq-native

## [ZLIQ](https://faboweb.github.io/zliq/)

Router for the light zliq-framework.

## Quickstart
To use ZLIQ in your project, first install it as an dependency:
```bash
$ npm install --save zliq zliq-native
```

Then initialize the router which hooks into document events
```js
import {h, render} from 'zliq';
import {initRouter} from 'zliq-native';

let router$ = initRouter()

let app = <div>
        <a href="/route?param=value#anchor" />
    </div>;
render(app, document.querySelector('#app');

// Will be '/route {param: 'value'} anchor after click on link
router$.map(({route, params, anchor}) => console.log(route, params, anchor))

```

To route you could switch on route values.
```js
let router$ = initRouter()

let app = <div>
        <a href="/route?param=value#anchor" />
        {
            if$(router$.$('route').is('route'),
                <h1>Subpage</h1>,
                <h1>Titel</h1>)
         )
        }
    </div>;
render(app, document.querySelector('#app');
```

Or you use the Router component. The component also registers its route so we can fallback to '/' on missing route.
We can also add a '/404' route that gets triggered on a missing route if available.
```js
import {h, render} from 'zliq';
import {initRouter, Router} from 'zliq-native';

let router$ = initRouter()

let app = <div>
        <a href="/route?param=value#anchor" />
        <Router router$={router$} route='/'>
            <h1>Titel</h1>
        </Router>
        <Router router$={router$} route='/route'>
            <h1>Subpage</h1>
        </Router>
    </div>;
render(app, document.querySelector('#app');
```

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[dependencyci-badge]: https://dependencyci.com/github/faboweb/zliq/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/faboweb/zliq
[version-badge]: https://img.shields.io/npm/v/zliq.svg?style=flat-square
[package]: https://www.npmjs.com/package/zliq
[downloads-badge]: https://img.shields.io/npm/dm/zliq.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=zliq
[license-badge]: https://img.shields.io/npm/l/zliq.svg?style=flat-square
[license]: https://github.com/faboweb/zliq/blob/master/LICENSE
[github-watch-badge]: https://img.shields.io/github/watchers/faboweb/zliq.svg?style=social
[github-watch]: https://github.com/faboweb/zliq/watchers
[github-star-badge]: https://img.shields.io/github/stars/faboweb/zliq.svg?style=social
[github-star]: https://github.com/faboweb/zliq/stargazers
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/zliq/lib/zliq.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/zliq/lib/zliq.js?label=size&style=flat-square
[tiny-gzip-badge]: http://img.badgesize.io/https://unpkg.com/zliq/lib/zliq.min.js?compression=gzip&label=gzip%20size&style=flat-square
[tiny-size-badge]: http://img.badgesize.io/https://unpkg.com/zliq/lib/zliq.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/zliq/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-es%20umd-green.svg?style=flat-square

Logo based on: http://www.iconsfind.com/2015/11/25/candy-dessert-food-sweet-baby-icon/
