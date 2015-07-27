'use strict';
/*jshint browser: true*/
var utils = require('big-collection/test/utils');
utils['expect.js'] = require('expect.js');
utils['big-collection-view'] = require('./../index');

var State = utils['ampersand-state'] = require('ampersand-state');
var View = utils['ampersand-view'] = require('ampersand-view');
var Collection = utils['ampersand-collection'] = require('ampersand-collection');

var FixtureState = State.extend({
  props: {
    thing: 'string'
  }
});

var FixturesCollection = Collection.extend({
  model: FixtureState,
  mainIndex: 'thing',
  // comparator: 'thing'
});
utils.FixturesCollection = FixturesCollection;

function makeFixture(count, Model) {
  var items = [];
  for (var i = 0; i < count; i++) {
    if (Model) {
      items.push(new Model({thing: 'thing'+ (i+1)}));
    }
    else {
      items.push({thing: 'thing'+ (i+1)});
    }
  }
  return items;
}

utils.fixtureModels = makeFixture(400);

var ItemView = View.extend({
  template: '<div></div>',
  bindings: {
    'model.thing': {
      type: 'text'
    }
  }
});

utils.ItemView = ItemView;

var bigCollectionRenderOptions = {
  template: '<div><label></label><section></section></div>',
  containerEl: 'section',
  cache: {
    labelEl: 'label',
    containerEl: 'section'
  }
};

utils.bigCollectionRenderOptions = bigCollectionRenderOptions;

var container = document.createElement('div');
container.className = 'test-container';

utils.addToBody = function addToBody(el) {
  if (!document.body.contains(container)) {
    document.body.appendChild(container);
  }
  console.info('add to body');
  container.innerHTML = '';
  container.appendChild(el);
};

module.exports = utils;
