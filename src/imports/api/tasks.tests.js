/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
 
import { Tasks } from './tasks.js';
 
if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;
   
      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
            text: 'test task',
            createdAt: new Date(),
            owner: userId,
            username: 'tmeasday',
            private: true,
        });
      });

      it('can delete owned private task', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
 
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };
 
        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskId]);
 
        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });

      it('can delete owned public task', () => {
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        const invocation = { userId };

        // make the task public
        Tasks.update(taskId, { $set: { private: false } });
 
        deleteTask.apply(invocation, [taskId]);
 
        assert.equal(Tasks.find().count(), 0);
      });

      it('can delete other users public task', () => {
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        const aDifferentUserId = userId * 2;
        const invocation = { aDifferentUserId };

        // make the task public
        Tasks.update(taskId, { $set: { private: false } });
        
        deleteTask.apply(invocation, [taskId]);
 
        assert.equal(Tasks.find().count(), 0);
      });

      it('will throw an error if you try to delete other peoples private tasks', () => {
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        const aDifferentUserId = userId * 2;
        const invocation = { aDifferentUserId };
 
        assert.throws(() => {
          deleteTask.apply(invocation, [taskId]);
        }, Meteor.Error, /not-authorized/);

      });
    });
  });
}