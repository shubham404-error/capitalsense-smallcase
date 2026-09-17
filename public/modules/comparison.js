(function() {
  function renderComparison() {
    var mapping = window.CROSS_STRATEGY;
    if (!mapping) return '';
    
    var rows = '';
    for (var theme in mapping) {
      if (mapping.hasOwnProperty(theme)) {
        var emergentWt = mapping[theme].emergent;
        var executionWt = mapping[theme].execution;
        
        var themeName = theme.charAt(0).toUpperCase() + theme.slice(1);
        if (theme === 'elec') themeName = 'Electronics';
        if (theme === 'power') themeName = 'Power & Infrastructure*';
        if (theme === 'aero') themeName = 'Aerospace';
        
        rows += '<tr>' +
          '<td>' + themeName + '</td>' +
          '<td class="n">' + (emergentWt ? emergentWt + '%' : '—') + '</td>' +
          '<td class="n">' + (executionWt ? executionWt + '%' : '—') + '</td>' +
        '</tr>';
      }
    }
    
    return '<div class="compare-module">' +
      '<div class="compare-head"><h2>Two Strategies. One India Story.</h2><p>Emergent looks for what is being built. Execution looks for who is delivering it.</p></div>' +
      '<div class="tblwrap"><table>' +
      '<thead><tr><th>Theme</th><th class="n">Emergent</th><th class="n">Execution</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table></div><p style="font-size:12px; color:var(--ink-3); margin-top:12px;">* Theme definitions differ slightly between strategies.</p></div>';
  }

  window.renderCrossStrategyComparison = renderComparison;
})();

