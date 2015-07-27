'use strict';
/*jshint browser: true*/

/*global BigCollectionView: false*/

var utils =       window.testUtils;

var expect =      utils['expect.js'];


describe.only('BigCollectionView.Pager', function () {
  var instance;
  var bigCollectionView;

  before(function () {
    bigCollectionView = new BigCollectionView({
      ItemView:   utils.ItemView,
      models:     utils.fixtureModels,
      Collection: utils.FixturesCollection
    });
    bigCollectionView.render(utils.bigCollectionRenderOptions);
  });

  describe('instanciation', function () {
    it('requires a parent option', function () {
      expect(function () {
        new BigCollectionView.Pager();
      }).to.throwError();

      expect(function () {
        instance = new BigCollectionView.Pager({
          parent: bigCollectionView
        });
      }).not.to.throwError(utils.error('pager instanciation'));
    });

    it('renders automatically', function () {
      expect(instance.el).to.be.an(Element);
      utils.addToBody(instance.el);
    });
  });

  describe('.render()', function () {
    var lis;
    var pages;
    var active;
    var disabled;

    before(function () {
      instance = new BigCollectionView.Pager({
        parent: bigCollectionView
      });
      var wrapper = document.createElement('div');
      wrapper.appendChild(bigCollectionView.el);
      wrapper.appendChild(instance.el);
      utils.addToBody(wrapper);
      
      lis = instance.queryAll('li');
      pages = instance.queryAll('li.page');
      active = instance.queryAll('li.active');
      disabled = instance.queryAll('li.disabled');
    });

    it('creates the HTML', function () {
      expect(instance.el).not.to.be(undefined);
    });
    
    it('creates 9 li tags', function () {
      expect(lis.length).to.be(9);
    });

    it('adds the "disabled" css class to the first and previous li tags', function () {
      expect(disabled[0]).to.be(lis[0]);
      expect(disabled[1]).to.be(lis[1]);
      expect(disabled.length).to.be(2);
    });

    it('adds the "page" css class to the relevant li tags', function () {
      expect(pages[0]).to.be(lis[2]);
      expect(pages.length).to.be(5);
    });

    it('adds the "active" css class to the first "page" li tags', function () {
      expect(active[0]).to.be(lis[2]);
      expect(active.length).to.be(1);
    });
  });

  describe('.goTo(page)', function () {
    var lis;
    var pages;
    var active;
    var disabled;

    before(function () {
      instance = new BigCollectionView.Pager({
        parent: bigCollectionView
      });
      var wrapper = document.createElement('div');
      wrapper.appendChild(bigCollectionView.el);
      wrapper.appendChild(instance.el);
      utils.addToBody(wrapper);
    });

    it('changes the start of the collection', function () {
      expect(function () {
        instance.goTo(10);
        
        lis = instance.queryAll('li');
        pages = instance.queryAll('li.page');
        active = instance.queryAll('li.active');
        disabled = instance.queryAll('li.disabled');
      }).not.to.throwError(utils.error('.goTo(10)'));
    });

    it('keeps the active li tag in the middle', function () {
      expect(active[0]).to.be(lis[4]);
    });
  });
});
