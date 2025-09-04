const promptEl = document.getElementById('prompt');
const sendBtn = document.getElementById('send');
const outEl = document.getElementById('output');
const statusEl = document.getElementById('status');

sendBtn.addEventListener('click', async () => {
  const prompt = (promptEl.value || '').trim();
  if (!prompt) {
    outEl.textContent = 'Please enter a prompt.';
    return;
  }
  sendBtn.disabled = true;
  statusEl.textContent = '⏳ generating...';
  outEl.textContent = '';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (res.ok) {
      outEl.textContent = data.text || '(no text returned)';
    } else {
      outEl.textContent = `Error: ${data.error || 'unknown error'}`;
    }
  } catch (e) {
    outEl.textContent = 'Network or server error.';
  } finally {
    sendBtn.disabled = false;
    statusEl.textContent = '';
  }
});
