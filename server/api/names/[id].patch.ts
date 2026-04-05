export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, "id");
  const id = idParam ? Number.parseInt(idParam, 10) : Number.NaN;
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  }

  const body = await readBody(event);
  const name =
    typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name is required",
    });
  }

  const names = await readNames();
  const index = names.findIndex((item) => item.id === id);
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }

  const existing = names[index];
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }

  const updated: NameRecord = { ...existing, name };
  names[index] = updated;
  await writeNames(names);
  return updated;
});
