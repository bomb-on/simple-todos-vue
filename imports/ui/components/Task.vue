<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const taskRef = ref({ ...props.task });

const isChecked = computed(() => taskRef.value.checked);

const handleCheckboxChange = async (event) => {
  const newCheckedValue = event.target.checked;
  taskRef.value.checked = newCheckedValue;

  try {
    await Meteor.callAsync('setIsCheckedTask', taskRef.value._id, newCheckedValue);
  } catch (error) {
    console.error('Error updating task checked state:', error);
  }
};

const deleteTask = async () => {
  try {
    await Meteor.callAsync('removeTask', taskRef.value._id);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
</script>

<template>
  <div class="flex items-center rounded p-4 py-2 mb-2 shadow-sm border border-gray-200 md:mr-8">
    <li>
      <input v-model="taskRef.checked" type="checkbox" readonly :checked="isChecked" @change="handleCheckboxChange" />
    </li>
    <span class="text-gray-600 pl-2" :class="{ 'text-gray-400 italic line-through': taskRef.checked }">
      {{ task.text }}
    </span>
    <button class="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-0.5 px-2 rounded" @click="deleteTask">
      &times;
    </button>
  </div>
</template>
