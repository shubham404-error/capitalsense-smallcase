(function() {
  function initAssistant() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatLog = document.getElementById('chatLog');
    
    if (!chatForm || !chatInput || !chatLog) return;
    
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const prompt = chatInput.value.trim();
      if (!prompt) return;

      // Append User message
      chatLog.innerHTML += 
        '<div class="msg-user">' +
          '<div class="msg-user-hdr">You</div>' +
          '<div class="msg-user-body">' + window.esc(prompt) + '</div>' +
        '</div>';
      
      chatInput.value = '';
      chatLog.scrollTop = chatLog.scrollHeight;

      // Append Loading message
      const loadingId = 'loading-' + Date.now();
      chatLog.innerHTML += 
        '<div id="' + loadingId + '" class="msg-ai">' +
          '<div class="msg-ai-hdr">CapitalSense Research</div>' +
          '<div class="msg-ai-body" style="display:flex; align-items:center; gap:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 2s linear infinite;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"/></svg>' +
            'Thinking...' +
          '</div>' +
        '</div>';
      
      chatLog.scrollTop = chatLog.scrollHeight;

      try {
        // Build robust context
        const curatedContext = {};
        for (const [stratId, strat] of Object.entries(window.STRATEGIES)) {
          curatedContext[stratId] = {
            Style: strat.style,
            Lens: strat.lens,
            Themes: strat.themes.map(t => ({
              Title: t.title,
              Body: t.body,
              Weight: t.weight + '%',
              Takeaway: t.takeaway,
              Holdings: t.holdings.map(h => ({
                Company: h.name,
                Weight: h.wt + '%',
                Role: h.role,
                Thesis: h.thesis,
                Bottleneck: h.bottleneck || 'N/A',
                Metrics: (h.metrics && h.metrics.length > 0) ? h.metrics.join(', ') : 'None',
                Watch: h.watch,
                Risk: h.risk,
                PortfolioDecision: h.portfolioDecision ? (h.portfolioDecision.considered + ' vs ' + h.portfolioDecision.selected + '. Why: ' + h.portfolioDecision.whySelected) : 'N/A',
                CrossPortfolio: (h.crossPortfolio && h.crossPortfolio.shared) ? 'Yes' : 'No'
              }))
            }))
          };
        }

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, context: JSON.stringify(curatedContext) })
        });
        
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        
        if (!response.ok) {
          throw new Error('AI API Error');
        }
        
        const data = await response.json();
        
        // Escape raw text first, then apply formatting for safe Markdown rendering
        let formattedText = window.esc(data.response).replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong></strong>');
        
        chatLog.innerHTML += 
          '<div class="msg-ai">' +
            '<div class="msg-ai-hdr">CapitalSense Research</div>' +
            '<div class="msg-ai-body">' + formattedText + '</div>' +
          '</div>';
          
      } catch (error) {
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        
        chatLog.innerHTML += 
          '<div class="msg-ai">' +
            '<div class="msg-ai-hdr" style="color: #dc2626;">System Error</div>' +
            '<div class="msg-ai-body" style="background: #fef2f2; color: #991b1b; border-color: #f87171;">' +
              'Could not reach the AI assistant. Please try again later.' +
            '</div>' +
          '</div>';
      }
      
      chatLog.scrollTop = chatLog.scrollHeight;
    });
  }

  window.initAssistant = initAssistant;
})();
