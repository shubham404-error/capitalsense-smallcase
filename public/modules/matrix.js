(function() {
  var MATRIX_STATE = {
    'india-emergent-industries': { filter: 'all', search: '' },
    'india-execution-engine': { filter: 'all', search: '' }
  };
  var currentStrategy = null;

  function normalize(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function renderMatrix(strategyId) {
    currentStrategy = strategyId;
    var sData = window.STRATEGIES[strategyId];
    if (!sData) return '';
    
    var state = MATRIX_STATE[strategyId];
    
    // Build filters
    var filtersHtml = '<button class="matrix-filter ' + (state.filter === 'all' ? 'active' : '') + '" onclick="window.filterMatrix(\'all\')">All</button>';
    sData.themes.forEach(function(t) {
      filtersHtml += '<button class="matrix-filter ' + (state.filter === t.id ? 'active' : '') + '" onclick="window.filterMatrix(\'' + t.id + '\')">' + window.esc(t.label) + '</button>';
    });

    var searchHtml = '<input type="text" id="matrixSearch" class="matrix-search" placeholder="Search company, ticker or thesis..." value="' + window.esc(state.search) + '" onkeyup="window.searchMatrix(this.value)">';

    // Build rows
    var rowsHtml = '';
    sData.themes.forEach(function(t) {
      if (state.filter !== 'all' && state.filter !== t.id) return;
      
      t.holdings.forEach(function(h) {
        var matchStr = normalize(h.name + h.ticker + h.role + h.thesis + h.bottleneck);
        if (state.search && matchStr.indexOf(normalize(state.search)) === -1) return;
        
        rowsHtml += '<tr class="matrix-row">' +
          '<td><div class="m-co">' + window.esc(h.name) + '<span>' + window.esc(h.ticker) + '</span></div></td>' +
          '<td class="n">' + h.wt + '%</td>' +
          '<td>' + window.esc(h.role) + '</td>' +
          '<td class="m-thesis">' + window.esc(h.thesis) + '</td>' +
          '<td>' + window.esc(h.watch.join(', ')) + '</td>' +
          '<td><button class="btn-ghost btn-research" onclick="window.openStockModal({stock:\'' + h.ticker + '\', strategy:\'' + strategyId + '\'})">View research &rarr;</button></td>' +
        '</tr>';
      });
    });

    return '<div class="portfolio-matrix" id="matrixContainer">' +
      '<div class="matrix-controls"><div class="matrix-filters">' + filtersHtml + '</div>' + searchHtml + '</div>' +
      '<div class="tblwrap"><table>' +
      '<thead><tr><th>Company</th><th class="n">Weight</th><th>Role</th><th>Thesis</th><th>What we watch</th><th>Research</th></tr></thead>' +
      '<tbody>' + (rowsHtml || '<tr><td colspan="6">No holdings match your search.</td></tr>') + '</tbody>' +
      '</table></div></div>';
  }

  window.getMatrixHtml = renderMatrix;
  
  window.filterMatrix = function(filterId) {
    if (currentStrategy) MATRIX_STATE[currentStrategy].filter = filterId;
    updateDOM();
  };
  
  window.searchMatrix = function(query) {
    if (currentStrategy) MATRIX_STATE[currentStrategy].search = query;
    updateDOM();
  };
  
  function updateDOM() {
    var el = document.getElementById('matrix-wrap-' + currentStrategy);
    if (el) {
        el.innerHTML = renderMatrix(currentStrategy);
        var searchInput = el.querySelector('#matrixSearch');
        if (searchInput) {
            searchInput.focus();
            var val = searchInput.value;
            searchInput.value = '';
            searchInput.value = val;
        }
    }
  }
})();

