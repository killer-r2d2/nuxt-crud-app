export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = idParam ? Number.parseInt(idParam, 10) : Number.NaN;
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  const names = await readNames();
  const filtered = names.filter((item) => item.id !== id);
  if (filtered.length === names.length) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }

  await writeNames(filtered);
  return { ok: true };
});
