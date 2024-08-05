import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../imports/api/TasksCollection';
import '../imports/api/tasksPublications';
import '../imports/api/tasksMethods';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

const createFirstUser = async () => {
  const user = await Accounts.findUserByUsername(SEED_USERNAME);
  if (!user) {
    await Accounts.createUserAsync({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
}

const insertTask = async (text, userId) => {
  await TasksCollection.insertAsync({text, userId, createdAt: new Date()});
}

const createTasks = async () => {
  const tasksCount = await TasksCollection.find().countAsync();
  if (tasksCount === 0) {
    const user = await Accounts.findUserByUsername(SEED_USERNAME);

    await insertTask('First Task', user._id);
    await insertTask('Second Task', user._id);
    await insertTask('Third Task', user._id);
    await insertTask('Fourth Task', user._id);
    await insertTask('Fifth Task', user._id);
    await insertTask('Sixth Task', user._id);
    await insertTask('Seventh Task', user._id);
  }
}

Meteor.startup(async () => {
  await createFirstUser();
  await createTasks();
});
