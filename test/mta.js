const Mta = require('../lib/mta');
require('should');
require('mocha');

const config = {
  key: process.env.MTA_API_KEY,
};

describe('MTA', function () {
  let mta,
    serviceType,
    stopId,
    stopIds;

  before(function (done) {
    mta = new Mta({
      key: config.key
    });
    stopId = 635;
    stopIds = [635, 636, 637];
    serviceType = 'subway';
    done();
  });

  it('should return info for all MTA subway stops', function () {
    return mta.stop()
    .then(function (result) {
      result.should.be.an.Object;
    });
  });

  it('should get info for 1 MTA subway stop', function () {
    return mta.stop(stopId)
    .then(function (result) {
      result.stop_id.should.equal(stopId.toString());
      result.should.have.property('stop_name');
    });
  });

  it('should get info for S30S', function () {
    return mta.stop('S30S')
    .then(function (result) {
      result.stop_id.should.equal('S30S');
      result.should.have.property('stop_name');
    });
  });

  it('should get info for multiple MTA subway stop', function () {
    return mta.stop(stopIds)
    .then(function (result) {
      stopIds.forEach(function (val) {
        result.should.have.property(val);
      });
    });
  });

  it('should get MTA service status for all types', function () {
    return mta.status()
    .then(function (result) {
      result.should.have.property('subway');
      result.should.have.property('bus');
      result.should.have.property('BT');
      result.should.have.property('LIRR');
      result.should.have.property('MetroNorth');
    });
  });

  it('should get MTA service status for 1 type', function () {
    return mta.status(serviceType)
    .then(function (result) {
      result.should.be.an.Array;
    });
  });

  it('MTA_API_KEY should be set', function (done) {
    config.key.should.not.equal('');
    done();
  });

  it('should get schedule info for 1 MTA subway station (number input)', function () {
    return mta.schedule(stopId)
    .then(function (result) {
      result.should.have.property('schedule');
      result.should.have.property('updatedOn');
      result.schedule[stopId].should.exist;
    });
  });

  it('should get schedule info for 1 MTA subway station (string input)', function () {
    return mta.schedule('128')
    .then(function (result) {
      result.should.have.property('schedule');
      result.should.have.property('updatedOn');
      result.schedule['128'].should.exist;
    });
  });

  it('should get schedule info for a station with a different feed_id', function () {
    return mta.schedule('A15', '-ace')
    .then(function (result) {
      result.should.have.property('schedule');
      result.should.have.property('updatedOn');
      result.schedule['A15'].should.exist;
    });
  });

  it('should get schedule info for multiple MTA subway stations', function () {
    return mta.schedule(stopIds)
    .then(function (result) {
      result.should.have.property('schedule');
      result.should.have.property('updatedOn');
      stopIds.forEach(function (val) {
        result.schedule.should.have.property(val);
      });
    });
  });

  it('should return an empty object for a non-existent stopId (number)', function () {
    return mta.schedule(1234)
    .then((result) => {
      result.should.be.an.Object;
      JSON.stringify(result).should.be.exactly('{}');
    });
  });

  it('should return an empty object for a non-existent stopId (string)', function () {
    return mta.schedule('1234')
    .then((result) => {
      result.should.be.an.Object;
      JSON.stringify(result).should.be.exactly('{}');
    });
  });

  it('should return an empty object for non-existent stopIds (numbers)', function () {
    return mta.schedule([9011, 1234])
    .then((result) => {
      result.should.be.an.Object;
      JSON.stringify(result).should.be.exactly('{}');
    });
  });

  it('should return an empty object for non-existent stopIds (strings)', function () {
    return mta.schedule(['9011', '1234'])
    .then((result) => {
      result.should.be.an.Object;
      JSON.stringify(result).should.be.exactly('{}');
    });
  });

  it('should return an error for invalid stopId (function)', function () {
    return mta.schedule(()=>{})
    .catch((error) => {
      error.should.be.an.Error;
    });
  });

  it('should return an empty object for a stopId with incorrect feedId', function () {
    return mta.schedule(stopId, '-ace')
    .then((result) => {
      result.should.be.an.Object;
      JSON.stringify(result).should.be.exactly('{}');
    });
  });
  
  it('should return an error for a stopId with invalid feedId)', function () {
    return mta.schedule(stopId, '-asdsada')
    .catch((error) => {
      error.should.be.an.Error;
    });
  });

   it('should return an error for a stopId with invalid feedId (function))', function () {
    return mta.schedule(stopId, () => {})
    .catch((error) => {
      error.should.be.an.Error;
    });
  });

});
