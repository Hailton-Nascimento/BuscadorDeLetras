const claves = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
    42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61,
];

function createSquare() {
    const section = document.querySelector("section");
    const square = document.createElement("span");
    square.classList.add("notas");
    square.innerHTML = `<img src="png/${Math.floor(
		Math.random() * 62
	)}.png" alt="">`;

    var tamanho = Math.random() * 50;

    square.style.width = tamanho + "px";
    square.style.height = tamanho + "px";


    square.style.top =
        Math.random() * document.body.clientHeight - tamanho + "px";
    square.style.left = Math.random() * innerWidth - tamanho + "px";

    section.appendChild(square);
    setTimeout(() => {
        square.remove();
    }, 10000);
}
setInterval(createSquare, 50);