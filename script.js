const filmsList = document.getElementById("films");
const title = document.getElementById("title");
const poster = document.getElementById("poster");
const description = document.getElementById("description");
const runtime = document.getElementById("runtime");
const showtime = document.getElementById("showtime");
const availableTickets = document.getElementById("available-tickets");
const buyBtn = document.getElementById("buy-ticket");

let currentFilm = null;
const baseURL = "http://localhost:3000";

function loadFilms() {
  fetch(`${baseURL}/films`)
    .then((res) => res.json())
    .then((films) => {
      filmsList.innerHTML = "";
      films.forEach((film) => renderFilmItem(film));
      if (films.length > 0) {
        showFilmDetails(films[0]);
      }
    });
}

function renderFilmItem(film) {
  const li = document.createElement("li");
  li.textContent = film.title;
  li.classList.add("film", "item");

  if (film.capacity - film.tickets_sold === 0) {
    li.classList.add("sold-out");
  }

  li.addEventListener("click", () => showFilmDetails(film));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteFilm(film.id, li);
  });

  li.appendChild(deleteBtn);
  filmsList.appendChild(li);
}

function showFilmDetails(film) {
  currentFilm = film;
  title.textContent = film.title;
  poster.src = film.poster;
  description.textContent = film.description;
  runtime.textContent = film.runtime;
  showtime.textContent = film.showtime;

  const ticketsLeft = film.capacity - film.tickets_sold;
  availableTickets.textContent = ticketsLeft;

  buyBtn.textContent = ticketsLeft > 0 ? "Buy Ticket" : "Sold Out";
  buyBtn.disabled = ticketsLeft <= 0;
}

buyBtn.addEventListener("click", () => {
  if (!currentFilm) return;
  let ticketsLeft = currentFilm.capacity - currentFilm.tickets_sold;

  if (ticketsLeft > 0) {
    currentFilm.tickets_sold++;

    fetch(`${baseURL}/films/${currentFilm.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets_sold: currentFilm.tickets_sold }),
    });

    fetch(`${baseURL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        film_id: currentFilm.id,
        number_of_tickets: 1,
      }),
    });

    showFilmDetails(currentFilm);
  }
});

function deleteFilm(id, element) {
  fetch(`${baseURL}/films/${id}`, { method: "DELETE" }).then(() =>
    element.remove()
  );
}

loadFilms();
