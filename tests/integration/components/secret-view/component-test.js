import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('secret-view', 'Integration | Component | secret view', {
  integration: true
});

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  const testSecret = EmberObject.create({
    name: 'TEST_SECRET',
    pipelineId: 123245,
    value: 'banana',
    allowInPR: false
  });

  this.set('mockSecret', testSecret);

  this.render(hbs`{{secret-view secret=mockSecret}}`);
  const passInput = this.$('.pass input');
  const allowInput = this.$('.allow input');

  assert.equal(this.$('.name').text().trim(), 'TEST_SECRET');
  assert.equal(passInput.attr('placeholder'), 'Protected');
  assert.equal(passInput.val(), '');
  assert.equal(allowInput.prop('checked'), false);
  assert.equal(this.$('button').text().trim(), 'Delete');

  // button value changes when user types a new value
  passInput.val('banana').keyup();
  assert.equal(this.$('button').text().trim(), 'Update');

  // button value changes when user types a new value
  passInput.val('').keyup();
  assert.equal(this.$('button').text().trim(), 'Delete');

  // button value changes when user click the checkbox
  allowInput.click();
  assert.equal(this.$('button').text().trim(), 'Update');

  // button value changes when user click the checkbox again to change it back
  allowInput.click();
  assert.equal(this.$('button').text().trim(), 'Delete');
});

test('it trys to delete a secret', function (assert) {
  assert.expect(1);
  this.set('mockSecret', EmberObject.extend({
    destroyRecord() {
      // destroy called
      assert.ok(true);
    },
    save() {
      // update called: Fail!
      assert.ok(false);
    }
  }).create({
    name: 'TEST_SECRET',
    pipelineId: 123245,
    value: null,
    allowInPR: false
  }));

  this.render(hbs`{{secret-view secret=mockSecret}}`);
  this.$('button').click();
});

test('it saves changes to a secret', function (assert) {
  assert.expect(2);
  // Setting up model so `set` works as expected
  this.set('mockSecret', EmberObject.extend({
    destroyRecord() {
      // destroy called: Fail!
      assert.ok(false);
    },
    save() {
      // update called
      assert.equal(this.get('value'), 'banana');
      assert.equal(this.get('allowInPR'), true);
    }
  }).create({
    name: 'TEST_SECRET',
    pipelineId: 123245,
    value: null,
    allowInPR: false
  }));

  this.render(hbs`{{secret-view secret=mockSecret}}`);
  this.$('.pass input').val('banana').keyup();
  this.$('.allow input').click();
  this.$('button').click();
});
