(function() {
  function openStockModal(options) {
    var ticker = options.stock;
    var strategyId = options.strategy;
    
    var sData = window.STRATEGIES[strategyId];
    if (!sData) return;
    
    var stock = null;
    sData.themes.forEach(function(t) {
      t.holdings.forEach(function(h) {
        if (h.ticker === ticker) stock = h;
      });
    });
    if (!stock) return;

    var modal = document.getElementById('stockModal');
    if (!modal) return;
    
    var content = document.getElementById('stockModalContent');
    
    var overlapHtml = '';
    if (stock.crossPortfolio && stock.crossPortfolio.shared) {
      var otherStrategy = strategyId === 'india-emergent-industries' ? 'india-execution-engine' : 'india-emergent-industries';
      var otherName = window.STRATEGIES[otherStrategy].name;
      
      var otherWeight = 0;
      window.STRATEGIES[otherStrategy].themes.forEach(function(t) {
        t.holdings.forEach(function(h) {
          if (h.ticker === ticker) otherWeight = h.wt;
        });
      });
      
      overlapHtml = '<div class="sm-section"><h4>PORTFOLIO CONTEXT</h4><p>Also held in ' + window.esc(otherName) + ': <b>' + otherWeight + '%</b></p></div>';
    }

    var watchHtml = '';
    if (stock.watch && stock.watch.length) {
      watchHtml = stock.watch.map(function(w) {
        return '<span class="sm-pill">' + window.esc(w) + '</span>';
      }).join(' ');
    }

    var metricsHtml = '';
    if (stock.metrics && stock.metrics.length) {
      metricsHtml = '<hr class="sm-divider"><div class="sm-section"><h4>KEY METRICS</h4><div class="sm-pills">' + 
        stock.metrics.map(function(m) { return '<span class="sm-pill" style="background:var(--brass);">' + window.esc(m) + '</span>'; }).join(' ') +
        '</div></div>';
    }

    content.innerHTML = 
      '<div class="sm-header">' +
        '<h2>' + window.esc(stock.name) + '</h2>' +
        '<div class="sm-meta"><span>' + window.esc(stock.ticker) + '</span><span>' + stock.wt + '% PORTFOLIO WEIGHT</span></div>' +
      '</div>' +
      '<hr class="sm-divider">' +
      '<div class="sm-section"><h4>WHY IT IS HERE</h4><p>' + window.esc(stock.thesis) + '</p></div>' +
      '<hr class="sm-divider">' +
      '<div class="sm-section"><h4>THE BOTTLENECK</h4><p>' + window.esc(stock.bottleneck || '') + '</p></div>' +
      '<hr class="sm-divider">' +
      '<div class="sm-section"><h4>ROLE</h4><p>' + window.esc(stock.role) + '</p></div>' +
      metricsHtml +
      '<hr class="sm-divider">' +
      '<div class="sm-section"><h4>WHAT WE WATCH</h4><div class="sm-pills">' + watchHtml + '</div></div>' +
      '<hr class="sm-divider">' +
      '<div class="sm-section"><h4>RISK</h4><p>' + window.esc(stock.risk) + '</p></div>' +
      (overlapHtml ? '<hr class="sm-divider">' + overlapHtml : '');
      
    modal.showModal();
  }

  window.openStockModal = openStockModal;
  
  window.closeStockModal = function() {
    var modal = document.getElementById('stockModal');
    if (modal) modal.close();
  };
})();
