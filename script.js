document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const giftContainer = document.getElementById('giftContainer');
    const keyContainer = document.getElementById('keyContainer');
    const storybookContainer = document.getElementById('storybookContainer');
    const bookCover = document.getElementById('bookCover');
    const book = document.querySelector('.book');
    const pages = document.querySelectorAll('.page');

    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step5: document.getElementById('step5'),
    };

    function transitionToStep(targetStepId) {
        const currentActive = document.querySelector('.step.active');
        if (currentActive) currentActive.classList.remove('active');
        steps[targetStepId].classList.add('active');
    }

    // --- Step 1: Gift Box ---
    giftContainer.addEventListener('click', () => {
        giftContainer.classList.add('open');
        setTimeout(() => transitionToStep('step2'), 800);
    });

    // --- Step 2: Key ---
    keyContainer.addEventListener('click', () => {
        keyContainer.classList.add('unlocking');
        setTimeout(() => transitionToStep('step3'), 600);
        setTimeout(startStorybookSequence, 1500);
    });

    // --- Step 3: Storybook ---
    function startStorybookSequence() {
        // Start music when pages start flipping
        backgroundMusic.play().catch(e => console.error("Autoplay failed:", e));

        // Slide book so spine is centered, then flip cover
        setTimeout(() => {
            book.classList.add('opened');
        }, 500);

        setTimeout(() => {
            bookCover.classList.add('flipped');
        }, 1500);

        // Flip pages
        pages.forEach((page, index) => {
            setTimeout(() => {
                page.classList.add('flipped');
            }, 3500 + (index * 3000));
        });

        // Go to finale after all pages
        const totalTime = 3500 + (pages.length * 3000) + 1500;
        setTimeout(() => transitionToStep('step5'), totalTime);
    }

    // --- Replay ---
    document.getElementById('replayBtn').addEventListener('click', () => {
        giftContainer.classList.remove('open');
        keyContainer.classList.remove('unlocking');
        book.classList.remove('opened');
        bookCover.classList.remove('flipped');
        pages.forEach(page => page.classList.remove('flipped'));
        document.querySelectorAll('#step5 div[style]').forEach(el => {
            if (el.style.animation && el.style.animation.includes('confettiFall')) el.remove();
        });
        transitionToStep('step1');
    });

    // --- Particles ---
    function createParticles() {
        const background = document.querySelector('.background-container');
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.style.position = 'absolute';
            p.style.width = `${Math.random() * 5 + 2}px`;
            p.style.height = p.style.width;
            p.style.borderRadius = '50%';
            p.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            p.style.left = `${Math.random() * 100}vw`;
            p.style.top = `${Math.random() * 100}vh`;
            p.style.animation = `float ${Math.random() * 20 + 10}s linear infinite`;
            background.appendChild(p);
        }
    }

    const ss = document.createElement("style");
    ss.innerText = `@keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0.7; }
        50% { transform: translateY(-20px) translateX(20px); opacity: 0.3; }
        100% { transform: translateY(0) translateX(0); opacity: 0.7; }
    }`;
    document.head.appendChild(ss);
    createParticles();

    // --- Confetti ---
    function launchConfetti() {
        const container = document.querySelector('#step5');
        const colors = ['#D13F13', '#FAE170', '#FFC0C0', '#80B0E8', '#F29CC3', '#D6D35F', '#F4D242', '#008471'];
        for (let i = 0; i < 150; i++) {
            const c = document.createElement('div');
            const size = Math.random() * 10 + 5;
            const isCircle = Math.random() > 0.5;
            c.style.position = 'absolute';
            c.style.width = `${size}px`;
            c.style.height = isCircle ? `${size}px` : `${size * 0.6}px`;
            c.style.borderRadius = isCircle ? '50%' : '2px';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.left = `${Math.random() * 100}%`;
            c.style.top = `-${Math.random() * 20 + 10}%`;
            c.style.opacity = Math.random() * 0.8 + 0.2;
            c.style.zIndex = '100';
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            c.style.animation = `confettiFall ${duration}s ${delay}s ease-in forwards`;
            c.style.setProperty('--sway', `${(Math.random() - 0.5) * 200}px`);
            c.style.setProperty('--spin', `${Math.random() * 720 - 360}deg`);
            container.appendChild(c);
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.target.id === 'step5' && m.target.classList.contains('active')) launchConfetti();
        });
    });
    observer.observe(steps.step5, { attributes: true, attributeFilter: ['class'] });
});
