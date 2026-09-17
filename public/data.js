/* ============================================================
   PORTFOLIO DATA
   Content, portfolio data and market data stay separate.
   Nothing in this file is a price. Prices come from the API.

   Validation (enforced in app.js on load):
     - holdings + cash must sum to exactly 100 per strategy
     - each theme's holdings must sum to its stated weight
     - every holding needs role, thesis, >=3 watch items, risk
   ============================================================ */

window.STRATEGIES = {
  "india-emergent-industries": {
    name: "India Emergent Industries",`r`n    smallcaseUrl: "https://smlc.se/ScIYx",
    tagline: "The next layer of India's growth.",
    question: "What is India building next?",
    inception: "2026-09-17",
    style: "Structural growth",
    lens: "Emerging opportunities",
    cash: 0,
    opener: "Think about India's next decade of growth. More electricity. More data centres. More manufacturing. More aircraft. More solar capacity. More electronics. The obvious companies may not always be the most interesting part of that story. Behind every major industrial trend is a network of companies supplying the transformers, engineering expertise, components, manufacturing capacity and specialist technology required to make it happen.",
    themes: [
      {
        id: "power", label: "Data Centre & Power Infrastructure", weight: 42,
        title: "The AI boom needs more than servers. It needs power.",
        body: "A data centre cannot run without electricity, and electricity cannot simply appear at the server rack. It needs generation, transmission, transformers, substations and distribution equipment. At the same time India's network has to support industrialisation, renewables and rising digital demand. That creates an investment chain extending far beyond the companies operating the data centres themselves.",
        takeaway: "You don't have to own the data centre to own the growth around it.",
        holdings: [
          { name:"Transformers & Rectifiers India", sym:"TARIL", ticker:"TARIL.NS", wt:14, role:"Power transmission equipment",
            thesis:"India's power network needs equipment that can move electricity across increasingly complex transmission and distribution systems. TARIL manufactures power and specialty transformers and ended FY26 with an unexecuted order book of about ₹5,005 crore.",
            watch:["Order inflows","Execution","Working capital","Commodity costs"],
            risk:"Order-book conversion depends on customer readiness and site availability, and transformer margins are exposed to copper and steel pricing." },
          { name:"Anant Raj", sym:"ANANTRAJ", ticker:"ANANTRAJ.NS", wt:10, role:"Digital and physical infrastructure",
            thesis:"The thesis here is not simply real estate. It is exposure to the infrastructure required around India's urban, digital and data-centre expansion.",
            watch:["Capacity commissioning","Leasing","Capex funding","Debt levels"],
            risk:"Infrastructure build-out is capital intensive and returns depend on leasing demand materialising on schedule." },
          { name:"Cummins India", sym:"CUMMINSIND", ticker:"CUMMINSIND.NS", wt:10, role:"Power systems and energy reliability",
            thesis:"When the grid cannot be the only answer, reliable power becomes critical. Cummins operates across power systems and engines, giving the portfolio exposure to the distributed and backup-power side of a more power-hungry economy.",
            watch:["Order inflows","Domestic demand","Export mix","Margins"],
            risk:"Demand is tied to industrial and infrastructure capex cycles, and the stock already carries a high multiple." },
          { name:"Techno Electric & Engineering", sym:"TECHNOE", ticker:"TECHNOE.NS", wt:8, role:"Transmission, smart metering, data centres",
            thesis:"A power-infrastructure company with transmission, smart-metering and data-centre growth avenues. Its order book at 30 June 2026 was approximately ₹9,596 crore, with transmission EPC accounting for roughly 64%.",
            watch:["Order inflows","Transmission spending","Smart-meter execution","Working capital"],
            risk:"EPC execution is sensitive to tender timing and payment cycles, and the newer businesses are yet to scale." }
        ]
      },
      {
        id: "aero", label: "Aerospace & Precision Engineering", weight: 26,
        title: "The aircraft of tomorrow needs an industrial supply chain today.",
        body: "Aerospace manufacturing is not built overnight. Suppliers need engineering capability, certifications, customer qualification and years of demonstrated reliability. Once a component enters a global aerospace programme, replacing the supplier is not as simple as changing vendors.",
        takeaway: "The opportunity is moving from assembling products to mastering the parts inside them.",
        holdings: [
          { name:"Dynamatic Technologies", sym:"DYNAMATECH", ticker:"DYNAMATECH.NS", wt:11, role:"Aerospace structures and precision engineering",
            thesis:"Precision manufacturing for demanding aerospace and engineering applications, participating in global airframe and component programmes.",
            watch:["New programme wins","Customer qualification","Export growth","Capacity utilisation"],
            risk:"Revenue is concentrated in a small number of global programmes, so delivery-rate changes at the customer flow straight through." },
          { name:"Azad Engineering", sym:"AZAD", ticker:"AZAD.NS", wt:10, role:"High-precision aerospace manufacturing",
            thesis:"Azad manufactures highly engineered components for demanding aerospace and energy applications. FY26 aerospace and defence revenue crossed ₹100 crore for the first time, with an order book of around ₹6,500 crore at year end. The lengthy qualification process that creates the barrier to entry also slows new revenue.",
            watch:["Programme additions","Qualification progress","Capacity utilisation","Margins"],
            risk:"Valuation embeds a long runway of conversion, and customer concentration is high." },
          { name:"Belrise Industries", sym:"BELRISE", ticker:"BELRISE.NS", wt:5, role:"Precision components and content per vehicle",
            thesis:"Belrise supplies precision-formed components across multiple vehicle categories. Its FY26 annual report highlights increasing passenger-vehicle and commercial-vehicle exposure, alongside higher content per vehicle in its two-wheeler business — the same metal-forming and tooling capability that underpins this theme, applied to a different end market.",
            watch:["Content per vehicle","Customer additions","Margins","Working capital"],
            risk:"Auto-component demand is cyclical and more exposed to consumer conditions than the rest of this theme." }
        ]
      },
      {
        id: "solar", label: "Solar Manufacturing", weight: 19,
        title: "India is not only installing solar. It is building the supply chain behind it.",
        body: "The first phase of the solar opportunity was about adding capacity. The next phase is increasingly about manufacturing capacity, localisation and vertical integration — domestic cells, modules and deeper integration rather than imported finished product.",
        takeaway: "The next solar opportunity may not be more solar farms. It may be the companies manufacturing what those farms need.",
        holdings: [
          { name:"Emmvee Photovoltaic Power", sym:"EMMVEE", ticker:"EMMVEE.NS", wt:11, role:"Integrated solar manufacturing",
            thesis:"A solar manufacturer positioned across modules and cells. Its manufacturing expansion gives the portfolio exposure to India's effort to deepen domestic solar manufacturing rather than simply import finished products.",
            watch:["Cell and module prices","Capacity additions","Integration","Cash generation"],
            risk:"Solar manufacturing economics can deteriorate quickly if module prices fall faster than costs." },
          { name:"Premier Energies", sym:"PREMIERENE", ticker:"PREMIERENE.NS", wt:8, role:"Solar cells, modules and vertical integration",
            thesis:"Premier is pursuing deeper integration across the solar value chain, including cells, modules and further upstream manufacturing. The growth opportunity comes with an equally important question: how efficiently can new capacity translate into cash generation and sustainable returns?",
            watch:["Capacity ramp","Realisations","Margins","Free cash flow"],
            risk:"Heavy capacity addition across the industry could compress returns even if volumes grow." }
        ]
      },
      {
        id: "elec", label: "Electronics & Semiconductors", weight: 13,
        title: "India wants more electronics. The value is moving deeper into the supply chain.",
        body: "The opportunity is moving from assembly towards increasingly complex manufacturing, components, semiconductor packaging and specialised electronics. India's semiconductor push is expanding beyond fabs into packaging, equipment, materials and design.",
        takeaway: "India's electronics opportunity is moving from assembling products to building capabilities.",
        holdings: [
          { name:"Kaynes Technology", sym:"KAYNES", ticker:"KAYNES.NS", wt:13, role:"High-complexity electronics and semiconductor ecosystem",
            thesis:"India is trying to capture more value from electronics manufacturing and build domestic capabilities across complex electronics and semiconductor packaging. Kaynes has been expanding across both, with an order book that provides visibility into future execution.",
            watch:["Order-book conversion","Margin trajectory","Capacity utilisation","Semiconductor execution","Working capital"],
            risk:"Valuation and execution expectations are high." }
        ]
      }
    ]
  },

  "india-execution-engine": {
    name: "India Execution Engine",`r`n    smallcaseUrl: "https://smlc.se/xBASN",
    tagline: "Build it. Power it. Defend it. Bank it.",
    question: "Who is actually delivering it?",
    inception: "2026-09-17",
    style: "Execution",
    lens: "Industrial execution",
    cash: 3,
    opener: "The first smallcase looks for what is coming next. The second looks one step further. Who gets the orders? Who manufactures the equipment? Who builds the infrastructure? Who supplies India's defence systems? Who benefits when India's industrial investment turns into actual execution?",
    themes: [
      {
        id: "defend", label: "Defend", weight: 27,
        title: "Defend it.",
        body: "India's defence story is moving from import dependence towards domestic design, manufacturing and execution. The important question is no longer how much India spends on defence. It is where that spending goes. Recent procurement approvals have increasingly been directed towards domestic industry.",
        takeaway: "Defence spending only becomes an investment opportunity when it becomes an order, and an order only matters when it gets executed.",
        holdings: [
          { name:"Bharat Electronics", sym:"BEL", ticker:"BEL.NS", wt:16, role:"Defence electronics and systems",
            thesis:"The defence-electronics anchor of the portfolio. Its opportunity spans radars, communications, electronic warfare, air-defence systems and other strategic electronics.",
            watch:["Procurement approvals","Order conversion","Execution","Export opportunities"],
            risk:"Revenue timing depends on government procurement and tender cycles outside the company's control." },
          { name:"Hindustan Aeronautics", sym:"HAL", ticker:"HAL.NS", wt:7, role:"Aerospace and defence platforms",
            thesis:"From aircraft and helicopters to maintenance and aerospace programmes, HAL provides direct exposure to India's military aviation ecosystem.",
            watch:["Programme milestones","Order inflows","Execution","Supply-chain readiness"],
            risk:"Large platform programmes can slip by years, and a single customer accounts for most revenue." },
          { name:"Astra Microwave", sym:"ASTRAMICRO", ticker:"ASTRAMICRO.NS", wt:4, role:"Defence electronics and RF systems",
            thesis:"Exposure to radar, electronic warfare and microwave systems where specialised engineering matters.",
            watch:["Order inflows","Execution","Development wins","Margins"],
            risk:"Smaller scale means order lumpiness has a larger effect on any single period." }
        ]
      },
      {
        id: "power2", label: "Power", weight: 32,
        title: "Power it.",
        body: "The industrial cycle cannot run without electricity. Transmission networks need investment. Industrial facilities need equipment. Data centres need reliable power. Renewable capacity needs to be connected to the grid. This is where the power and capital-goods companies sit.",
        takeaway: "India can build more factories, more trains and more data centres only if the grid can keep up.",
        holdings: [
          { name:"Cummins India", sym:"CUMMINSIND", ticker:"CUMMINSIND.NS", wt:14, role:"Power systems and distributed generation",
            thesis:"Distributed and backup power for an economy adding industrial and digital load faster than the grid can absorb it.",
            watch:["Order inflows","Domestic demand","Export mix","Margins"],
            risk:"Cyclical demand and a high starting multiple." },
          { name:"Siemens Energy India", sym:"SIEMENSENERGY", ticker:"SIEMENSENERGY.NS", wt:7, role:"Grid and power equipment",
            thesis:"Grid and power-equipment exposure across transmission and generation infrastructure.",
            watch:["Order inflows","Transmission spending","Execution","Margins"],
            risk:"Order flow is tied to utility capex plans and tender timing." },
          { name:"KPIL", sym:"KPIL", ticker:"KPIL.NS", wt:4, role:"Transmission and infrastructure execution",
            thesis:"Transmission and infrastructure execution across a diversified project base.",
            watch:["Order inflows","Execution","Working capital","Commodity costs"],
            risk:"EPC margins are thin and working capital absorbs cash during build-out." },
          { name:"GE Vernova T&D India", sym:"GVT&D", ticker:"GVT&D.NS", wt:4, role:"High-voltage transmission and grid technology",
            thesis:"High-voltage transmission and grid technology serving India's network expansion.",
            watch:["Order inflows","Transmission spending","Execution","Margins"],
            risk:"Concentrated exposure to a single spending cycle, and valuation reflects the current upcycle." },
          { name:"KEC International", sym:"KEC", ticker:"KEC.NS", wt:3, role:"Transmission and infrastructure execution",
            thesis:"Transmission and infrastructure execution across domestic and international markets.",
            watch:["Order inflows","Execution","Working capital","Commodity costs"],
            risk:"International exposure adds currency and country risk on top of EPC margin pressure." }
        ]
      },
      {
        id: "build", label: "Build", weight: 27,
        title: "Build it.",
        body: "This is India's manufacturing execution layer. Companies want more electronics. Defence programmes require more specialised electronics. Industrial equipment needs more components. Global manufacturers want alternative supply chains. And India wants a greater share of that value chain.",
        takeaway: "India's electronics opportunity is moving from assembling products to building capabilities.",
        holdings: [
          { name:"Kaynes Technology", sym:"KAYNES", ticker:"KAYNES.NS", wt:10, role:"Complex electronics and semiconductor ecosystem",
            thesis:"Exposure to high-complexity electronics and semiconductor-related manufacturing as India moves up the value chain.",
            watch:["Order-book conversion","Margin trajectory","Capacity utilisation","Working capital"],
            risk:"Valuation and execution expectations are high." },
          { name:"Syrma SGS", sym:"SYRMA", ticker:"SYRMA.NS", wt:9, role:"Specialised electronics manufacturing",
            thesis:"Specialised electronics manufacturing across industrial, automotive and consumer end markets. Syrma ended Q1 FY27 with an order book of approximately ₹67.7 billion.",
            watch:["Order-book conversion","New customers","Backward integration","Margins"],
            risk:"EMS margins are structurally thin and sensitive to component costs and mix." },
          { name:"Avalon Technologies", sym:"AVALON", ticker:"AVALON.NS", wt:5, role:"High-complexity electronics and industrial manufacturing",
            thesis:"High-complexity electronics and industrial manufacturing with an order book of approximately ₹34.7 billion in the cited research period.",
            watch:["Order-book conversion","Customer concentration","Margins","Working capital"],
            risk:"Depends on a limited number of large customers and on export demand." },
          { name:"Dixon Technologies", sym:"DIXON", ticker:"DIXON.NS", wt:3, role:"Scale electronics manufacturing",
            thesis:"Scale electronics manufacturing, expanding from domestic production into exports, component integration and larger programme opportunities.",
            watch:["Order-book conversion","Component integration","Margins","Input costs"],
            risk:"Assembly economics are low margin and the stock trades at a demanding multiple." }
        ]
      },
      {
        id: "bank", label: "Bank", weight: 11,
        title: "Bank it.",
        body: "Every economic expansion eventually creates another asset. More entrepreneurs. More businesses. More financial assets. More wealthy households. And greater demand for professional wealth management.",
        takeaway: "When an economy creates wealth, an entire industry grows around managing it.",
        holdings: [
          { name:"360 ONE WAM", sym:"360ONE", ticker:"360ONE.NS", wt:11, role:"Wealth management",
            thesis:"India's professionally managed wealth pool remains relatively underpenetrated, while wealth managers are building larger recurring-fee businesses and deepening their relationships with affluent clients.",
            watch:["AUM growth","Net flows","Recurring revenue","Productivity per relationship manager"],
            risk:"Flows and fee income are correlated with market levels, so a drawdown hits revenue and sentiment together." }
        ]
      }
    ]
  }
};

window.WATCH = [
  ["Power","Order inflows. Transmission spending. Execution. Working capital. Commodity costs."],
  ["Aerospace","New programme wins. Customer qualification. Export growth. Capacity utilisation."],
  ["Solar","Cell and module prices. Capacity additions. Integration. Margins. Cash generation."],
  ["Electronics","Order-book conversion. New customers. Backward integration. Margins. Working capital."],
  ["Defence","Procurement approvals. Order conversion. Execution. Export opportunities."],
  ["Wealth","AUM growth. Net flows. Recurring revenue. Productivity per relationship manager."]
];

window.RISKS = [
  ["Execution","Large order books only create value when they are executed profitably."],
  ["Valuation","A good business can still be a poor investment when expectations become excessive."],
  ["Capital intensity","Manufacturing and infrastructure expansion can consume substantial working capital."],
  ["Government dependency","Defence, transmission and renewable-energy themes can be affected by policy, tender timing and procurement cycles."],
  ["Commodity cycles","Steel, copper, memory, semiconductor and other input costs can pressure margins."],
  ["Customer concentration","Several specialised manufacturers depend on a limited number of major customers or programmes."],
  ["Competition","A structural industry opportunity does not guarantee every participant will earn attractive returns."]
];
