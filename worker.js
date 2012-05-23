var kue = require('kue'),
    phantom = require('phantom');

var jobs = kue.createQueue();

jobs.process('createSnapshot', function (job, done) {
  var snapshot = job.data;

  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.set('viewportSize', { width: snapshot.width, height: snapshot.height });
      page.set('clipRect', { top: 0, left: 0, width: snapshot.width, height: snapshot.height });
      page.open(snapshot.url, function (status) {
        page.evaluate(function() {
          document.body.bgColor = 'white';
        });
        setTimeout(function () {
          page.render('public/snapshots/' + snapshot.fileName + '.png', function () {
            ph.exit();
            done();
            jobs.create('snapshotCreated', {
              title: snapshot.title,
              fileName: snapshot.fileName
            }).save();
          })
        }, 200);
      });
    });
  });
});

kue.app.listen(5000);