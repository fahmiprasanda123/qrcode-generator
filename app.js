/**
 * HonestQR — 100% Free, Non-Expiring QR Code Generator
 * Pure QR Code Matrix (No Center Logo Obstruction)
 * No Redirects. No Expiry. 100% Client-Side.
 * Author: Fahmi Prasanda
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const typeTabs = document.querySelectorAll('.type-tab');
  const formPanes = document.querySelectorAll('.form-pane');
  const rawPayloadEl = document.getElementById('raw-payload');
  const qrCanvas = document.getElementById('qr-canvas');
  const qrWrapper = document.getElementById('qr-wrapper');
  const toast = document.getElementById('toast');

  // Colors & Theme
  const qrColorDark = document.getElementById('qr-color-dark');
  const qrColorLight = document.getElementById('qr-color-light');
  const hexDark = document.getElementById('hex-dark');
  const hexLight = document.getElementById('hex-light');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // Sliders
  const qrSizeSlider = document.getElementById('qr-size');
  const valSize = document.getElementById('val-size');
  const qrMarginSlider = document.getElementById('qr-margin');
  const valMargin = document.getElementById('val-margin');

  // Action Buttons
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnDownloadSvg = document.getElementById('btn-download-svg');
  const btnCopyImage = document.getElementById('btn-copy-image');

  // Form inputs
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

  // Hidden container for QRCode.js engine
  const hiddenQrDiv = document.createElement('div');
  hiddenQrDiv.style.display = 'none';
  document.body.appendChild(hiddenQrDiv);

  // =========================================================================
  // Payload Builders
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
  // QR Code Rendering Pipeline (Pure QR Matrix, No Obstructions)
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
        correctLevel: QRCode.CorrectLevel.M // Standard clean level for pure QR
      });

      setTimeout(() => {
        const sourceCanvas = hiddenQrDiv.querySelector('canvas');
        if (!sourceCanvas) return;

        qrCanvas.width = exportSize;
        qrCanvas.height = exportSize;
        const ctx = qrCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Crisp pixel perfection

        ctx.fillStyle = lightColor;
        ctx.fillRect(0, 0, exportSize, exportSize);

        // Draw pure, pristine QR code matrix
        ctx.drawImage(sourceCanvas, 0, 0, exportSize, exportSize);

        qrWrapper.style.backgroundColor = lightColor;
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

  qrSizeSlider.addEventListener('input', () => {
    valSize.textContent = `${qrSizeSlider.value} px`;
    generateQR();
  });

  qrMarginSlider.addEventListener('input', () => {
    valMargin.textContent = `${qrMarginSlider.value} modules`;
    generateQR();
  });

  // Real-time live update on every input keystroke
  const allInputs = document.querySelectorAll(
    '.form-container input, .form-container textarea, .form-container select'
  );
  allInputs.forEach(input => {
    input.addEventListener('input', generateQR);
    input.addEventListener('change', generateQR);
  });

  // =========================================================================
  // Download & Copy Handlers
  // =========================================================================

  // 1. Download PNG
  btnDownloadPng.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `HonestQR_${currentType}_${Date.now()}.png`;
    link.href = qrCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Downloaded high-resolution PNG!');
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
    showToast('📥 Downloaded Vector SVG!');
  });

  // 3. Copy Image to Clipboard
  btnCopyImage.addEventListener('click', async () => {
    try {
      qrCanvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('📋 Copied QR Image to clipboard!');
      });
    } catch (err) {
      showToast('❌ Copy not supported in this browser. Please download PNG instead.');
    }
  });

  // Helper: Toast Notifications
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Initial Generation on load
  generateQR();
});
