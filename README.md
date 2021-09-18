# Tweakpane plugin Search list


![version](https://badge.fury.io/js/tweakpane-plugin-search-list.svg)

This is a plugin template of an input binding for [Tweakpane][tweakpane].

add searchable select list for tweakpane.

required version `tweakpane@3.x`

### Install

```bash
npm i tweakpane-plugin-search-list
# or
yarn add tweakpane-plugin-search-list
```

### Usage

```js
import { Pane } from 'tweakpane';
import TweakpaneSearchListPlugin from 'tweakpane-plugin-search-list';

const pane = new Pane();
pane.registerPlugin(TweakpaneSearchListPlugin)

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

### CSS variables

```css
:root {
  --tp-plugin-select-box-bg-color: --input-background-color;
  --tp-plugin-select-no-data-color: #fff;
  --tp-plugin-select-option-bg-hover: rgb(129, 129, 129);
}
```

[tweakpane]: https://github.com/cocopon/tweakpane/
