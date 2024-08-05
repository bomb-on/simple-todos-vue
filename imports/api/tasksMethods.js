import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from './TasksCollection';

async function insertTask(text) {
  check(text, String);
  if (!Meteor.userId()) {
    throw new Meteor.Error('Not authorized.');
  }
  return await TasksCollection.insertAsync({
    text,
    userId: Meteor.userId(),
    createdAt: new Date,
  });
}

async function removeTask(taskId) {
  check(taskId, String);
  if (!Meteor.userId()) {
    throw new Meteor.Error('Not authorized.');
  }
  await TasksCollection.removeAsync(taskId);
}

async function setIsCheckedTask(taskId, checked) {
  check(taskId, String);
  check(checked, Boolean);

  if (!Meteor.userId()) {
    throw new Meteor.Error('Not authorized.');
  }

  await TasksCollection.updateAsync(taskId, {
    $set: {
      checked
    }
  });
}

Meteor.methods({ insertTask, removeTask, setIsCheckedTask });
