# Tweakpane plugin Search list
This is a plugin template of an input binding for [Tweakpane][tweakpane].

add searchable select list for tweakpane.

### Install

```bash
npm i tweakpane-plugin-search-list
# or
yarn add tweakpane-plugin-search-list
```

### Usage

```js
import Tweakpane from 'tweakpane';
import 'tweakpane-plugin-search-list';

const pane = new Tweakpane();
const data = { language: 'JavaScript' };
pane.addInput(data, 'language', {
  // use search-list
  view: 'search-list',
  options: {
    JavaScript: 'JavaScript',
    TypeScript: 'TypeScript',
    Java: 'Java',
    Go: 'Go',
    Dart: 'Dart',
    'C++': 'C++',
    'Object C': 'Object C',
    'C#': 'C#',
    Python: 'Python'
  }
});
// ...
```

### Options

```js
pane.addInput(data, 'field', {
  view: 'search-list',
  options: {
    // ...
  },
  noDataText: 'no data',
  debounceDelay: 250,
})
```

| param         | description                                                 | type   | default   |
|---------------|-------------------------------------------------------------|--------|-----------|
| noDataText    | text to show if no options matched                          | string | 'no data' |
| debounceDelay | delay time to apply on lodash.debounce, for debounce search | number | 250       |

[tweakpane]: https://github.com/cocopon/tweakpane/
