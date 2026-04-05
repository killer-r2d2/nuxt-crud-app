<script setup lang="ts">
const STORAGE_KEY = "nuxt-crud-names";

const newName = ref("");
const names = ref<{ id: number; name: string }[]>([]);

const nextNameId = () => {
  const maxId = names.value.reduce(
    (currentMax, item) => Math.max(currentMax, item.id),
    0,
  );
  return maxId + 1;
};

onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    const restored = parsed.filter(
      (item): item is { id: number; name: string } =>
        item !== null &&
        typeof item === "object" &&
        typeof (item as { id: unknown }).id === "number" &&
        typeof (item as { name: unknown }).name === "string",
    );
    names.value = restored;
  } catch {
    /* ignore corrupt storage */
  }
});

watch(
  names,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  { deep: true },
);

const editDialogRef = ref<HTMLDialogElement | null>(null);
const editedId = ref<number | null>(null);
const editedName = ref("");

const addName = () => {
  names.value.push({ id: nextNameId(), name: newName.value });
  newName.value = "";
};

const deleteName = (id: number) => {
  names.value = names.value.filter((name) => name.id !== id);
};

const editName = (id: number, name: string) => {
  names.value = names.value.map((item) => {
    if (item.id === id) {
      return { ...item, name };
    }
    return item;
  });
};

const openEditDialog = (id: number, currentName: string) => {
  editedId.value = id;
  editedName.value = currentName;
  editDialogRef.value?.showModal();
};

const confirmEdit = () => {
  if (editedId.value === null) return;
  editName(editedId.value, editedName.value);
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
