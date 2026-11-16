const campaignAreas = [
  {
    id: 'district', name: 'Bussiness Gym', type: 'After-hours gym', accent: '#dbfb70',
    boss: 'Bussiness Rep XL', symbol: '◇', modifier: 'pressure',
    map:[[13,54],[35,30],[63,53],[86,33],[54,78]],
    art: '<path d="M8 18h84v63H8zM32 18v19H8m50-19v26h34M8 52h22v29m23 0V66h39"/><path d="M38 48h19m-16-4v8m13-8v8M14 24h11m-11 5h11m45 46h13"/>',
    levels: [
      {id:"interview",name:"Ambatu Interview",
        waves:[
          ["runner runner skater","runner runner thrower"],
          ["stapler skater runner","thrower runner guard"],
          ["flanks>timecard skater runner","north>thrower runner guard"]
        ]},
      {id:"donut",name:"Ambadonut Break",
        waves:[
          ["timecard runner thrower","runner guard skater"],
          ["stapler runner skater","thrower guard runner charger"],
          ["north>timecard guard thrower","flanks>skater runner charger","south>thrower runner"]
        ]},
      {id:"nut-locker",name:"YEK!",
        waves:[
          ["west>timecard skater runner","east>guard thrower"],
          ["flanks>stapler skater runner","north>stamper guard","south>runner charger"],
          ["north>timecard thrower guard","flanks>charger runner skater","east>stamper skater"]
        ],quote:"Who put Ambadonut in the nut locker?"},
      {id:"anger",name:"Stand on Bussiness",
        waves:[
          ["stamper timecard charger","thrower runner skater","guard runner"],
          ["stapler thrower skater","runner stamper thrower","runner skater charger"],
          ["west>stamper timecard charger","east>thrower guard runner","flanks>stamper skater"]
        ],dispatch:"The mirror is clean. The check-in camera still has one clip. Its label just says BUS."},
      {id:"ambatunut",name:"Wash That",
        waves:[
          ["flanks>timecard charger thrower","north>guard stamper runner","south>charger skater"],
          ["east>stamper stapler thrower","west>charger charger skater","flanks>timecard runner skater"],
          ["flanks>stamper timecard guard","south>skater thrower runner","north>stamper charger skater"],
          ["west>guard timecard","east>stamper stapler charger"],
          ["flanks>charger guard","north>timecard stapler stamper"]
        ],quote:"“Ambatunut!”"}
    ]
  },
  {
    id:'terminal', name:'Bus Bus Terminal', type:'Transit junction', accent:'#ffbd72', boss:'The Dreamybus', symbol:'▰', modifier:'traffic',
    map:[[12,32],[34,52],[61,35],[86,46],[51,76]],
    art:'<path d="M0 32h26l20 34h13l22-34h19M0 45h20l20 34h25l22-34h13M20 0v25m47 52v23M7 91h17m52-76h17"/><path d="M7 21h22m36 33h26"/>',
    levels:[
      {id:"driver",name:"Thank Your Driver",
        waves:[
          ["thrower runner skater","thrower charger guard"],
          ["headlight skater thrower","charger runner thrower","guard skater runner"],
          ["west>inspector skater runner","east>charger guard"],
          ["south>faregate headlight thrower","north>skater charger","flanks>runner thrower"]
        ]},
      {id:"transfer",name:"Tentacle Crossing",
        waves:[
          ["inspector skater faregate","guard runner charger","thrower skater runner"],
          ["faregate headlight skater","guard charger faregate","skater skater runner"],
          ["flanks>inspector faregate skater","north>charger guard","east>skater thrower"],
          ["north>faregate headlight charger","south>guard thrower","west>charger thrower skater"]
        ]},
      {id:"layover",name:"Move Over!",
        waves:[
          ["west>faregate inspector thrower","east>charger guard"],
          ["south>speaker headlight","north>faregate charger","flanks>thrower skater"],
          ["flanks>inspector skater faregate","north>guard speaker","east>charger thrower"],
          ["east>faregate headlight guard","west>charger skater charger","south>speaker skater"]
        ],quote:"“Thank you, bus driver.”"},
      {id:"bus-edit",name:"Ambatubus",
        waves:[
          ["faregate speaker inspector","charger guard thrower","runner skater speaker"],
          ["headlight skater thrower","guard charger runner","faregate speaker skater"],
          ["west>speaker faregate inspector","east>charger charger","south>guard thrower"],
          ["flanks>faregate headlight charger","north>speaker guard","south>thrower faregate"]
        ],dispatch:"The station has been off air for years. The bus clip is still in rotation."},
      {id:"night-route",name:"Self Pleasure",
        waves:[
          ["flanks>faregate inspector skater","north>speaker guard thrower","south>charger thrower"],
          ["west>faregate faregate headlight","east>charger guard charger","flanks>speaker inspector"],
          ["north>speaker faregate inspector","south>skater skater thrower","flanks>guard faregate"],
          ["flanks>faregate headlight speaker","south>guard thrower skater","north>inspector faregate skater"],
          ["north>headlight thrower","south>inspector faregate guard"],
          ["west>headlight inspector","east>faregate speaker charger"]
        ],quote:"“Damn, it’s like that?”"}
    ]
  },
  {
    id:'radio', name:'Ambasing FM', type:'Live studio', accent:'#f88fcc', boss:'Ambatusax', symbol:'♪', modifier:'backbeat',
    map:[[13,56],[34,36],[62,52],[86,34],[47,76]],
    art:'<circle cx="48" cy="51" r="37"/><circle cx="48" cy="51" r="30"/><circle cx="48" cy="51" r="19"/><circle cx="48" cy="51" r="5"/><path d="M66 35l18-20h11M5 89h29m35 0h25"/>',
    levels:[
      {id:"paza",name:"Paza",
        waves:[
          ["speaker runner skater","speaker thrower guard","runner skater choir"],
          ["choir tuningfork speaker","choir skater thrower","guard speaker runner"],
          ["south>speaker feedback choir","north>thrower guard","east>speaker runner"],
          ["flanks>choir tuningfork skater","west>speaker thrower","east>guard repeater"]
        ]},
      {id:"dreamyfantasia",name:"Dreamyfantasia",
        waves:[
          ["speaker feedback choir","thrower guard repeater","charger choir skater"],
          ["choir repeater tuningfork","guard runner choir","repeater charger thrower"],
          ["west>repeater feedback choir","east>charger thrower","north>speaker guard"],
          ["flanks>repeater speaker tuningfork","south>choir guard","north>repeater skater"]
        ]},
      {id:"dead-air",name:"Poké Flute Rip",
        waves:[
          ["east>speaker choir","west>feedback repeater","north>runner guard"],
          ["flanks>choir speaker tuningfork","south>thrower guard","north>repeater charger"],
          ["north>repeater repeater feedback","flanks>skater thrower choir"],
          ["south>choir speaker tuningfork","west>repeater guard","east>speaker thrower skater"]
        ],quote:"“Ambatublow!”"},
      {id:"thesis",name:"Thesis Night",
        waves:[
          ["repeater choir feedback","skater speaker thrower"],
          ["speaker tuningfork choir","repeater skater thrower"],
          ["choir feedback repeater","speaker charger choir","guard skater thrower","choir runner"],
          ["flanks>repeater choir speaker","east>tuningfork charger guard","west>choir thrower"]
        ],dispatch:"He clears the request queue. One last take is still marked for export."},
      {id:"bootleg-mix",name:"At The Club",
        waves:[
          ["flanks>repeater choir feedback","north>speaker charger guard"],
          ["south>choir choir tuningfork","north>repeater guard","east>speaker feedback"],
          ["east>repeater repeater feedback","west>choir charger guard","flanks>speaker thrower"],
          ["flanks>choir repeater speaker","north>tuningfork guard choir","south>repeater feedback"],
          ["flanks>choir repeater","north>feedback tuningfork speaker"],
          ["south>tuningfork guard","east>choir repeater feedback"]
        ],quote:"“Take it, take it!”"}
    ]
  },
  {
    id:'studio', name:'Omaygot Edit Suite', type:'Soundstage', accent:'#73f3cf', boss:'Evil Dreamy', symbol:'▣', modifier:'retake',
    map:[[13,33],[34,48],[63,32],[86,49],[57,77]],
    art:'<path d="M7 15h86v67H7zM12 21h75v54H12zM7 15l10-10h73M37 21v54m27-54v54M12 48h75"/><path d="M12 90h12m6 0h12m6 0h12m6 0h12m6 0h12"/>',
    levels:[
      {id:"sleepy",name:"Sleepy Edit",
        waves:[
          ["camerabot runner skater","guard speaker camerabot","charger skater thrower"],
          ["camerabot clapper runner","speaker skater camerabot","charger thrower skater"],
          ["west>camerabot lighting runner","east>charger guard"],
          ["flanks>camerabot clapper charger","south>speaker skater"],
          ["north>camerabot lighting cutout","south>speaker charger","flanks>thrower runner"]
        ]},
      {id:"candid",name:"Candid Talk Pt. 3",
        waves:[
          ["lighting camerabot cutout","camerabot choir thrower","charger guard cutout"],
          ["cutout camerabot clapper","guard speaker camerabot","choir skater thrower"],
          ["east>cutout camerabot lighting","west>guard charger","north>speaker"],
          ["flanks>cutout cutout clapper","south>camerabot choir guard"],
          ["south>choir camerabot lighting","north>charger guard","east>cutout thrower"]
        ]},
      {id:"green-room",name:"Classy Cut",
        waves:[
          ["north>cutout camerabot lighting","south>thrower skater"],
          ["flanks>camerabot speaker clapper","east>cutout guard"],
          ["east>camerabot cutout","west>choir lighting","south>skater guard"],
          ["north>camerabot camerabot clapper","flanks>cutout charger guard"],
          ["west>cutout choir camerabot","east>lighting speaker","north>guard skater"]
        ]},
      {id:"final-cut",name:"Going Insane",
        waves:[
          ["camerabot lighting thrower","cutout speaker camerabot"],
          ["cutout clapper guard","charger camerabot skater"],
          ["camerabot cutout lighting","guard camerabot choir","speaker skater charger","camerabot runner"],
          ["east>camerabot cutout clapper","west>charger thrower choir"],
          ["flanks>cutout camerabot speaker","south>lighting charger","north>choir cutout"]
        ],dispatch:"A red circle marks a blurry chassis. Someone subtitled the clip “Mas Amba.” The export folder reads SUNGUT LELE."},
      {id:"lost-take",name:"Cream Factory",
        waves:[
          ["flanks>camerabot cutout lighting","north>guard speaker choir"],
          ["west>cutout cutout clapper","east>camerabot camerabot charger","south>choir lighting"],
          ["south>camerabot speaker choir","north>lighting cutout guard"],
          ["flanks>camerabot clapper charger","west>choir cutout guard","east>speaker camerabot"],
          ["north>camerabot cutout choir","south>lighting charger cutout","flanks>camerabot skater"],
          ["north>clapper cutout","flanks>lighting camerabot choir"],
          ["east>camerabot lighting","south>clapper charger cutout"]
        ],quote:"“You tappin’ out?”"}
    ]
  },
  {
    id:'core', name:'Ngawi Assembly', type:'Assembly plant', accent:'#8fb9ff', boss:'Ambatron', symbol:'⌬', modifier:'targeting',
    map:[[13,54],[35,33],[62,51],[85,33],[55,78]],
    art:'<path d="M4 64h19l13-14h9V20h14v27h13l15 17h10M9 18h19l8 9v10m-24 50h29l12-13h15l9 13h15M79 11v17l12 10v10"/><circle cx="51" cy="50" r="14"/><circle cx="51" cy="50" r="22"/>',
    levels:[
      {id:"sungut",name:"Sungut Lele",
        waves:[
          ["popup runner guard","camerabot skater firewall","charger popup guard"],
          ["firewall induction popup","charger guard camerabot","skater choir firewall"],
          ["flanks>popup cutter guard","north>firewall charger"],
          ["west>firewall camerabot induction","east>popup choir guard"],
          ["north>popup scout cutter","south>firewall guard","flanks>camerabot skater"]
        ]},
      {id:"red-circle",name:"Terminator Red Circle",
        waves:[
          ["popup firewall cutter","camerabot scout popup","charger choir firewall"],
          ["scout popup induction","firewall camerabot skater","choir popup firewall"],
          ["west>scout popup cutter","east>camerabot charger choir"],
          ["south>firewall firewall induction","north>scout popup guard"],
          ["flanks>scout popup choir","west>firewall cutter","east>camerabot scout"]
        ]},
      {id:"signal-array",name:"Mas Amba Protocol",
        waves:[
          ["north>scout popup cutter","south>charger skater"],
          ["flanks>popup firewall induction","west>camerabot scout"],
          ["south>firewall scout choir","north>popup cutter guard"],
          ["east>popup popup induction","west>scout firewall choir"],
          ["flanks>scout firewall popup","south>camerabot cutter","north>guard choir"]
        ]},
      {id:"third-impact",name:"Level 99",
        waves:[
          ["popup scout cutter","firewall camerabot skater"],
          ["scout choir popup","camerabot induction firewall"],
          ["popup popup cutter","firewall choir scout","charger camerabot firewall","popup skater"],
          ["flanks>firewall popup scout","north>induction skater choir"],
          ["west>scout camerabot popup","east>firewall choir cutter","south>popup charger"]
        ],dispatch:"The fans stop. A progress bar keeps moving. Somewhere below the floor, a backup is almost done."},
      {id:"red-tag",name:"Nut Tree",
        waves:[
          ["west>scout firewall","east>cutter choir camerabot"],
          ["flanks>scout cutter induction","north>guard popup","south>charger choir"],
          ["north>cutter firewall popup","south>charger scout choir"],
          ["east>cutter scout induction","west>camerabot charger","flanks>choir cutter"],
          ["flanks>scout firewall charger","north>camerabot choir","south>cutter popup"],
          ["west>scout induction","east>cutter popup firewall"],
          ["flanks>charger induction","south>scout cutter camerabot"]
        ]}
    ]
  },
  {
    id:'server', name:'The Burnt Server', type:'Unlisted signal', accent:'#ff886f', boss:'Satan’s PC', symbol:'✷', modifier:'firewall',
    map:[[13,36],[35,50],[63,34],[86,45],[55,78]],
    art:'<path d="M4 15h92v66H4zM9 20h82v55H9zM12 31h13l5 8-5 8H12m17 5h16M70 21l-6 23 9 5-7 25M58 42l-9-5m25 13 12-7M19 88h62"/>',
    levels:[
      {id:"hell",name:"I'm Going to Hell",
        waves:[
          ["choir choir popup","firewall skater charger","choir guard popup"],
          ["popup choir firewall","ash choir skater","firewall popup choir"],
          ["north>choir ghost popup","south>firewall skater guard"],
          ["flanks>choir popup firewall","west>ash choir"],
          ["west>backup choir popup","east>firewall ghost guard","south>choir skater"]
        ]},
      {id:"sentience",name:"Gains Sentience",
        waves:[
          ["backup firewall choir","popup ghost charger","firewall choir backup"],
          ["firewall popup ash","choir firewall guard","backup choir firewall","choir skater"],
          ["flanks>backup popup ghost","east>choir charger firewall"],
          ["west>firewall popup backup","east>choir ash charger"],
          ["north>backup choir firewall","south>popup ghost","flanks>choir charger"]
        ]},
      {id:"cold-cache",name:"Fever Dream",
        waves:[
          ["flanks>backup choir popup","north>ghost charger"],
          ["west>firewall ash choir","east>backup popup charger"],
          ["south>choir choir firewall","north>popup ghost"],
          ["east>backup backup ash","west>firewall choir skater"],
          ["flanks>backup popup firewall","north>choir ghost charger","south>popup skater"]
        ]},
      {id:"encore",name:"Rate This PC",
        waves:[
          ["choir firewall backup","popup ghost choir"],
          ["choir backup ash","firewall choir skater"],
          ["firewall backup choir","choir choir ghost","popup firewall guard","choir popup firewall"],
          ["flanks>backup firewall choir","north>popup ash guard"],
          ["east>firewall backup popup","west>choir ghost skater","south>firewall choir"]
        ],dispatch:"The last loop cuts out. Dreamy turns the key in a new door. On the counter, color swatches are laid out for tomorrow."},
      {id:"nutmare-cache",name:"The Nail Theory",
        waves:[
          ["north>backup firewall choir","south>popup ghost firewall"],
          ["flanks>ash choir backup","east>firewall ash","west>ghost skater"],
          ["west>backup firewall","east>choir ash ghost","north>popup guard"],
          ["flanks>firewall ash backup","south>choir charger","north>popup choir"],
          ["north>ash firewall backup","south>popup ghost","flanks>ghost skater ash"],
          ["south>ghost firewall","north>ash backup popup"],
          ["flanks>ghost ash","east>firewall backup choir"]
        ],quote:"“Ambatunut!” · recovered backup"}
    ]
  }
];
