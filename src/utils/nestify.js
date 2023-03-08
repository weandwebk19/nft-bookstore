const nestify = (items, id = undefined, link = "parent_id") =>
  items
    ?.filter((item) => item[link] === id)
    ?.map((item) => ({ ...item, children: nestify(items, item._id) }));

export default nestify;
