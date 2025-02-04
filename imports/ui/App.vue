<script setup>
import { Meteor } from 'meteor/meteor';
import { computed, ref, watch } from 'vue';
import LoginForm from './components/LoginForm.vue';
import Task from './components/Task.vue';
import TaskForm from './components/TaskForm.vue';
import { subscribe, autorun } from 'vue-meteor-tracker';
import { TasksCollection } from '../api/TasksCollection';
import { TestCollection } from '../api/TestCollection';


const hideCompleted = ref(false);
const isLogged = ref(false);
const isLoading = computed(() => testCollection.value.length < 10000);

const userId = autorun(() => Meteor.userId()).result;

watch(
  () => userId.value,
  (newUserId) => {
    isLogged.value = !!newUserId
  },
  { immediate: true }
);

const toggleHideCompleted = () => {
  hideCompleted.value = !hideCompleted.value
};

subscribe('tasks');
subscribe('testData');

const tasks = autorun(() => {
  const filter = hideCompleted.value ? { checked: { $ne: true }, userId: userId.value } : { userId: userId.value };
  return TasksCollection.find(filter, { sort: { createdAt: -1 } }).fetch();
}).result;

const incompleteTasksCount = autorun(() => {
  return TasksCollection.find({ checked: { $ne: true }, userId: userId.value }).count()
}).result;

const testCollection = autorun(() => {
  return TestCollection.find({}).fetch();
}).result;

const logout = () => Meteor.logout();
</script>

<template>
  <div v-if="isLoading" class="grid gap-2 content-center place-items-center min-h-screen">
    <h1 class="text-4xl">Loading test data...</h1>
    <div>{{ testCollection.length }} documents loaded</div>
  </div>
  <div v-else>
    <div v-if="isLogged">
      <header class="flex items-center justify-between px-4 py-4 bg-gray-100 border-t border-b border-gray-200">
        <h1 class="text-4xl font-bold text-gray-800 my-4">🚀 To-Do List
          <span v-if="incompleteTasksCount > 0" class="text-xl font-light text-gray-600">({{ incompleteTasksCount }})</span>
        </h1>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          @click="logout">
          Logout
        </button>
      </header>
      <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="mb-8 md:w-96 md:mx-auto md:mb-0 md:mt-8 md:px-4 md:py-8 text-center md:bg-gray-100 md:rounded-lg">
          <TaskForm />
          <div>
            <button class="text-sm font-semibold text-gray-600 hover:text-gray-800" @click="toggleHideCompleted">
              <span v-if="hideCompleted">Show all</span>
              <span v-else>Hide completed</span>
            </button>
          </div>
          <ul class="list-none list-inside pt-4 md:w-96">
            <Task v-for="task of tasks" :key="task._id" :task="task" />
          </ul>
        </div>
      </div>
    </div>

    <div v-else>
      <LoginForm />
    </div>
  </div>
</template>
