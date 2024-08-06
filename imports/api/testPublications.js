import { Meteor } from 'meteor/meteor';
import { TestCollection } from './TestCollection';

Meteor.publish('testData', async () => await TestCollection.find());
