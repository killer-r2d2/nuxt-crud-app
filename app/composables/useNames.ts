export type NameItem = { id: number; name: string };

export async function useNames() {
  const { data: names, refresh } = await useFetch<NameItem[]>("/api/names", {
    default: () => [],
  });

  async function createName(name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    await $fetch("/api/names", {
      method: "POST",
      body: { name: trimmedName },
    });
    await refresh();
  }

  async function removeName(id: number) {
    await $fetch(`/api/names/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function updateName(id: number, name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    await $fetch(`/api/names/${id}`, {
      method: "PATCH",
      body: { name: trimmedName },
    });
    await refresh();
  }

  return {
    names,
    refresh,
    createName,
    removeName,
    updateName,
  };
}
