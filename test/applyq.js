'use strict';

var sinon = require('sinon');
var applyq = require('../');
var noop = function() {};

describe('applyq', function() {
  it('executes the cached command array', function() {
    var spy = sinon.spy();
    var api = {
      bar: spy
    };
    var _apiq = [];
    _apiq.push(['bar', 1, 2]);
    applyq(api, _apiq);
    expect(spy.calledWithExactly(1,2)).to.be.true;
  });

  it('executes command array after the object was created', function() {
    var spy = sinon.spy();
    var api = {
      bar: spy
    };
    var _apiq = [];
    applyq(api, _apiq);
    _apiq.push(['bar', 5]);
    expect(spy.calledWithExactly(5,1)).to.be.true;
  });

  it('removes newly added item from queue after it was processed', function() {
    var api = {
      bar: noop
    };
    var _apiq = [];
    applyq(api, _apiq);
    _apiq.push(['bar', 5]);
    expect(_apiq.length).to.equal(0);
  });

  it('clears existing items in the queue after processing', function() {
    var api = {
      bar: noop
    };
    var _apiq = [];
    _apiq.push(['bar']);
    _apiq.push(['bar']);
    applyq(api, _apiq);
    expect(_apiq.length).to.equal(0);
  });

  it('executes the queued commands in the correct order', function() {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var api = {
      foo: spy1,
      bar: spy2
    };
    var _apiq = [];
    _apiq.push(['foo', 1]);
    _apiq.push(['bar', 2]);
    applyq(api, _apiq);
    sinon.assert.callOrder(spy1, spy2);
  });

  describe('command arrays that are not matched are added to the queue', function() {
    it('after init', function() {
      var api = {
        foo: function() {}
      };
      var _apiq = [];
      applyq(api, _apiq);
      _apiq.push(['foo', 1]);
      _apiq.push(['bar', 3]);
      _apiq.push(23);

      expect(_apiq.length).to.eq(2);
      expect(_apiq[0].length).to.eq(2);
      expect(_apiq[0][0]).to.eq('bar');
      expect(_apiq[0][1]).to.eq(3);
      expect(_apiq[1]).to.eq(23);
    });

    it('before init', function() {
      var api = {
        foo: function() {}
      };
      var _apiq = [];
      _apiq.push(['foo', 1]);
      _apiq.push(['bar', 3]);
      applyq(api, _apiq);

      expect(_apiq.length).to.eq(1);
      expect(_apiq[0].length).to.eq(2);
      expect(_apiq[0][0]).to.eq('bar');
      expect(_apiq[0][1]).to.eq(3);
    });
  });
});
