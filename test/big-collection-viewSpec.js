'use strict';
/*jshint node: true*/

var utils =       window.testUtils;//require('./utils');

var expect =      utils['expect.js'];
var State =       utils['ampersand-state'];
var View =        utils['ampersand-view'];
var Collection =  utils['ampersand-collection'];


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

var fixtureModels = makeFixture(400);

var ItemView = View.extend({
  template: '<div></div>',
  bindings: {
    'model.thing': {
      type: 'text'
    }
  }
});

var bigCollectionRenderOptions = {
  template: '<div><label></label><section></section></div>',
  containerEl: 'section',
  cache: {
    labelEl: 'label',
    containerEl: 'section'
  }
};

describe('BigCollectionView', function () {
  var instance;
  var collection;
  var BigCollectionView;

  it('is available on the window', function () {
    expect(window.BigCollectionView).to.be.a('function');
    BigCollectionView = window.BigCollectionView;
  });

  describe('instanciation', function () {
    before(function () {
      collection = new FixturesCollection(fixtureModels);
    });

    it('needs an ItemView options', function () {
      expect(function () {
        new BigCollectionView({
          collection: collection
        });
      }).to.throwError('BigCollectionView requires a ItemView option');
    });

    it('can take a collection instance', function () {
      expect(function () {
        new BigCollectionView({
          ItemView:   ItemView,
          collection: collection
        });
      }).not.to.throwError(utils.error('instanciation'));
    });

    it('can take a collection constructor', function () {
      expect(function () {
        instance = new BigCollectionView({
          ItemView:   ItemView,
          models:     fixtureModels,
          Collection: FixturesCollection
        });
      }).not.to.throwError(utils.error('instanciation'));

      expect(instance.bigCollection).not.to.be(undefined);

      expect(instance.partial).not.to.be(undefined);
    });

    it('does not render automatically', function () {
      expect(instance.el).to.be(undefined);
    });
  });

  describe('.render()', function () {
    before(function () {
      instance = new BigCollectionView({
        ItemView:   ItemView,
        models:     fixtureModels,
        Collection: FixturesCollection
      });
    });


    it('fails if the view has no template', function () {
      expect(function () {
        instance.render();
      }).to.throwError();
    });


    it('generates the .el property', function () {
      expect(function () {
        instance.render(bigCollectionRenderOptions);
      }).not.to.throwError(utils.error('render'));

      expect(instance.el).to.be.an(Element);

      utils.addToBody(instance.el);
    });


    it('renders the .partial', function () {
      expect(instance.queryAll('section div').length).to.be(20);
    });
  });

  describe('controls', function () {
    before(function () {
      instance = new BigCollectionView({
        ItemView:   ItemView,
        models:     fixtureModels,
        Collection: FixturesCollection
      });
      instance.render(bigCollectionRenderOptions);
      utils.addToBody(instance.el);
    });


    describe('.count', function () {
      var events = {};
      var listener = utils.collectEvents(events, true);

      before(function () {
        instance.partial.on('all', listener);
      });

      after(function () {
        instance.partial.off('all', listener);
      });


      it('can be used to change the amount of item shown', function () {
        expect(instance.queryAll('section div').length).to.be(20);

        expect(instance.pages).to.be(20);

        expect(instance.page).to.be(0);

        instance.count = 10;

        expect(instance.page).to.be(0);

        expect(events.reset.length).to.be(1);

        expect(instance.results.length).to.be(10);

        expect(instance.partial.length).to.be(10);

        expect(instance.queryAll('section div').length).to.be(10);

        expect(instance.pages).to.be(40);
      });
    });


    describe('.start', function () {
      var partialEvents = {};
      var partialListener = utils.collectEvents(partialEvents, 'partial');
      var viewEvents = {};
      var viewListener = utils.collectEvents(viewEvents, 'view');
      var collectionEvents = {};
      var collectionListener = utils.collectEvents(collectionEvents, 'collection');

      before(function () {
        instance.partial.on('all', partialListener);
        instance.on('all', viewListener);
        instance.bigCollection.on('all', collectionListener);
      });

      after(function () {
        instance.partial.off('all', partialListener);
        // console.info('viewEvents', viewEvents);
        instance.off('all', viewListener);
        // console.info('collectionEvents', collectionEvents);
        instance.bigCollection.off('all', collectionListener);
      });


      it('can be used to change the amount of item shown', function () {
        instance.start = 10;

        expect(partialEvents.reset.length).to.be(1);

        expect(instance.page).to.be(1);

        expect(instance.results.length).to.be(10);

        expect(instance.partial.length).to.be(10);

        expect(instance.queryAll('section div').length).to.be(10);

        expect(instance.results[0].thing).to.be('thing11');
      });
    });
  });
});

