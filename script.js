const pasteBtn = document.getElementById('paste-btn');
const downloadBtn = document.getElementById('download-btn');
const toggleModeBtn = document.getElementById('toggle-mode-btn');
const igLinkInput = document.getElementById('ig-link');
const previewSection = document.getElementById('preview-section');
const videoPreview = document.getElementById('video-preview');
const previewMessage = document.getElementById('preview-message');
const statusContainer = document.getElementById('status-container');

// Add bouncing effect on mouse move
toggleModeBtn.addEventListener('mousemove', (e) => {
  const rect = toggleModeBtn.getBoundingClientRect();
  const offsetX = e.clientX - (rect.left + rect.width / 2);
  const offsetY = e.clientY - (rect.top + rect.height / 2);
  const maxOffset = 15; // max pixels to move
  const moveX = Math.min(Math.max(offsetX / 5, -maxOffset), maxOffset);
  const moveY = Math.min(Math.max(offsetY / 5, -maxOffset), maxOffset);
  toggleModeBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

toggleModeBtn.addEventListener('mouseleave', () => {
  toggleModeBtn.style.transform = 'translate(0, 0)';
});

toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Toggle icon color for visibility
  if (document.body.classList.contains('dark-mode')) {
    toggleModeBtn.style.color = '#ffeb3b'; // bright yellow for dark mode
  } else {
    toggleModeBtn.style.color = '#fff'; // white for light mode
  }
});

downloadBtn.addEventListener('click', async () => {
  const url = igLinkInput.value.trim();
  if (!url) {
    alert('Mohon masukkan link Instagram terlebih dahulu.');
    return;
  }
  // Basic validation for Instagram post URL
  if (!/^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+/.test(url)) {
    alert('Link Instagram tidak valid. Pastikan link adalah postingan Instagram.');
    return;
  }

  statusContainer.textContent = 'Loading...';
  previewMessage.textContent = '';
  previewSection.style.display = 'none';
  videoPreview.style.display = 'none';

  try {
    // Example API endpoint for Instagram video download (replace with actual API)
    const apiUrl = `http://localhost:3001/api/download?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari API.');
    }
    const data = await response.json();

    if (data && data.media && data.media.length > 0) {
      statusContainer.textContent = '';
      previewSection.style.display = 'flex';

      // Show first media as preview (video or image)
      const firstMedia = data.media[0];
      if (firstMedia.endsWith('.mp4') || firstMedia.endsWith('.webm')) {
        videoPreview.src = firstMedia;
        videoPreview.style.display = 'block';
      } else {
        videoPreview.style.display = 'none';
      }
      previewMessage.textContent = 'Video berhasil diambil. Silakan putar di bawah.';

      // Create or update download button
      let downloadLink = document.getElementById('download-link');
      if (!downloadLink) {
        downloadLink = document.createElement('a');
        downloadLink.id = 'download-link';
        downloadLink.textContent = 'Unduh Video';
        downloadLink.style.display = 'inline-block';
        downloadLink.style.marginTop = '1rem';
        downloadLink.style.padding = '0.7rem 1.2rem';
        downloadLink.style.background = 'linear-gradient(135deg, #ff6ea1, #7b2ff7)';
        downloadLink.style.color = '#fff';
        downloadLink.style.borderRadius = '12px';
        downloadLink.style.textDecoration = 'none';
        downloadLink.style.fontWeight = '700';
        downloadLink.style.boxShadow = '0 6px 16px rgba(123, 47, 247, 0.6)';
        downloadLink.style.userSelect = 'none';
        downloadLink.style.textAlign = 'center';
        downloadLink.style.display = 'block';
        downloadLink.style.width = 'fit-content';
        downloadLink.style.marginLeft = 'auto';
        downloadLink.style.marginRight = 'auto';
        previewSection.appendChild(downloadLink);
      }
      downloadLink.href = firstMedia;
      downloadLink.download = 'instagram-video.mp4';
      downloadLink.style.display = 'block';
    } else {
      statusContainer.textContent = '';
      previewMessage.textContent = '';
      previewSection.style.display = 'none';
      throw new Error('Media tidak ditemukan dalam respons API.');
    }
  } catch (error) {
    statusContainer.textContent = '';
    previewMessage.textContent = '';
    previewSection.style.display = 'none';
    alert(error.message || 'Terjadi kesalahan saat mengambil video.');
  }
});
