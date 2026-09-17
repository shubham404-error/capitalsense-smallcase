(function() {
  function renderValuationUI() {
    var html = '<div class="valuation-module">' +
      '<div class="perf-head"><span class="dot"></span><strong>Valuation Sensitivity</strong></div>' +
      '<div class="val-body">' +
        '<div class="val-controls">' +
          '<div class="val-input">' +
            '<label>Earnings Growth (CAGR %)</label>' +
            '<input type="range" id="valCagr" min="5" max="30" step="1" value="15" oninput="window.calcValuation()">' +
            '<span id="valCagrOut">15%</span>' +
          '</div>' +
          '<div class="val-input">' +
            '<label>Holding Period (Years)</label>' +
            '<input type="range" id="valYears" min="1" max="10" step="1" value="5" oninput="window.calcValuation()">' +
            '<span id="valYearsOut">5 yrs</span>' +
          '</div>' +
          '<div class="val-input">' +
            '<label>Exit Multiple (x)</label>' +
            '<input type="range" id="valMult" min="10" max="60" step="1" value="25" oninput="window.calcValuation()">' +
            '<span id="valMultOut">25x</span>' +
          '</div>' +
        '</div>' +
        
        '<div class="val-output">' +
          '<h3>Illustrative valuation change</h3>' +
          '<div class="val-math">' +
            '<div class="val-step"><span>Starting EPS index</span><strong>1.00</strong></div>' +
            '<div class="val-step"><span>Future EPS index</span><strong id="valEpsOut">2.01</strong></div>' +
            '<div class="val-step"><span>Exit multiple</span><strong id="valMultRes">25.0x</strong></div>' +
          '</div>' +
          '<div class="val-final">' +
            '<span>Illustrative Future EPS × Exit Multiple</span>' +
            '<strong id="valFinalOut">50.3</strong>' +
          '</div>' +
          '<p class="val-disclaimer">Sensitivity analysis only. This is not a forecast or target price.</p>' +
        '</div>' +
      '</div>' +
    '</div>';
    
    return html;
  }
  
  window.calcValuation = function() {
    var cagr = parseInt(document.getElementById('valCagr').value, 10);
    var years = parseInt(document.getElementById('valYears').value, 10);
    var mult = parseInt(document.getElementById('valMult').value, 10);
    
    document.getElementById('valCagrOut').innerText = cagr + '%';
    document.getElementById('valYearsOut').innerText = years + ' yrs';
    document.getElementById('valMultOut').innerText = mult + 'x';
    
    var futureEps = Math.pow(1 + (cagr / 100), years);
    var finalVal = futureEps * mult;
    
    document.getElementById('valEpsOut').innerText = futureEps.toFixed(2);
    document.getElementById('valMultRes').innerText = mult.toFixed(1) + 'x';
    document.getElementById('valFinalOut').innerText = finalVal.toFixed(1);
  };

  window.getValuationHtml = renderValuationUI;
})();
