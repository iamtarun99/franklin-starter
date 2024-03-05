/*
 * Sports list custom block
 * Show list of players, with their place and sport, fetched from JSON
 * and optional pagination if list sixze is larger than page limit
 */

const LIMIT = 20;

const getData = async (path, offset) => {
  const url =
    offset !== undefined ? `${path}?offset=${offset}&limit=${LIMIT}` : path;
  const res = await fetch(url);
  const json = await res?.json();
  console.log(json);
  return json;
};
const createList = (data) => {
  const listEl = document.createElement("ul");
  data?.forEach(({ Name, Place, Sport }) => {
    const listItem = document.createElement("li");
    listItem.innerText = `${Name} from ${Place} plays ${Sport}`;
    listEl.append(listItem);
  });
  return listEl;
};

const updateList = async (block, url, page) => {
  const data = await getData(url, page * LIMIT);
  const newList = createList(data?.data);
  const oldList = block.querySelector("ul");
  oldList.replaceWith(newList);
};

export default async function decorate(block) {
  const path = block.querySelector('a[href$=".json"]');
  if (!path) return;

  const data = await getData(path.href, 0);
  const listEl = createList(data?.data);
  path.replaceWith(listEl);

  if (data?.total > LIMIT) {
    let pages = data.total / LIMIT;
    const paginationContainer = document.createElement("div");
    for (let page = 0; page <= pages; page++) {
      const pageBtn = document.createElement("button");
      pageBtn.innerText = `Page ${page + 1}`;
      pageBtn.addEventListener("click", () =>
        updateList(block, path.href, page)
      );
      paginationContainer.append(pageBtn);
    }
    listEl?.after(paginationContainer);
  }
}
