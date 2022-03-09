const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const prevAndNextContainer = document.querySelector("#prev-and-next-container");

const apiURL = `https://api.lyrics.ovh`;

const fetchData = async(url) => {
    const response = await fetch(url);
    return await response.json();
};

const getMoreSongs = async(url) => {
    try {
        insertWarningMessageIntoPage("Carregando...");
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const data = await fetchData(`${proxy}${url}`);
        insertSongsIntoPage(data);
    } catch (error) {
        insertWarningMessageIntoPage(`Não foi possível carregar mais musicas.`);
    }
};

const insertNextAndPrevButtons = ({ prev, next }) => {
        prevAndNextContainer.innerHTML = `
            ${
							prev
								? `<button class="btn" onClick="getMoreSongs('${prev}')">Anteriores</button>`
								: ""
						}
            ${
							next
								? `<button class="btn" onClick="getMoreSongs('${next}')">Provimas</button>`
								: ""
						}
        `;
};

const insertSongsIntoPage = ({ data, next, prev }) => {
	songsContainer.innerHTML = data
		.map(
			({ artist: { name }, link, title }) =>
				`<li class="song">
            <span class="song-artist">
            <strong>${name}</strong> - ${title}</span>
            <button class="btn" onClick="getMoreSongs" data-artist="${name}" data-song-title="${title}">Ver Letra</button>
        </li>`
		)
		.join("");

	if (prev || next) {
		insertNextAndPrevButtons({ next, prev });
		return;
	}
	prevAndNextContainer.innerHTML = "";
};

const fetchSongs = async (term) => {
	try {
		insertWarningMessageIntoPage("Carregando...");
		const data = await fetchData(`${apiURL}/suggest/${term}`);
		if (!data.total)
			throw new Error(`Busca por ${term} não retornou resultados `);
		insertSongsIntoPage(data);
	} catch (error) {
		console.log(error);
		insertWarningMessageIntoPage(`Não foi possível encontrar ${term}.`);
	}
};
const insertWarningMessageIntoPage = (message) => {
	songsContainer.innerHTML = `<li class="warning-message"> ${message}</li>`;
	prevAndNextContainer.innerHTML = "";
};

const heandleFormSubmit = () => {
	event.preventDefault();
	const searchTerm = searchInput.value.trim();
	searchInput.value = "";
	searchInput.focus();
	if (!searchTerm) {
		insertWarningMessageIntoPage("Por favor, digite um termo válido");
		return;
	}
	fetchSongs(searchTerm);
};

form.addEventListener("submit", heandleFormSubmit);

const insertLyricsIntoPage = ({ artist, songTitle, lyrics }) => {
	songsContainer.innerHTML = `
        <li class="lyrics-container">
            <h2><strong>${songTitle}</strong> - ${artist}</h2>
            <p class="lyrics">${lyrics}</p>
        </li>
    `;
	prevAndNextContainer.innerHTML = "";
};

const fetchLyrics = async (artist, songTitle) => {
	try {
		insertWarningMessageIntoPage("Carregando...");
		const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`);
		let lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
			lyrics = lyrics.replace(/(<br><br><br><br>|<br><br><br>)/g, "<br>");
		insertLyricsIntoPage({ artist, songTitle, lyrics });
	} catch (error) {
		insertWarningMessageIntoPage("Letra não encontrada! ");
	}
};
const handleSongContainerClick = () => {
	const { target: clickedElemento } = event;
	const iSbutton = clickedElemento.classList.contains("btn");
	if (!iSbutton) return;
	const artist = clickedElemento.getAttribute("data-artist");
	const songTitle = clickedElemento.getAttribute("data-song-title");

	fetchLyrics(artist, songTitle);
};

songsContainer.addEventListener("click", handleSongContainerClick);