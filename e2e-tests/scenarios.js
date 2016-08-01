'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should pass test1', function() {
    expect(true).toBe(true);
  });
    
  describe('view1', function() {

    // beforeEach(function() {
    //   browser.get('index.html#!/view1');
    // });


      it('should pass test2', function() {
          expect(true).toBe(true);
      });

  });


  describe('view2', function() {

    // beforeEach(function() {
    //   browser.get('index.html#!/view2');
    // });


      it('should pass test3', function() {
          expect(true).toBe(true);
      });

  });
});
