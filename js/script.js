document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const controls = document.getElementById("controls");
    const match = document.getElementById("match");
    const imgA = document.getElementById("imgA");
    const imgB = document.getElementById("imgB");
    const roundInfo = document.getElementById("roundInfo");
    const infoA = document.getElementById("infoA");
    const infoB = document.getElementById("infoB");
    const progress = document.getElementById("progress");

    const totalImages = 32; // adjust as needed
    const basePath = "/images/anime_music_p1/";

    let currentRound = [];
    let nextRound = [];
    let index = 0;
    let roundNumber = 1;
    let descriptions = {};

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    fetch(`${basePath}descriptions.json`)
        .then(res => res.json())
        .then(data => {
            descriptions = data;

            // Build the image list as objects {src, desc}
            for (let i = 1; i <= totalImages; i++) {
                currentRound.push({
                    src: `${basePath}${i}.png`,
                    desc: descriptions[i] || ""
                });
            }

            currentRound = shuffle(currentRound);
        })
        .catch(err => {
            console.error("Failed to load descriptions.json", err);
        });

    startBtn.addEventListener("click", () => {
        controls.style.display = "none";
        match.style.display = "flex";
        showPair();
    });

    function getStageName(size) {
        if (size > 8) return "Pre-Elimination";
        if (size === 8) return "Quarterfinals";
        if (size === 4) return "Semifinals";
        if (size === 2) return "Final";
        return "";
    }

    function showPair() {
        if (currentRound.length === 1) {
            roundInfo.textContent = "🏆 Champion!";
            match.innerHTML = `
        <div class="choice champion">
          <img src="${currentRound[0].src}" alt="Winner">
          <div class="info">${currentRound[0].desc}</div>
        </div>`;
            launchConfetti();
            return;
        }

        if (index < currentRound.length - 1) {
            const a = currentRound[index];
            const b = currentRound[index + 1];

            imgA.src = a.src;
            imgB.src = b.src;
            infoA.textContent = a.desc;
            infoB.textContent = b.desc;

            roundInfo.textContent = `Round ${roundNumber}: Match ${index / 2 + 1} of ${currentRound.length / 2}`;
            progress.textContent = getStageName(currentRound.length);
        } else {
            currentRound = nextRound;
            nextRound = [];
            index = 0;
            roundNumber++;
            showPair();
        }
    }

    function chooseWinner(winner) {
        nextRound.push(winner);
        index += 2;
        showPair();
    }

    imgA.addEventListener("click", () => chooseWinner(currentRound[index]));
    imgB.addEventListener("click", () => chooseWinner(currentRound[index + 1]));

    function launchConfetti() {
        const colors = ["#f2e9b8", "#ffffff", "#ffd700", "#ff6b6b", "#4ecdc4", "#5f27cd"];
        let pieces = 0;
        const maxPieces = 1200;

        const interval = setInterval(() => {
            if (pieces >= maxPieces) {
                clearInterval(interval);
                return;
            }
            pieces++;

            const confetti = document.createElement("div");
            confetti.classList.add("confetti");

            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            const size = Math.random() * 8 + 6;
            confetti.style.width = size + "px";
            confetti.style.height = (Math.random() > 0.5 ? size : size * 1.5) + "px";

            confetti.style.left = Math.random() * 100 + "vw";

            const duration = Math.random() * 2 + 3;
            confetti.style.animationDuration = duration + "s";

            const drift = Math.random() * 200 - 100;
            confetti.style.transform = `translateX(${drift}px)`;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), duration * 1000);
        }, 5);
    }
});
