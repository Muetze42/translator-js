# TranslatorJs

JavaScript (JSON) Translator based on [Laravel™ Translator](https://laravel.com/docs/localization).
The Translator supports variables (optional with first charakter uppercase or complete uppercase) and pluralization.

## Installation

Using PNPM

```shell
pnpm add -D @norman-huth/translator-js
```

Using NPM

```shell
npm i -D @norman-huth/translator-js
```

---

## Contents

* [Example](#example)
* [Usage](#usage)
  * [Simple VanillaJs](#simple-vanillajs)
  * [Laravel™ Inertia.js](#laravel-with-inertiajs)
    * [Vue.js / React / VanillaJs etc](#vuejs--react--vanillajs-etc)
      * [Vue.js](#vuejs)
    * [Optional: TypeScript](#optional-typescript)
    * [Optional: ESLint](#optional-eslint)
* [Digging Deeper](#digging-deeper)
  * [The Translator Constructor](#the-translator-constructor)
  * [`Translator.setTranslations()`](#translatorsettranslations)
  * [`Translator.setLocale()`](#translatorsetlocale)
  * [`Translator.bootstrap()`](#translatorbootstrap)
  * [Example: Other Inertia.js Share Key](#example-other-inertiajs-share-key)

## Example:

Example JSON-File with translations:

```json
{
  "Hello": "Hallo",
  "Welcome, :name": "Willkommen :name",
  "Good morning :name": "Guten Morgen :Name",
  "Good evening :name": "Guten Abend :NAME",
  "There is one apple|There are many apples": "Hay una manzana|Hay muchas manzanas",
  "apples": "{0} There are none|[1,19] There are some|[20,*] There are many",
  "minutes_ago": "{1} :value minute ago|[2,*] :value minutes ago"
}
```

| Usage                                                          | Result              | Note    |
|----------------------------------------------------------------|---------------------|---------|
| `trans('Hello')`                                               | Hallo               |         |
| `trans('Welcome, :name', {name: 'Norman'})`                    | Willkommen Norman   |         |
| `trans('Good morning :name', {name: 'norman'})`                | Guten Morgen Norman | `:Name` |
| `trans('Good evening :name', {name: 'norman'})`                | Guten Abend NORMAN  | `:NAME` |
| `trans_choice('There is one apple\|There are many apples', 1)` | Hay una manzana     |         |
| `trans_choice('There is one apple\|There are many apples', 5)` | Hay muchas manzanas |         |
| `trans_choice('apples', 0)`                                    | There are none      |         |
| `trans_choice('apples', 12)`                                   | There are some      |         |
| `trans_choice('apples', 22)`                                   | There are many      |         |
| `trans_choice('minutes_ago', 1, {value: 1})`                   | 1 minute ago        |         |
| `trans_choice('minutes_ago', 5, {value: 5})`                   | 5 minutes ago       |         |

## Usage

### Simple VanillaJs

```javascript
import Translator from '@norman-huth/translator-js'

const Trans = new Translator()

return Trans.trans('Hello')
```

Or create alternativ an "empty" instance:

```javascript
Translator.factory()
Translator.factory(translations)
```

### Laravel™ with Inertia.js

Share the App JSON-Translations via `HandleInertiaRequests` middleware.

```php
class HandleInertiaRequests extends Middleware
{
    // --

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'translations' => $this->jsonTranslations(),
        ];
    }

    /**
     * Load the messages for the given locale.
     */
    protected function jsonTranslations(): array
    {
        return app('translator')
            ->getLoader()
            ->load(app()->getLocale(), '*', '*');
    }
}
```

#### Vue.js / React / VanillaJs etc

Add the Translator to the `/resources/js/bootstrap.{js|ts}`.
This example add the alias `__()` for `trans()`. This makes it possible to use `trans()` or `__()` for translation well
as in Laravel™.

```javascript
import Translator from '@norman-huth/translator-js'

const JsonTranslator = new Translator()

window.__ = function(key, replace = {}) {
  return JsonTranslator.trans(key, replace)
}
window.trans = function(key, replace = {}) {
  return JsonTranslator.trans(key, replace)
}
window.trans_choice = function(key, number, replace = {}) {
  return JsonTranslator.trans_choice(key, number, replace)
}
```

TypeScript:

```javascript
//...
window.__ = function(key: string, replace = {}) {
  return JsonTranslator.trans(key, replace)
}
window.trans = function(key: string, replace = {}) {
  return JsonTranslator.trans(key, replace)
}
window.trans_choice = function(key: string, number: number, replace = {}) {
  return JsonTranslator.trans_choice(key, number, replace)
}
```

##### Vue.js

To have the functions also available in the `<template>`, edit the `/resources/js/app.{js|ts}` and add the functions as
mixin:

```javascript
createInertiaApp({
  //...
  setup({ el, App, props, plugin }) {
    return createApp({ render: () => h(App, props) })
      .use(plugin)
      .mixin({
        methods: {
          __: function(key, replace = {}) {
            return __(key, replace)
          },
          trans: function(key, replace = {}) {
            return trans(key, replace)
          },
          trans_choice: function(key, number, replace = {}) {
            return trans_choice(key, number, replace)
          }
        }
      })
      .mount(el);
  },
  //...
})
```

TypeScript:

```javascript
//..
__: function(key: string, replace = {}) {
  return __(key, replace)
},
trans: function(key: string, replace = {}) {
  return trans(key, replace)
},
trans_choice: function(key: string, number: number, replace = {}) {
  return trans_choice(key, number, replace)
}
```

##### Optional: TypeScript

Extend the `/resources/js/types/global.d.ts` file.

```typescript
//...
const JsonTranslator = new Translator()
const __ = (key: string, replace = {}) => {
  return JsonTranslator.translator(key, replace)
}
const trans = (key: string, replace = {}) => {
  return JsonTranslator.translator(key, replace)
}
const trans_choice = (key, number, replace = {}) => {
  return JsonTranslator.trans_choice(key, number, replace)
}

declare global {
  interface Window {
    axios: AxiosInstance;
    __: typeof __
    trans: typeof trans
    trans_choice: typeof trans_choice
  }

  let __ = function(key: string, replace = {}) {
    return JsonTranslator.trans(key, replace)
  }
  let trans = function(key: string, replace = {}) {
    return JsonTranslator.trans(key, replace)
  }
  let trans_choice = function(key, number, replace = {}) {
    return JsonTranslator.trans_choice(key, number, replace)
  }
  //..
}

// And for Vue.js <template>
declare module 'vue' {
  interface ComponentCustomProperties {
    // ...
    __: typeof __
    trans: typeof trans
    trans_choice: typeof trans_choice
  }
}
```

##### Optional: ESLint

`.eslintrc.cjs`

```javascript
module.exports = {
  globals: {
    __: true,
    trans: true,
    trans_choice: true,
  },
}
```

---

### Digging Deeper

The locale is only used from the pluralizer.

#### The Translator Constructor

This script is oriented towards Inertia.js and determines the translation from the JSON (`{"translations": {}}`) of
the `data-page` attribute in the `div id="app".` and the locale by `<html lang="en">` tag.
By default the class bootstrap the translations data.

The Constructor with defaults:

```javascript
constructor(
  prop: string = 'translations',
  elementId: string = 'app',
  dataAttribute: string = 'page',
  locale: string | null = null,
  translations: Translations | null = null,
  bootstrap: boolean = true
)
```

| Argument      | Default      | Description                                                  |
|---------------|--------------|--------------------------------------------------------------|
| prop          | translations | The page props key with the translations                     |
| elementId     | app          | The ID of the described div                                  |
| dataAttribute | page         | The div data-* attribute                                     |
| locale        | `null`       | Initialize the class with locale (override on bootrap)       |
| translations  | `null`       | Initialize the class with translations (override on bootrap) |
| bootstrap     | `true`       | Bootrap the translations' data.                              |

#### Translator.setTranslations

Manually set the translations.

```javascript
Translator.setTranslations(
  { "Foo": "Bar" }
)
```

#### Translator.setLocale

Manually set the locale.

```javascript
Translator.setLocale('en')
```

#### Translator.bootstrap

Bootrap the translations' data (again).

```javascript
Translator.bootstrap()
```

#### Example: Other Inertia.js Share Key

Change the array for the translations.

```php
class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'app' => [
                'translations' => $this->jsonTranslations(),
            ],
        ];
    }
}
```

Set nested array by using "dot" notation in the Translator script:

```javascript
import Translator from '@norman-huth/translator-js'

const JsonTranslator = new Translator('app.translations')
```
