(() => {
  const log = (...args) => console.log('[IrisPlacement]', ...args);
  const canvas = document.getElementById('iris-paint-canvas');
  const brushPreview = document.getElementById('iris-placement-brush-preview');
  const gallery = document.getElementById('iris-placement-gallery');
  const list = document.getElementById('iris-furniture-list');
  const baseUploadInput = document.getElementById('iris-base-upload');
  const furnitureUploadInput = document.getElementById('iris-furniture-upload');
  const activeItemLabel = document.getElementById('iris-active-item-label');
  const applyBtn = document.getElementById('iris-placement-apply-btn');
  const loader = document.getElementById('iris-placement-loader');
  const baseUploadTrigger = document.getElementById('iris-base-upload-trigger');
  const galleryToggleBtn = document.getElementById('iris-gallery-toggle-btn');
  const galleryCloseBtn = document.getElementById('iris-gallery-close-btn');
  const galleryUploadBtn = document.getElementById('iris-gallery-upload-btn');
  const toolPanBtn = document.getElementById('iris-tool-pan');
  const toolPaintBtn = document.getElementById('iris-tool-paint');
  const toolClearBtn = document.getElementById('iris-tool-clear');
  const toolUploadBtn = document.getElementById('iris-tool-upload');

  log('module init', {
    hasCanvas: !!canvas,
    hasGallery: !!gallery,
    hasFurnitureInput: !!furnitureUploadInput
  });

  if (!canvas || !brushPreview || !gallery || !list || !baseUploadInput || !furnitureUploadInput || !activeItemLabel || !applyBtn || !loader) {
    log('missing critical elements, aborting mount');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    log('2d context unavailable');
    return;
  }

  let painting = false;
  let currentTool = 'pan';
  let selectedItemIndex = -1;
  let furnitureItems = [];

  const colorPalette = ['#FF3B30', '#34C759', '#007AFF', '#FF9500', '#AF52DE', '#5AC8FA', '#FFCC00'];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    log('resizeCanvas', { width: canvas.width, height: canvas.height });
  };

  const renderFurnitureList = () => {
    log('renderFurnitureList', { count: furnitureItems.length, selectedItemIndex });
    list.innerHTML = '';
    furnitureItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `iris-furniture-card ${selectedItemIndex === index ? 'selected' : ''}`;
      card.addEventListener('click', () => selectFurniture(index));
      card.innerHTML = `
        <img src="${item.src}" class="iris-furniture-thumb" alt="${item.name}">
        <div class="flex-1">
          <p class="text-[11px] font-bold uppercase tracking-wider text-white mb-1">${item.name}</p>
          <div class="flex items-center gap-2">
            <div class="iris-color-indicator" style="background-color:${item.color}"></div>
            <span class="text-[9px] text-gray-500 uppercase font-bold">Asignado a este color</span>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  };

  const checkState = () => {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let hasDrawing = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] !== 0) {
        hasDrawing = true;
        break;
      }
    }
    applyBtn.style.display = hasDrawing ? 'inline-flex' : 'none';
  };

  const clearCanvas = () => {
    log('clearCanvas');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    checkState();
  };

  const setTool = (tool) => {
    log('setTool', { tool });
    currentTool = tool;
    document.querySelectorAll('.iris-placement-tool-btn').forEach((btn) => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`iris-tool-${tool}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (tool === 'paint') {
      canvas.classList.add('active');
      brushPreview.style.display = 'block';
    } else {
      canvas.classList.remove('active');
      brushPreview.style.display = 'none';
    }
  };

  const selectFurniture = (index) => {
    selectedItemIndex = index;
    const item = furnitureItems[index];
    if (!item) {
      log('selectFurniture skipped: invalid index', { index });
      return;
    }
    log('selectFurniture', { index, name: item.name, color: item.color });
    activeItemLabel.textContent = `Ubicando: ${item.name}`;
    activeItemLabel.style.color = item.color;
    brushPreview.style.borderColor = item.color;
    renderFurnitureList();
    setTool('paint');
  };

  const toggleGallery = () => {
    log('toggleGallery before', {
      open: gallery.classList.contains('open'),
      className: gallery.className,
      transform: window.getComputedStyle(gallery).transform
    });
    gallery.classList.toggle('open');
    log('toggleGallery after', {
      open: gallery.classList.contains('open'),
      className: gallery.className,
      transform: window.getComputedStyle(gallery).transform,
      visibility: window.getComputedStyle(gallery).visibility
    });
  };
  const openGallery = () => {
    log('openGallery before', {
      open: gallery.classList.contains('open'),
      className: gallery.className,
      transform: window.getComputedStyle(gallery).transform
    });
    gallery.classList.add('open');
    log('openGallery after', {
      open: gallery.classList.contains('open'),
      className: gallery.className,
      transform: window.getComputedStyle(gallery).transform,
      visibility: window.getComputedStyle(gallery).visibility,
      zIndex: window.getComputedStyle(gallery).zIndex
    });
  };

  const draw = (event) => {
    if (selectedItemIndex < 0 || !furnitureItems[selectedItemIndex]) return;
    ctx.lineWidth = 50;
    ctx.lineCap = 'round';
    ctx.strokeStyle = furnitureItems[selectedItemIndex].color;
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
  };

  const uploadBaseRender = (event) => {
    const file = event?.target?.files?.[0];
    log('uploadBaseRender called', { hasFile: !!file, fileName: file?.name || null });
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      log('uploadBaseRender reader.onload', { fileName: file.name });
      const bgMain = document.getElementById('bg-main');
      if (bgMain && ev.target?.result) {
        bgMain.style.backgroundImage = `url('${ev.target.result}')`;
      }
      if (baseUploadTrigger) {
        baseUploadTrigger.classList.remove('animate-attention-pulse');
      }
      clearCanvas();
      openGallery();
      if (event?.target) event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const uploadFurniture = (event) => {
    const files = Array.from(event?.target?.files || []);
    log('uploadFurniture called', { count: files.length, fileNames: files.map((file) => file.name) });
    if (!files.length) return;
    openGallery();
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        log('uploadFurniture reader.onload', { fileName: file.name, currentCount: furnitureItems.length });
        const color = colorPalette[furnitureItems.length % colorPalette.length];
        const name = String(file.name || 'item').replace(/\.[^.]+$/, '');
        furnitureItems.push({
          id: `${Date.now()}-${Math.random()}`,
          src: String(ev.target?.result || ''),
          name,
          color
        });
        renderFurnitureList();
        selectFurniture(furnitureItems.length - 1);
        openGallery();
      };
      reader.readAsDataURL(file);
    });
    if (event?.target) event.target.value = '';
  };

  const processIA = () => {
    loader.style.display = 'flex';
    setTimeout(() => {
      loader.style.display = 'none';
      clearCanvas();
      const msg = document.createElement('div');
      msg.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-10 py-5 rounded-full font-bold z-[1000] animate-bounce';
      msg.textContent = 'ESPACIO GENERADO CON TUS MUEBLES';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 4000);
    }, 3500);
  };

  canvas.addEventListener('mousedown', (event) => {
    if (currentTool !== 'paint' || selectedItemIndex === -1) return;
    painting = true;
    draw(event);
  });

  canvas.addEventListener('mouseup', () => {
    painting = false;
    ctx.beginPath();
    checkState();
  });

  canvas.addEventListener('mouseleave', () => {
    painting = false;
    ctx.beginPath();
  });

  canvas.addEventListener('mousemove', (event) => {
    brushPreview.style.left = `${event.clientX}px`;
    brushPreview.style.top = `${event.clientY}px`;
    if (!painting) return;
    draw(event);
  });

  window.addEventListener('resize', resizeCanvas);
  baseUploadTrigger?.addEventListener('click', (event) => {
    event.preventDefault();
    log('baseUploadTrigger click');
    baseUploadInput.click();
  });
  galleryToggleBtn?.addEventListener('click', () => {
    log('galleryToggleBtn click');
    toggleGallery();
  });
  galleryCloseBtn?.addEventListener('click', () => {
    log('galleryCloseBtn click');
    toggleGallery();
  });
  galleryUploadBtn?.addEventListener('click', () => {
    log('galleryUploadBtn click');
    openGallery();
    furnitureUploadInput.click();
  });
  toolPanBtn?.addEventListener('click', () => setTool('pan'));
  toolPaintBtn?.addEventListener('click', () => setTool('paint'));
  toolClearBtn?.addEventListener('click', clearCanvas);
  toolUploadBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    log('toolUploadBtn click');
    openGallery();
    furnitureUploadInput.click();
  });
  applyBtn?.addEventListener('click', processIA);
  baseUploadInput.addEventListener('change', (event) => {
    log('baseUploadInput change');
    uploadBaseRender(event);
  });
  furnitureUploadInput.addEventListener('change', (event) => {
    log('furnitureUploadInput change');
    uploadFurniture(event);
  });

  resizeCanvas();
  setTool('pan');
  log('module ready');
})();

