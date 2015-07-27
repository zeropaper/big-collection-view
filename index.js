'use strict';

var BigCollection = require('big-collection');
var View          = require('ampersand-view');

var BigCollectionView = View.extend({
  initialize: function (options) {
    options = options || {};
    var models = options.models || [];
    if (!options.ItemView) {
      throw new Error('BigCollectionView requires a ItemView option');
    }

    this.ItemView = options.ItemView;

    var bigCollectionOptions = {
      collection: options.collection,
      Collection: options.Collection
    };
    this.bigCollection = new BigCollection(models, bigCollectionOptions);
    this.trigger('change:bigCollection');
  },


  render: function (options) {
    options = options || {};
    var context         = options.context || this;
    var template        = options.template || this.template;
    var ItemView        = options.ItemView || this.ItemView;
    var itemViewOptions = options.itemViewOptions || this.itemViewOptions || {};
    var containerEl     = options.containerEl || this.containerEl || this.el;

    this.renderWithTemplate(context, template);

    if (options.cache) {
      this.cacheElements(options.cache);
    }

    this.renderCollection(this.partial, ItemView, containerEl, itemViewOptions);

    return this;
  }
});


var proxied = {};

[
  'count',
  'start',
  'mode'
].forEach(function (name) {
  proxied[name] = {
    get: function () {
      return this.bigCollection.state[name];
    },
    set: function (val) {
      this.bigCollection.state[name] = val;
    }
  };
});

Object.defineProperties(BigCollectionView.prototype, proxied);


var readOnly = {};
[
  'page',
  'pages',
  'total',
  'results'
].forEach(function (name) {
  readOnly[name] = {
    get: function () {
      return this.bigCollection.state[name];
    }
  };
});
[
  'partial',
  'complete'
].forEach(function (name) {
  readOnly[name] = {
    get: function () {
      return this.bigCollection['_' + name];
    }
  };
});

Object.defineProperties(BigCollectionView.prototype, readOnly);

/*------------------------------------------------------------------*/

var BigCollectionPagerView = View.extend({
  autoRender: true,



  events: {
    'click .first':     '_handleFirstClick',
    'click .previous':  '_handlePreviousClick',
    'click .page':      '_handlePageClick',
    'click .next':      '_handleNextClick',
    'click .last':      '_handleLastClick',
  },


  _isDisabledClick: function (evt) {
    var cn = evt.delegateTarget.className;
    return cn.indexOf('disabled') > -1 || cn.indexOf('active') > -1;
  },


  _handleFirstClick: function (evt) {
    if (this._isDisabledClick(evt)) { return; }
    this.goTo('first');
  },

  _handlePreviousClick: function (evt) {
    if (this._isDisabledClick(evt)) { return; }
    this.goTo('previous');
  },

  _handlePageClick: function (evt) {
    if (this._isDisabledClick(evt)) { return; }
    this.parent.start = parseInt(evt.delegateTarget.getAttribute('data-start'), 10);
  },

  _handleNextClick: function (evt) {
    if (this._isDisabledClick(evt)) { return; }
    this.goTo('next');
  },

  _handleLastClick: function (evt) {
    if (this._isDisabledClick(evt)) { return; }
    this.goTo('last');
  },

  goTo: function (page) {
    var current = this.parent.page;
    var total = this.parent.pages;
    var count = this.parent.count;
    var start = 0;

    switch (page) {
      case 0:
      case 'first':
        // start = 0;
        break;
      case 'previous':
        start = Math.max(current - 1, 0) * count;
        break;

      case 'next':
        start = Math.min(current + 1, (total - 1)) * count;
        break;
      case 'last':
        start = (total - 1) * count;
        break;

      default:
        start = page * count;
    }

    this.parent.start = start;

    return this;
  },

  // derived: {
  //   page: {
  //     cache: false,
  //     fn: function () {
  //       return this.parent.page;
  //     }
  //   },
  //   pages: {
  //     cache: false,
  //     fn: function () {
  //       return this.parent.pages;
  //     }
  //   }
  // },

  initialize: function (options) {
    options = options || {};

    [
      'state:change.start',
      'state:change.count'
    ].forEach(function (evtName) {
      this.listenTo(this.parent.bigCollection, evtName, this.render);
    }, this);
  },



  template: function (info) {
    var str = ['<div class="pager"><ul>'];

    if (info.first) {
      str.push('<li class="first' + (info.first.disabled ? ' disabled' : '') + '"><span>First</span></li>');
    }
    if (info.previous) {
      str.push('<li class="previous' + (info.previous.disabled ? ' disabled' : '') + '"><span>Previous</span></li>');
    }

    if (info.pages) {
      info.pages.forEach(function (page) {
        str.push('<li data-start="' + page.start + '" class="page' + (page.active ? ' active' : '') + '">' + page.num + '</li>');
      });
    }

    if (info.next) {
      str.push('<li class="next' + (info.next.disabled ? ' disabled' : '') + '"><span>Next</span></li>');
    }
    if (info.last) {
      str.push('<li class="last' + (info.last.disabled ? ' disabled' : '') + '"><span>Last</span></li>');
    }

    str.push('</ul></div>');
    return str.join('');
  },

  computePages: function () {
    var obj = {};
    var page = this.parent.page;
    var pages = this.parent.pages;
    var count = this.parent.count;
    var pageStart = page;
    var items = 5;

    obj.first = {
      disabled: this.parent.page === 0
    };
    obj.previous = {
      disabled: this.parent.page === 0
    };

    obj.next = {
      disabled: this.pages <= this.page
    };
    obj.last = {
      disabled: this.pages <= this.page
    };

    obj.pages = [];

    if (pageStart + items >= pages) {
      pageStart = pages - items;
    }
    else if (pageStart > items / 2) {
      pageStart = Math.max(pageStart - Math.floor(items / 2), 0);
    }


    for (var p = pageStart; (p < pages && p < pageStart + items); p++) {
      obj.pages.push({
        start: p * count,
        num: p + 1,
        active: p === page
      });
    }

    return obj;
  },

  render: function () {
    var info = this.computePages();

    this.renderWithTemplate(info);

    return this;
  }
});

BigCollectionView.Pager = BigCollectionPagerView;

module.exports = BigCollectionView;
