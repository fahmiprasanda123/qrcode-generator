/**
 * HonestQR - Permanent, Non-Expiring QR Code Generator
 * In-browser client-side engine (Zero Redirects, Zero Server Traps)
 * Author: Fahmi Prasanda
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements: Navigation & Theme
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');

  // Elements: Type Selection & Forms
  const typeTabs = document.querySelectorAll('.type-tab');
  const formPanes = document.querySelectorAll('.form-pane');
  const rawPayloadEl = document.getElementById('raw-payload');
  const qrCanvas = document.getElementById('qr-canvas');
  const qrBox = document.getElementById('qr-canvas-box');
  const toastBox = document.getElementById('toast');

  // Elements: Color Customization
  const qrColorDark = document.getElementById('qr-color-dark');
  const qrColorLight = document.getElementById('qr-color-light');
  const hexDark = document.getElementById('hex-dark');
  const hexLight = document.getElementById('hex-light');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // Elements: Sliders
  const qrSizeSlider = document.getElementById('qr-size');
  const valSize = document.getElementById('val-size');
  const qrMarginSlider = document.getElementById('qr-margin');
  const valMargin = document.getElementById('val-margin');

  // Elements: Actions
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnDownloadSvg = document.getElementById('btn-download-svg');
  const btnCopyImage = document.getElementById('btn-copy-image');

  // Elements: Form Inputs
  const inputUrl = document.getElementById('input-url');
  
  const wifiSsid = document.getElementById('wifi-ssid');
  const wifiPass = document.getElementById('wifi-pass');
  const wifiType = document.getElementById('wifi-type');
  const wifiHidden = document.getElementById('wifi-hidden');

  const waPhone = document.getElementById('wa-phone');
  const waMsg = document.getElementById('wa-msg');

  const vcardFn = document.getElementById('vcard-fn');
  const vcardTel = document.getElementById('vcard-tel');
  const vcardEmail = document.getElementById('vcard-email');
  const vcardOrg = document.getElementById('vcard-org');
  const vcardUrl = document.getElementById('vcard-url');

  const inputText = document.getElementById('input-text');

  const emailTo = document.getElementById('email-to');
  const emailSub = document.getElementById('email-sub');
  const emailBody = document.getElementById('email-body');

  // App State
  let currentType = 'url';
  let qrcodeInstance = null;

  // Off-screen container for QRCode.js engine
  const hiddenQrDiv = document.createElement('div');
  hiddenQrDiv.style.display = 'none';
  document.body.appendChild(hiddenQrDiv);

  // =========================================================================
  // Theme Management (Light / Dark)
  // =========================================================================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('honestqr-theme', theme);

    if (theme === 'dark') {
      if (themeIconSun) themeIconSun.style.display = 'block';
      if (themeIconMoon) themeIconMoon.style.display = 'none';
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      if (themeIconSun) themeIconSun.style.display = 'none';
      if (themeIconMoon) themeIconMoon.style.display = 'block';
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  const savedTheme = localStorage.getItem('honestqr-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // =========================================================================
  // Payload Builder Pipeline
  // =========================================================================
  function getPayload() {
    switch (currentType) {
      case 'url': {
        let val = (inputUrl.value || '').trim();
        if (!val) return 'https://';
        if (!/^https?:\/\//i.test(val)) {
          val = 'https://' + val;
        }
        return val;
      }
      case 'wifi': {
        const ssid = (wifiSsid.value || '').trim();
        const pass = (wifiPass.value || '').trim();
        const type = wifiType.value || 'WPA';
        const hidden = wifiHidden.checked ? 'true' : 'false';
        return `WIFI:S:${ssid};T:${type};P:${pass};H:${hidden};;`;
      }
      case 'whatsapp': {
        const rawPhone = (waPhone.value || '').replace(/[^0-9]/g, '');
        const msg = encodeURIComponent((waMsg.value || '').trim());
        return `https://wa.me/${rawPhone}${msg ? '?text=' + msg : ''}`;
      }
      case 'vcard': {
        const fn = (vcardFn.value || '').trim();
        const tel = (vcardTel.value || '').trim();
        const email = (vcardEmail.value || '').trim();
        const org = (vcardOrg.value || '').trim();
        const url = (vcardUrl.value || '').trim();

        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${fn}`,
          `N:${fn};;;;`,
          tel ? `TEL:${tel}` : '',
          email ? `EMAIL:${email}` : '',
          org ? `ORG:${org}` : '',
          url ? `URL:${url}` : '',
          'END:VCARD'
        ].filter(line => line.length > 0).join('\n');
      }
      case 'text': {
        return (inputText.value || '').trim() || 'HonestQR';
      }
      case 'email': {
        const to = (emailTo.value || '').trim();
        const sub = encodeURIComponent((emailSub.value || '').trim());
        const body = encodeURIComponent((emailBody.value || '').trim());
        return `mailto:${to}?subject=${sub}&body=${body}`;
      }
      default:
        return 'https://honestqr.org';
    }
  }

  // =========================================================================
  // QR Code Rendering Pipeline
  // =========================================================================
  function generateQR() {
    const payload = getPayload();
    rawPayloadEl.textContent = payload;

    const exportSize = parseInt(qrSizeSlider.value, 10) || 1024;
    const darkColor = qrColorDark.value || '#0f172a';
    const lightColor = qrColorLight.value || '#ffffff';

    hiddenQrDiv.innerHTML = '';

    try {
      qrcodeInstance = new QRCode(hiddenQrDiv, {
        text: payload,
        width: exportSize,
        height: exportSize,
        colorDark: darkColor,
        colorLight: lightColor,
        correctLevel: QRCode.CorrectLevel.M
      });

      setTimeout(() => {
        const sourceCanvas = hiddenQrDiv.querySelector('canvas');
        if (!sourceCanvas) return;

        qrCanvas.width = exportSize;
        qrCanvas.height = exportSize;
        const ctx = qrCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        ctx.fillStyle = lightColor;
        ctx.fillRect(0, 0, exportSize, exportSize);

        ctx.drawImage(sourceCanvas, 0, 0, exportSize, exportSize);
        if (qrBox) {
          qrBox.style.backgroundColor = lightColor;
        }
      }, 25);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }

  // =========================================================================
  // Tab Switching
  // =========================================================================
  typeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      typeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetType = tab.dataset.type;
      currentType = targetType;

      formPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `form-${targetType}`) {
          pane.classList.add('active');
        }
      });

      generateQR();
    });
  });

  // =========================================================================
  // Theme Presets & Color Handlers
  // =========================================================================
  qrColorDark.addEventListener('input', () => {
    hexDark.textContent = qrColorDark.value.toUpperCase();
    presetButtons.forEach(b => b.classList.remove('active'));
    generateQR();
  });

  qrColorLight.addEventListener('input', () => {
    hexLight.textContent = qrColorLight.value.toUpperCase();
    presetButtons.forEach(b => b.classList.remove('active'));
    generateQR();
  });

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const dark = btn.dataset.dark;
      const light = btn.dataset.light;

      qrColorDark.value = dark;
      qrColorLight.value = light;
      hexDark.textContent = dark.toUpperCase();
      hexLight.textContent = light.toUpperCase();

      generateQR();
    });
  });

  // Slider adjustments
  qrSizeSlider.addEventListener('input', () => {
    valSize.textContent = `${qrSizeSlider.value} px`;
    generateQR();
  });

  qrMarginSlider.addEventListener('input', () => {
    valMargin.textContent = `${qrMarginSlider.value} modules`;
    generateQR();
  });

  // Real-time input listening
  const allInputs = document.querySelectorAll(
    '.form-card input, .form-card textarea, .form-card select'
  );
  allInputs.forEach(input => {
    input.addEventListener('input', generateQR);
    input.addEventListener('change', generateQR);
  });

  // =========================================================================
  // Export Handlers
  // =========================================================================

  // 1. Download High-Res PNG
  btnDownloadPng.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `HonestQR_${currentType}_${Date.now()}.png`;
    link.href = qrCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded PNG file.');
  });

  // 2. Download Vector SVG
  btnDownloadSvg.addEventListener('click', () => {
    const exportSize = parseInt(qrSizeSlider.value, 10) || 1024;
    const lightColor = qrColorLight.value || '#ffffff';
    const dataUrl = qrCanvas.toDataURL('image/png');

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${exportSize} ${exportSize}" width="${exportSize}" height="${exportSize}">
  <rect width="100%" height="100%" fill="${lightColor}"/>
  <image xlink:href="${dataUrl}" width="${exportSize}" height="${exportSize}"/>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `HonestQR_${currentType}_${Date.now()}.svg`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded Vector SVG file.');
  });

  // 3. Copy Image to Clipboard
  btnCopyImage.addEventListener('click', async () => {
    try {
      qrCanvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Copied QR image to clipboard.');
      });
    } catch (err) {
      showToast('Clipboard copy not supported. Please download PNG.');
    }
  });

  // Toast Notification helper
  let toastTimer;
  function showToast(message) {
    if (!toastBox) return;
    clearTimeout(toastTimer);
    toastBox.textContent = message;
    toastBox.classList.add('show');
    toastTimer = setTimeout(() => {
      toastBox.classList.remove('show');
    }, 2600);
  }

  // Initial trigger
  generateQR();
});
