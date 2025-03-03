// No matrix background animation

// Function to create a typing effect with scrambling
function typeTextWithScramble(element, finalText, speed = 3) {
    element.innerHTML = '';
    let displayText = "";
    let currentIndex = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:<>,.?/";
  
    // Initial scrambling phase - much shorter now
    const scrambleDuration = 500; // Just 0.5 seconds of scrambling
    const startTime = Date.now();
  
    function scramble() {
      const elapsed = Date.now() - startTime;
  
      if (elapsed < scrambleDuration) {
        // During scramble phase, generate random text (but less of it)
        let scrambledText = "";
        for (let i = 0; i < 50; i++) {
          scrambledText += chars[Math.floor(Math.random() * chars.length)];
          if (i % 20 === 19) scrambledText += "\n";
        }
        element.innerHTML = scrambledText;
        setTimeout(scramble, 30);
      } else {
        // Start revealing the actual text
        revealText();
      }
    }
  
    function revealText() {
      // Reveal text much faster, 10 characters at a time
      if (currentIndex < finalText.length) {
        // Calculate how many characters to add at once (up to 10)
        const charsToAdd = Math.min(10, finalText.length - currentIndex);
        displayText += finalText.substr(currentIndex, charsToAdd);
        element.innerHTML = displayText;
        currentIndex += charsToAdd;
        setTimeout(revealText, speed);
      } else {
        // Add blinking cursor at the end
        element.classList.add('typing-complete');
      }
      // Auto-scroll to bottom as text appears
      element.scrollTop = element.scrollHeight;
    }
  
    // Start the scrambling effect
    scramble();
  }
  
  async function sendMessage() {
    const input = document.getElementById('userInput').value;
    const responseDiv = document.getElementById('response');
    if (!input) {
      responseDiv.innerHTML = '[ERROR] Input required. Please provide query parameters.';
      return;
    }
  
    // Hacker-style typing effect for loading
    typeTextWithScramble(responseDiv, '[POGI] HULAT KA DA DI MAG MADALI...\n[POGI] KALMA KA HA KUPAL....\n');
  
    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer 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',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [{ role: 'user', content: input }],
          }),
        },
      );
      const data = await response.json();
      console.log(data);
  
      const markdownText =
        data.choices?.[0]?.message?.content || '[ERROR] No response received from server.';
  
      // Type out the response with a scrambling effect
      typeTextWithScramble(responseDiv, '[OUTPUT]\n' + markdownText);
    } catch (error) {
      responseDiv.innerHTML = '[FATAL ERROR] Connection failed: ' + error.message;
    }
  
    // Clear the input field after sending
    document.getElementById('userInput').value = '';
  }
  
  // Add event listeners
  document.addEventListener('DOMContentLoaded', function() {
    // Enter key handler
    document.getElementById('userInput').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        // If shift is held, insert a new line instead of sending
        if (event.shiftKey) {
          // Don't prevent default to allow the newline to be inserted
          return;
        } else {
          // Regular Enter key without shift - send message
          event.preventDefault();
          sendMessage();
        }
      }
    });
  
    // Mode toggle handler
    const modeToggle = document.getElementById('modeToggle');
    modeToggle.addEventListener('change', function() {
      const body = document.body;
  
      if (this.checked) {
        // Switch to light/heaven mode
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        document.querySelector('.toggle-label').textContent = 'Heaven MODE';
      } else {
        // Switch to dark/evil mode
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        document.querySelector('.toggle-label').textContent = 'Evil MODE';
      }
    });
  });