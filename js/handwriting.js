        document.querySelectorAll('.handwriting-card').forEach(card => {
        const canvas = card.querySelector('canvas');
        const img = card.querySelector('img');
        const ctx = canvas.getContext('2d');
        const buttons = card.querySelectorAll('.tool-btn');
        let drawing = false;
        let tool = 'draw';
        const id = card.dataset.id;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
            const selected = btn.dataset.tool;
            if (selected === 'clear') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                localStorage.removeItem('markup_' + id);
            } else {
                tool = selected;
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            });
        });
        buttons[0].classList.add('active');

        function resizeCanvas() {
            canvas.width = img.clientWidth;
            canvas.height = img.clientHeight;
            loadCanvasData();
        }

        img.onload = resizeCanvas;
        if (img.complete) resizeCanvas();

        canvas.addEventListener('mousedown', e => {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });

        canvas.addEventListener('mousemove', e => {
            if (!drawing) return;
            ctx.lineTo(e.offsetX, e.offsetY);

            if (tool === 'draw') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = '#ff4d00';
            ctx.lineWidth = 2;
            } else if (tool === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 10;
            }

            ctx.lineCap = 'round';
            ctx.stroke();
        });

        canvas.addEventListener('mouseup', () => {
            drawing = false;
            ctx.globalCompositeOperation = 'source-over';
            saveCanvasData();
        });

        canvas.addEventListener('mouseleave', () => {
            if (drawing) {
            drawing = false;
            ctx.globalCompositeOperation = 'source-over';
            saveCanvasData();
            }
        });

        function saveCanvasData() {
            localStorage.setItem('markup_' + id, canvas.toDataURL());
        }

        function loadCanvasData() {
            const data = localStorage.getItem('markup_' + id);
            if (data) {
            const imgData = new Image();
            imgData.onload = () => ctx.drawImage(imgData, 0, 0);
            imgData.src = data;
            }
        }
        });

    const matchBtn = document.getElementById('match-btn');
    const notMatchBtn = document.getElementById('not-match-btn');
    const matchDetails = document.getElementById('match-details');

    function updateVerdictUI(verdict) {
    if (verdict === 'match') {
        matchBtn.classList.add('selected');
        notMatchBtn.classList.remove('selected');
    } else if (verdict === 'not-match') {
        notMatchBtn.classList.add('selected');
        matchBtn.classList.remove('selected');
    }
    }

    matchBtn.addEventListener('click', () => {
    localStorage.setItem('hw_verdict', 'match');
    updateVerdictUI('match');
    });

    notMatchBtn.addEventListener('click', () => {
    localStorage.setItem('hw_verdict', 'not-match');
    updateVerdictUI('not-match');
    });

    matchDetails.addEventListener('input', () => {
    localStorage.setItem('hw_notes', matchDetails.value);
    });

    // Load saved decision and notes
    const savedVerdict = localStorage.getItem('hw_verdict');
    const savedNotes = localStorage.getItem('hw_notes');
    if (savedVerdict) updateVerdictUI(savedVerdict);
    if (savedNotes) matchDetails.value = savedNotes;

    function loadPageHandwriting() {
    //If we wanted to load something on load
    }

// Make it globally accessible
window.loadPageHandwriting = loadPageHandwriting;