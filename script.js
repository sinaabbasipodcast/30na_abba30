document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('poemsGrid');
    const searchInput = document.getElementById('searchInput');
    const modalOverlay = document.getElementById('poemModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalVerses = document.getElementById('modalVerses');
    const modalSignature = document.getElementById('modalSignature');

    // رندر کردن کارت‌های شعر در صفحه اصلی
    function renderPoems(poemsToRender) {
        gridContainer.innerHTML = '';
        
        if (poemsToRender.length === 0) {
            gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #7a6e67;">شعری با این مشخصات پیدا نشد...</p>';
            return;
        }

        poemsToRender.forEach(poem => {
            const card = document.createElement('div');
            card.className = 'poem-card';
            
            // بیت اول به عنوان پیش‌نمایش در کارت
            const firstVerse = poem.verses[0] || '';

            card.innerHTML = `
                <h3>${poem.title}</h3>
                <div class="date">${poem.date}</div>
                <div class="snippet">${firstVerse}</div>
            `;

            // رویداد کلیک برای باز شدن کتاب و متن کامل در مودال
            card.addEventListener('click', () => {
                openModal(poem);
            });

            gridContainer.appendChild(card);
        });
    }

    // باز کردن مودال و نمایش متن کامل ابیات
    function openModal(poem) {
        modalTitle.textContent = poem.title;
        modalDate.textContent = poem.date;
        
        modalVerses.innerHTML = '';
        poem.verses.forEach(verse => {
            const p = document.createElement('p');
            p.textContent = verse;
            modalVerses.appendChild(p);
        });

        modalSignature.textContent = poem.signature;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // قفل کردن اسکرول صفحه پشت مودال
    }

    // بستن مودال
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // بستن با دکمه Escape کیبورد
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // قابلیت جستجو در میان عنوان‌ها یا ابیات غزل‌ها
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        
        const filtered = poemsData.filter(poem => {
            const matchTitle = poem.title.toLowerCase().includes(term);
            const matchVerses = poem.verses.some(v => v.toLowerCase().includes(term));
            return matchTitle || matchVerses;
        });

        renderPoems(filtered);
    });

    // بارگذاری اولیه‌ی صفحه
    renderPoems(poemsData);
});
