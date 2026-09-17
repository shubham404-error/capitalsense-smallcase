(function() {
  function renderExclusions(strategyId) {
    var sData = window.STRATEGIES[strategyId];
    if (!sData) return '';
    
    var cardsHtml = '';
    
    sData.themes.forEach(function(t) {
      t.holdings.forEach(function(h) {
        if (h.portfolioDecision) {
          cardsHtml += '<div class="decision-card">' +
            '<div class="dec-theme">' + t.label + '</div>' +
            '<div class="dec-split">' +
              '<div class="dec-side dec-alt">' +
                '<h5>THE ALTERNATIVE</h5>' +
                '<h3>' + h.portfolioDecision.considered + '</h3>' +
              '</div>' +
              '<div class="dec-vs">VS</div>' +
              '<div class="dec-side dec-choice">' +
                '<h5>OUR CHOICE</h5>' +
                '<h3>' + h.portfolioDecision.selected + '</h3>' +
              '</div>' +
            '</div>' +
            '<div class="dec-rationale">' +
              '<h5>WHY WE CHOSE IT</h5>' +
              '<p>' + h.portfolioDecision.whySelected + '</p>' +
            '</div>' +
            '<div class="dec-tradeoff">' +
              '<h5>THE TRADE-OFF</h5>' +
              '<p>' + h.portfolioDecision.tradeoff + '</p>' +
            '</div>' +
          '</div>';
        }
      });
    });

    if (!cardsHtml) return ''; // Only show section if decisions exist

    return '<div class="portfolio-decisions">' +
      '<div class="perf-head"><span class="dot"></span><strong>Portfolio Decisions</strong><span>Why we don\\'t own everything</span></div>' +
      '<div class="decisions-grid">' + cardsHtml + '</div>' +
    '</div>';
  }

  window.renderPortfolioDecisions = renderExclusions;
})();
