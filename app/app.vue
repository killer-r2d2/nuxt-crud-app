<script setup lang="ts">
type NameItem = { id: number; name: string }

const { data: names, refresh } = await useFetch<NameItem[]>("/api/names", {
  default: () => [],
});

const newName = ref("");

const editDialogRef = ref<HTMLDialogElement | null>(null);
const editedId = ref<number | null>(null);
const editedName = ref("");

const addName = async () => {
  const trimmedName = newName.value.trim();
  if (!trimmedName) return;

  await $fetch("/api/names", {
    method: "POST",
    body: { name: trimmedName },
  });
  newName.value = "";
  await refresh();
};

const deleteName = async (id: number) => {
  await $fetch(`/api/names/${id}`, { method: "DELETE" });
  await refresh();
};

const editName = async (id: number, name: string) => {
  await $fetch(`/api/names/${id}`, {
    method: "PATCH",
    body: { name },
  });
  await refresh();
};

const openEditDialog = (id: number, currentName: string) => {
  editedId.value = id;
  editedName.value = currentName;
  editDialogRef.value?.showModal();
};

const confirmEdit = async () => {
  if (editedId.value === null) return;
  const trimmedName = editedName.value.trim();
  if (!trimmedName) return;

  await editName(editedId.value, trimmedName);
  editDialogRef.value?.close();
  editedId.value = null;
};

const cancelEdit = () => {
  editDialogRef.value?.close();
  editedId.value = null;
};
</script>
<template>
  <div>
    <h1>Hello World</h1>
    <h2>Welcome to the Nuxt 4 CRUD App</h2>
    <div>
      <label for="name">Name</label>
      <input id="name" type="text" v-model="newName" />
      <button type="button" @click="addName">Add Name</button>
      <ul>
        <li v-for="name in names" :key="name.id">
          {{ name.name }}
          <button type="button" @click="deleteName(name.id)">Delete</button>
          <button type="button" @click="openEditDialog(name.id, name.name)">
            Edit
          </button>
        </li>
      </ul>
    </div>

    <dialog ref="editDialogRef">
      <form method="dialog" @submit.prevent="confirmEdit">
        <label>
          Name
          <input type="text" v-model="editedName" />
        </label>
        <button type="submit">Save</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </dialog>
  </div>
</template>
