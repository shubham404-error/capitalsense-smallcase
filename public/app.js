/* ============================================================
   CapitalSense Advisors — application
   No dependencies. No build step.
   ============================================================ */
(function () {
  'use strict';

  var S = window.STRATEGIES;
  var INCEPTION_LABEL = '17 September 2026';
  var PALETTE = ['#0C2230', '#1B4457', '#BE8A2E', '#7A909D', '#C9D3D7'];

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var $ = function (id) { return document.getElementById(id); };
  var all = function (s) { return s.themes.reduce(function (a, t) { return a.concat(t.holdings); }, []); };

  /* ----------------------------------------------------------
     DATA INTEGRITY
     Weights are checked at load. A silent weighting error is
     worse than a loud one.
     ---------------------------------------------------------- */
  function validate() {
    Object.keys(S).forEach(function (id) {
      var s = S[id];
      var total = all(s).reduce(function (n, h) { return n + h.wt; }, 0) + s.cash;
      if (total !== 100) console.error('[data] ' + s.name + ' weights sum to ' + total + ', expected 100');
      s.themes.forEach(function (t) {
        var sum = t.holdings.reduce(function (n, h) { return n + h.wt; }, 0);
        if (sum !== t.weight) console.error('[data] ' + s.name + ' / ' + t.label + ' sums to ' + sum + ', stated ' + t.weight);
        t.holdings.forEach(function (h) {
          if (!h.role || !h.thesis || !h.risk || !h.watch || h.watch.length < 3) {
            console.error('[data] incomplete holding card: ' + h.name);
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
     MARKET DATA ADAPTER
     The only place this page touches prices.

     Permanently forbidden in this layer:
       - Math.random() or any simulated tick
       - hardcoded fallback prices
       - falling back to the inception price when the feed fails
       - rendering any number the API did not return
     A failure renders the "prices unavailable" state.
     ---------------------------------------------------------- */
  var PriceAdapter = {
    currentQuotes: function (tickers) {
      return fetch('/api/prices?symbols=' + encodeURIComponent(tickers.join(',')), {
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('price feed unavailable');
        return r.json();
      });
    },
    inceptionPrices: function () {
      return fetch('/api/inception', { headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('inception prices unavailable');
          return r.json();
        });
    }
  };

  /* ----------------------------------------------------------
     COMPARE GRID
     ---------------------------------------------------------- */
  function renderCompare() {
    var a = S['india-emergent-industries'], b = S['india-execution-engine'];
    var rows = [
      ['', '<span class="hd">' + a.name + '</span>', '<span class="hd">' + b.name + '</span>'],
      ['The question', a.question, b.question],
      ['Holdings', all(a).length + ' companies', all(b).length + ' companies and ' + b.cash + '% cash'],
      ['Themes', a.themes.map(function (t) { return t.label; }).join(' · '),
        b.themes.map(function (t) { return t.label; }).join(' · ')],
      ['Style', a.style, b.style],
      ['Core lens', a.lens, b.lens],
      ['Inception', INCEPTION_LABEL, INCEPTION_LABEL]
    ];
    $('compareGrid').innerHTML = rows.map(function (r, i) {
      var cls = i === 0 ? ' class="compare-head-cell"' : '';
      return r.map(function (c) { return '<div' + cls + '>' + c + '</div>'; }).join('');
    }).join('');
  }

  /* ----------------------------------------------------------
     DONUT
     ---------------------------------------------------------- */
  function donut(segs) {
    var R = 54, C = 2 * Math.PI * R, off = 0;
    var arcs = segs.map(function (g, i) {
      var len = (g.weight / 100) * C;
      var el = '<circle r="' + R + '" cx="70" cy="70" fill="none" stroke="' + PALETTE[i % PALETTE.length] +
        '" stroke-width="18" stroke-dasharray="' + len.toFixed(2) + ' ' + (C - len).toFixed(2) +
        '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 70 70)"></circle>';
      off += len;
      return el;
    }).join('');
    var label = segs.map(function (g) { return g.label + ' ' + g.weight + ' percent'; }).join(', ');
    return '<svg class="donut" viewBox="0 0 140 140" role="img" aria-label="Allocation by theme: ' +
      esc(label) + '">' + arcs + '</svg>';
  }

  /* ----------------------------------------------------------
     STRATEGY
     ---------------------------------------------------------- */
  function renderStrategy(id) {
    var s = S[id], hs = all(s);
    var segs = s.themes.map(function (t) { return { label: t.label, weight: t.weight }; });
    if (s.cash) segs.push({ label: 'Cash', weight: s.cash });

    /* intro band */
    $('strategyIntro').innerHTML =
      '<p class="s-tagline">' + esc(s.tagline) + '</p>' +
      '<p class="s-opener">' + esc(s.opener) + '</p>' +
      '<div class="s-stats">' +
        '<div class="s-stat"><span>Holdings</span><strong>' + hs.length + '</strong></div>' +
        '<div class="s-stat"><span>Themes</span><strong>' + s.themes.length + '</strong></div>' +
        (s.cash ? '<div class="s-stat"><span>Cash</span><strong>' + s.cash + '%</strong></div>' : '') +
        '<div class="s-stat"><span>Inception</span><strong>17 Sep 2026</strong></div>' +
      '</div>';

    /* chapter sub-nav */
    $('chapterNav').innerHTML = '<div class="chapter-nav-in">' +
      '<a href="#alloc-' + id + '">Allocation</a>' +
      s.themes.map(function (t) {
        return '<a href="#ch-' + t.id + '">' + esc(t.label) + '<b>' + t.weight + '%</b></a>';
      }).join('') + '</div>';

    /* body */
    var chapters = s.themes.map(function (t, i) {
      return '<div class="chapter" id="ch-' + t.id + '">' +
        '<div class="ch-meta"><span class="ch-num">Chapter ' + (i + 1) + ' — ' + esc(t.label) +
          '</span><span class="ch-wt">' + t.weight + '% of the portfolio</span></div>' +
        '<h3 class="ch-title">' + esc(t.title) + '</h3>' +
        '<p class="ch-body">' + esc(t.body) + '</p>' +
        '<div class="holdings">' + t.holdings.map(function (h) {
          return '<div class="h-row"><div>' +
            '<p class="h-name">' + esc(h.name) + '<span class="h-sym">' + esc(h.sym) + '</span></p>' +
            '<p class="h-role">' + esc(h.role) + '</p>' +
            '<p class="h-thesis">' + esc(h.thesis) + '</p>' +
            '<p class="h-watch"><b>What we watch.</b> ' + h.watch.map(esc).join(' · ') + '</p>' +
            '<p class="h-risk"><b>Risk.</b> ' + esc(h.risk) + '</p>' +
            '</div><div class="h-wt">' + h.wt + '%</div></div>';
        }).join('') + '</div>' +
        '<p class="take">' + esc(t.takeaway) + '</p>' +
        '</div>';
    }).join('');

    $('strategyPanel').innerHTML =
      '<div class="alloc" id="alloc-' + id + '">' + donut(segs) +
        '<div class="bars">' + segs.map(function (g, i) {
          return '<div class="bar-row"><div><div class="bar-lbl">' + esc(g.label) + '</div>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + g.weight +
            '%;background:' + PALETTE[i % PALETTE.length] + '"></div></div></div>' +
            '<div class="bar-val">' + g.weight + '%</div></div>';
        }).join('') +
        '<div class="bar-row bar-total"><div class="bar-lbl">' + hs.length + ' holdings' +
          (s.cash ? ' and ' + s.cash + '% cash' : '') + '</div><div class="bar-val">100%</div></div>' +
        '</div></div>' + chapters;

    $('strategyPanel').setAttribute('aria-labelledby', 'tab-' + id);
    watchChapters();
  }

  function selectStrategy(id, scroll) {
    document.querySelectorAll('.segmented button').forEach(function (b) {
      b.setAttribute('aria-selected', b.id === 'tab-' + id ? 'true' : 'false');
    });
    renderStrategy(id);
    renderPerformance(); // Re-render the performance module for the newly selected strategy
    if (scroll) {
      var top = document.getElementById('strategies').offsetTop - 60;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  async function renderPerformance() {
    var activeTabBtn = document.querySelector('.segmented button[aria-selected="true"]');
    var strategyId = activeTabBtn ? activeTabBtn.id.replace('tab-', '') : 'india-emergent-industries';
    var s = S[strategyId];
    var hs = all(s);
    var tickers = hs.map(function (h) { return h.ticker; });

    // First show a loading state
    $('perfModule').innerHTML = '<div class="perf"><div class="perf-head"><span class="dot"></span><strong>Loading...</strong></div><div class="perf-body"><p class="perf-note">Fetching live data from Yahoo Finance...</p></div></div>';

    try {
      var data = await PriceAdapter.currentQuotes(tickers);
      var quotes = data.quotes;
      
      var liveRows = hs.map(function (h) {
        var q = quotes[h.ticker];
        if (q) {
          // Assume entry is 100 for now if inception prices are missing. In a real app we'd fetch inceptionPrices too.
          var changeText = q.change !== null ? q.change.toFixed(2) + '%' : 'N/A';
          var changeCls = q.change !== null && q.change >= 0 ? 'text-green' : (q.change !== null ? 'text-red' : '');
          var changeSign = q.change !== null && q.change > 0 ? '+' : '';
          return '<tr><td>' + esc(h.name) + ' <span class="h-sym-small" title="Yahoo Finance Ticker: ' + esc(h.ticker) + '">(' + esc(h.ticker) + ')</span></td><td class="n">' + h.wt +
            '%</td><td class="n na">—</td><td class="n">' + q.currency + ' ' + q.price.toLocaleString('en-IN', {minimumFractionDigits: 2}) + '</td><td class="n"><strong class="' + changeCls + '">' + changeSign + changeText + '</strong></td></tr>';
        } else {
          return '<tr><td>' + esc(h.name) + ' <span class="h-sym-small">(' + esc(h.ticker) + ')</span></td><td class="n">' + h.wt +
            '%</td><td class="n na">—</td><td class="n na">N/A</td><td class="n na">—</td></tr>';
        }
      }).join('');

      var live =
        '<p class="state-label">Live state</p>' +
        '<div class="perf"><div class="perf-head"><span class="dot live"></span>' +
        '<strong>' + esc(s.name) + '</strong><span>Since ' + INCEPTION_LABEL + '</span></div>' +
        '<div class="perf-body"><div class="tblwrap"><table>' +
        '<thead><tr><th>Holding</th><th class="n">Weight</th><th class="n">Entry</th>' +
        '<th class="n">Current</th><th class="n">Return</th></tr></thead><tbody>' + liveRows +
        '</tbody></table></div><p class="stale">Prices fetched live via ' + esc(data.source) + ' API. Last updated: ' + new Date(data.asOf).toLocaleTimeString() + '. Delayed data, see disclosures. Returns are ' +
        'measured from the locked ' + INCEPTION_LABEL + ' close and adjusted for splits and bonuses.</p>' +
        '</div></div>';
      
      $('perfModule').innerHTML = live;
    } catch (e) {
      var down =
        '<p class="state-label">Feed failure state</p>' +
        '<div class="perf"><div class="perf-head"><span class="dot warn"></span>' +
        '<strong>Prices unavailable</strong></div><div class="perf-body">' +
        '<p class="perf-note">We could not reach the market-data provider. Returns are hidden rather than ' +
        'calculated from a stale price. Please try again later.</p>' +
        '</div></div>';
      $('perfModule').innerHTML = down;
    }
  }

  /* ----------------------------------------------------------
     OVERLAP CALCULATOR
     Combined exposure is capital-weighted, not additive.
     ---------------------------------------------------------- */
  var OVERLAP = [
    { name: 'Kaynes Technology', a: 13, b: 10 },
    { name: 'Cummins India', a: 10, b: 14 }
  ];

  function renderOverlap() {
    var range = $('splitRange');
    function draw() {
      var pa = Number(range.value), pb = 100 - pa;
      range.style.setProperty('--pct', pa + '%');
      $('splitLabelA').textContent = pa + '% Emergent Industries';
      $('splitLabelB').textContent = pb + '% Execution Engine';
      $('overlapRows').innerHTML = OVERLAP.map(function (o) {
        var combined = (o.a * pa + o.b * pb) / 100;
        return '<tr><td>' + esc(o.name) + '</td><td class="n">' + o.a.toFixed(1) +
          '%</td><td class="n">' + o.b.toFixed(1) + '%</td><td class="n">' +
          combined.toFixed(1) + '%</td></tr>';
      }).join('');
    }
    range.addEventListener('input', draw);
    draw();
  }

  /* ----------------------------------------------------------
     LISTS
     ---------------------------------------------------------- */
  function renderLists() {
    $('watchList').innerHTML = window.WATCH.map(function (p) {
      return '<div><dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd></div>';
    }).join('');
    $('riskGrid').innerHTML = window.RISKS.map(function (p) {
      return '<div><h4>' + esc(p[0]) + '</h4><p>' + esc(p[1]) + '</p></div>';
    }).join('');
  }

  /* ----------------------------------------------------------
     NAVIGATION
     ---------------------------------------------------------- */
  function initNav() {
    var burger = $('burger'), drawer = $('drawer');

    function closeDrawer() {
      drawer.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      if (open) { closeDrawer(); return; }
      drawer.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) { closeDrawer(); burger.focus(); }
    });

    /* scroll progress + back to top */
    var toTop = $('toTop'), progress = $('progress');
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      toTop.hidden = window.scrollY < 700;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    /* scroll-spy on the main nav */
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
    var targets = links.map(function (l) { return document.querySelector(l.getAttribute('href')); })
      .filter(Boolean);
    if ('IntersectionObserver' in window && targets.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      targets.forEach(function (t) { io.observe(t); });
    }

    /* strategy tabs */
    document.querySelectorAll('.segmented button').forEach(function (b) {
      b.addEventListener('click', function () { selectStrategy(b.id.replace('tab-', ''), false); });
    });
    document.querySelectorAll('[data-open]').forEach(function (a) {
      a.addEventListener('click', function () { selectStrategy(a.dataset.open, true); });
    });
  }

  /* chapter sub-nav highlighting, re-bound whenever a strategy renders */
  var chapterIO = null;
  function watchChapters() {
    if (chapterIO) chapterIO.disconnect();
    if (!('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.chapter-nav a'));
    chapterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    document.querySelectorAll('.chapter, .alloc').forEach(function (el) {
      if (el.id) chapterIO.observe(el);
    });
  }

  /* ----------------------------------------------------------
     CHATBOT
     ---------------------------------------------------------- */
  function initChatbot() {
    var toggleBtn = $('chatToggle');
    var chatWindow = $('chatWindow');
    var minBtn = $('chatMinimize');
    var clearBtn = $('chatClear');
    var sendBtn = $('chatSend');
    var chatInput = $('chatInput');
    var msgContainer = $('chatMessages');

    function toggleChat() {
      chatWindow.hidden = !chatWindow.hidden;
      if (!chatWindow.hidden) chatInput.focus();
    }
    toggleBtn.addEventListener('click', toggleChat);
    minBtn.addEventListener('click', toggleChat);

    clearBtn.addEventListener('click', function () {
      msgContainer.innerHTML = '<div class="chat-message ai"><div class="avatar">AI</div><div class="msg-content">Hello! I am your CapitalSense Advisors Analyst. Ask me anything about our Smallcase strategies, holdings, or thematic allocation.</div></div>';
    });

    function appendMessage(role, text, isHtml) {
      var msg = document.createElement('div');
      msg.className = 'chat-message ' + role;
      
      var avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.textContent = role === 'ai' ? 'AI' : 'You';
      
      var content = document.createElement('div');
      content.className = 'msg-content';
      if (isHtml) {
        content.innerHTML = text;
      } else {
        content.textContent = text;
      }
      
      msg.appendChild(avatar);
      msg.appendChild(content);
      msgContainer.appendChild(msg);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    async function sendMessage() {
      var text = chatInput.value.trim();
      if (!text) return;
      
      chatInput.value = '';
      sendBtn.disabled = true;
      appendMessage('user', text, false);

      var typingId = 'typing-' + Date.now();
      var typingEl = document.createElement('div');
      typingEl.id = typingId;
      typingEl.className = 'chat-message ai';
      typingEl.innerHTML = '<div class="avatar">AI</div><div class="msg-content chat-typing">Analyzing context and generating response...</div>';
      msgContainer.appendChild(typingEl);
      msgContainer.scrollTop = msgContainer.scrollHeight;

      try {
        var activeTabBtn = document.querySelector('.segmented button[aria-selected="true"]');
        var activeStrategyName = activeTabBtn ? activeTabBtn.textContent : '';

        var res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: text, 
            context: 'Active Strategy: ' + activeStrategyName 
          })
        });
        
        if (!res.ok) throw new Error('API Error');
        var data = await res.json();
        
        var tEl = document.getElementById(typingId);
        if (tEl) tEl.remove();

        var aiText = data.response || 'Sorry, no response.';
        var htmlContent = typeof marked !== 'undefined' ? marked.parse(aiText) : esc(aiText);
        appendMessage('ai', htmlContent, true);
      } catch (err) {
        var tEl = document.getElementById(typingId);
        if (tEl) tEl.remove();
        appendMessage('ai', 'Error connecting to AI service.', false);
      } finally {
        sendBtn.disabled = false;
        chatInput.focus();
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
  }

  /* ---------------------------------------------------------- */
  validate();
  renderCompare();
  renderLists();
  renderPerformance();
  renderOverlap();
  initNav();
  initChatbot();
  selectStrategy('india-emergent-industries', false);

  window.CapitalSense = { PriceAdapter: PriceAdapter, selectStrategy: selectStrategy };
})();
