export default defineEventHandler(async (event) => {
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
  const record: NameRecord = { id: nextNameId(names), name };
  names.push(record);
  await writeNames(names);
  return record;
});
