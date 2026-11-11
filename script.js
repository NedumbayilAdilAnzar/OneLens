// get the elements from the page
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const count = document.getElementById("result-count");

// search Wikimedia Commons for images
async function search(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300" +
    "&format=json&origin=*";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Something went wrong: " + response.status);
  }
  const data = await response.json();

  // data.query is missing when there are no results
  let items = [];
  if (data.query) {
    items = Object.values(data.query.pages);
  }

  showResults(items, query);
}

// make a card for each image
function showResults(items, query) {
  results.innerHTML = ""; // clear old results

  items.forEach(function (item) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.imageinfo[0].thumburl;
    img.alt = item.title;

    const title = document.createElement("p");
    title.textContent = item.title.replace("File:", "");

    card.appendChild(img);
    card.appendChild(title);
    results.appendChild(card);
  });

  count.textContent = "Showing " + items.length + " results for " + query;
}

// runs when the form is submitted (button or Enter)
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const query = input.value.trim();
  if (query === "") {
    return;
  }
  search(query);
});