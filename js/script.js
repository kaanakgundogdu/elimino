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

    let currentRound = [
        "/images/quiz1/1.png",
        "/images/quiz1/2.png",
        "/images/quiz1/3.png",
        "/images/quiz1/4.png",
        "/images/quiz1/5.png",
        "/images/quiz1/6.png",
        "/images/quiz1/7.png",
        "/images/quiz1/8.png"
    ];

    const descriptions = {
        "/images/quiz1/1.png": "Image 1 — short details go here.",
        "/images/quiz1/2.png": "Image 2 — brief description.",
        "/images/quiz1/3.png": "Image 3 — something informative.",
        "/images/quiz1/4.png": "Image 4 — context or notes.",
        "/images/quiz1/5.png": "Image 5 — what to notice.",
        "/images/quiz1/6.png": "Image 6 — key points.",
        "/images/quiz1/7.png": "Image 7 — quick caption.",
        "/images/quiz1/8.png": "Image 8 — summary text."
    };

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    currentRound = shuffle(currentRound);

    let nextRound = [];
    let index = 0;
    let roundNumber = 1;

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
          <img src="${currentRound[0]}" alt="Winner">
          <div class="info">${descriptions[currentRound[0]] || ""}</div>
        </div>`;
            launchConfetti();
            return;
        }

        if (index < currentRound.length - 1) {
            const a = currentRound[index];
            const b = currentRound[index + 1];

            imgA.src = a;
            imgB.src = b;
            infoA.textContent = descriptions[a] || "";
            infoB.textContent = descriptions[b] || "";

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
        const maxPieces = 1200; // 10x more than before

        const interval = setInterval(() => {
            if (pieces >= maxPieces) {
                clearInterval(interval);
                return;
            }
            pieces++;

            const confetti = document.createElement("div");
            confetti.classList.add("confetti");

            // random color
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // random size
            const size = Math.random() * 8 + 6;
            confetti.style.width = size + "px";
            confetti.style.height = (Math.random() > 0.5 ? size : size * 1.5) + "px";

            // random start position
            confetti.style.left = Math.random() * 100 + "vw";

            // random animation duration
            const duration = Math.random() * 2 + 3; // 3–5s
            confetti.style.animationDuration = duration + "s";

            // random horizontal drift
            const drift = Math.random() * 200 - 100; // -100px to +100px
            confetti.style.transform = `translateX(${drift}px)`;

            document.body.appendChild(confetti);

            // remove after animation
            setTimeout(() => confetti.remove(), duration * 1000);
        }, 5); // spawn very rapidly (every 5ms)
    }



});
