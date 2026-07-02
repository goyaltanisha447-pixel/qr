/* ==========================================================================
   GLOWRATE - APPLICATION LOGIC & AI REVIEW ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- STATE MANAGEMENT ---
  const state = {
    // Salon settings (from merchant)
    salonName: "Sri Pallavi Family Salon",
    reviewUrl: "https://www.google.com/search?q=sri+pallavi+family+salon&oq=sri+pallavi&gs_lcrp=EgZjaHJvbWUqBggCECMYJzIGCAAQRRg5MgcIARAuGIAEMgYIAhAjGCcyEAgDEC4YrwEYxwEYgAQYjgUyBwgEEAAYgAQyBwgFEAAYgAQyBwgGEAAYgAQyBwgHEAAYgAQyEAgIEC4YrwEYxwEYgAQYjgUyBwgJEAAYgATSAQoyMTU1NmowajE1qAIIsAIB8QVf8OqytM8r8PEFX_DqsrTPK_A&sourceid=chrome&ie=UTF-8#lrd=0x3bcb97b9cf7bfeb3:0x1e54e2707cb15f8c,3,,,,",
    theme: "luxury-gold",
    defaultTone: "excited",
    services: ["haircut", "coloring", "nails", "facials"],
    clientSelectedServices: [], // services chosen by customer on mobile
    
    // Client selection states
    selectedRating: 0,
    selectedTone: "excited",
    selectedTags: [], // stores codes like 'friendly', 'clean', etc.
    aiText: "",
    
    // Active UI view
    isMobileOnlyMode: false
  };

  // --- DYNAMIC DICTIONARY FOR AI GENERATOR ---
  const aiDictionary = {
    // 5 STARS (EXCELLENT)
    5: {
      openings: {
        excited: (salon) => `Oh my gosh, I had the most absolute amazing experience at ${salon}! `,
        professional: (salon) => `My recent appointment at ${salon} was exemplary. `,
        casual: (salon) => `I just checked out ${salon} and had a really wonderful visit. `,
        short: (salon) => `Highly recommend ${salon}! `
      },
      serviceSentences: {
        haircut: {
          excited: "The haircut is perfect and matches my style completely! ",
          professional: "The styling and cut were performed with great skill and attention to detail. ",
          casual: "Got a fresh haircut and it looks great, just what I asked for. ",
          short: "Great haircut. "
        },
        coloring: {
          excited: "My color is absolutely gorgeous, vibrant, and looks so luxurious! ",
          professional: "The hair color selection and application were precise and look incredibly natural. ",
          casual: "Really happy with how my color turned out. It matches perfectly. ",
          short: "Beautiful hair coloring. "
        },
        nails: {
          excited: "My nails are flawless! The shaping and attention to detail is just stunning. ",
          professional: "The nail technician was highly professional, delivering a clean and elegant finish. ",
          casual: "Got my nails done and they look fantastic and clean. ",
          short: "Flawless manicure. "
        },
        facials: {
          excited: "The facial was pure heaven! My skin feels incredibly refreshed, soft, and glowing! ",
          professional: "The aesthetician was knowledgeable, offering a rejuvenating and beneficial facial treatment. ",
          casual: "My skin feels so smooth and healthy after the facial. ",
          short: "Amazing skincare treatment. "
        },
        massage: {
          excited: "The spa massage was absolute bliss! All my tension and stress completely melted away! ",
          professional: "The therapeutic massage was expertly delivered, effectively relieving muscle tension. ",
          casual: "Very relaxing massage. It was exactly what I needed to wind down. ",
          short: "Relaxing massage. "
        },
        makeup: {
          excited: "My makeup looked incredibly stunning, flawless, and lasted perfectly all night! ",
          professional: "The cosmetics application was expertly styled to enhance my features for the occasion. ",
          casual: "Did my makeup here and it turned out beautiful and natural. ",
          short: "Gorgeous makeup. "
        }
      },
      tags: {
        friendly: {
          excited: "The staff here is so sweet, welcoming, and treated me like royalty! ",
          professional: "The staff demonstrated exceptional customer service and hospitality. ",
          casual: "Everyone working there was friendly and very easy to talk to. ",
          short: "Friendly staff. "
        },
        clean: {
          excited: "The entire salon was sparkling clean, pristine, and perfectly organized! ",
          professional: "The establishment maintains impeccable standards of hygiene and cleanliness. ",
          casual: "The place is very neat and clean throughout. ",
          short: "Very clean environment. "
        },
        vibe: {
          excited: "The vibe is so beautiful, relaxing, and felt like a luxury retreat! ",
          professional: "The ambiance is peaceful and fosters a highly relaxing atmosphere. ",
          casual: "Really nice, cozy atmosphere that makes you feel comfortable. ",
          short: "Lovely relaxing vibe. "
        },
        fast: {
          excited: "They were super efficient, fast, and I didn't have to wait a single second! ",
          professional: "Service was prompt, organized, and completed in a timely manner. ",
          casual: "They got me in and out quickly without feeling rushed. ",
          short: "Quick and efficient service. "
        },
        price: {
          excited: "It was worth every single penny for this kind of luxury treatment! ",
          professional: "The quality of work justifies the premium value. ",
          casual: "Fair pricing for such a great quality job. ",
          short: "Worth the price. "
        },
        expert: {
          excited: "The stylists here are absolute experts and know exactly what they are doing! ",
          professional: "The technicians are highly skilled and masters of their craft. ",
          casual: "You can tell the staff is highly skilled and experienced. ",
          short: "Expert technicians. "
        }
      },
      closings: {
        excited: "I am absolutely obsessed and cannot wait to book my next visit! 10/10 recommend!",
        professional: "I highly recommend their services and look forward to returning in the future.",
        casual: "Definitely my new favorite spot. I will be coming back for sure!",
        short: "I'll definitely be back!"
      }
    },

    // 4 STARS (GOOD)
    4: {
      openings: {
        excited: (salon) => `Had a really great experience at ${salon}! `,
        professional: (salon) => `My recent visit to ${salon} was very satisfactory. `,
        casual: (salon) => `Went to ${salon} and had a nice, positive experience. `,
        short: (salon) => `Good experience at ${salon}. `
      },
      serviceSentences: {
        haircut: {
          excited: "Really happy with my haircut and styling! ",
          professional: "The haircut was well-executed and met my expectations. ",
          casual: "Got a haircut and it looks clean and neat. ",
          short: "Good haircut. "
        },
        coloring: {
          excited: "The hair color looks gorgeous and holds up nicely. ",
          professional: "The color application was good and looks very natural. ",
          casual: "Color turned out nice and highlights look good. ",
          short: "Nice hair color. "
        },
        nails: {
          excited: "Nails look super pretty and the technician did a solid job! ",
          professional: "The nail service was clean, neat, and professionally done. ",
          casual: "Pretty happy with how my manicure turned out. ",
          short: "Good nail service. "
        },
        facials: {
          excited: "My skincare treatment felt refreshing and made my skin feel great. ",
          professional: "The facial treatment was relaxing and beneficial to my skin texture. ",
          casual: "Nice relaxing facial, skin feels fresh. ",
          short: "Good facial. "
        },
        massage: {
          excited: "The massage was very soothing and helped ease my sore muscles. ",
          professional: "The massage therapy was effective and very relaxing. ",
          casual: "Had a nice massage that really helped me relax. ",
          short: "Soothing massage. "
        },
        makeup: {
          excited: "Makeup was beautiful and styled nicely to suit my features. ",
          professional: "The makeup artist did a high-quality job fitting my preferences. ",
          casual: "Makeup turned out well and looked very natural. ",
          short: "Good makeup job. "
        }
      },
      tags: {
        friendly: {
          excited: "The staff was very friendly and accommodating! ",
          professional: "The customer service was polite and attentive. ",
          casual: "Everyone was friendly and polite. ",
          short: "Friendly staff. "
        },
        clean: {
          excited: "The salon is very clean and well-kept. ",
          professional: "Cleanliness standards are well maintained. ",
          casual: "The place is clean and neat. ",
          short: "Clean salon. "
        },
        vibe: {
          excited: "The atmosphere was relaxing and comfortable. ",
          professional: "The salon environment is quiet and calm. ",
          casual: "Nice, relaxing environment to unwind in. ",
          short: "Relaxing vibe. "
        },
        fast: {
          excited: "They started my appointment on time and finished promptly. ",
          professional: "Punctuality and scheduling were handled well. ",
          casual: "Hardly any wait time, they were ready for me. ",
          short: "Prompt service. "
        },
        price: {
          excited: "Good quality service for a reasonable price. ",
          professional: "The pricing represents a fair value for the service level. ",
          casual: "Prices are reasonable for the high quality you get. ",
          short: "Good value. "
        },
        expert: {
          excited: "My stylist was very knowledgeable and gave great advice! ",
          professional: "The therapist displayed competent knowledge and technique. ",
          casual: "Stylist was experienced and gave good recommendations. ",
          short: "Skilled stylist. "
        }
      },
      closings: {
        excited: "Will definitely be back and recommend them to others!",
        professional: "I would recommend this salon to others seeking quality service.",
        casual: "Overall a good visit, I'll be coming back.",
        short: "Satisfied customer!"
      }
    },

    // 3 STARS (AVERAGE / NEUTRAL)
    3: {
      openings: {
        excited: (salon) => `My visit to ${salon} was okay. `,
        professional: (salon) => `My experience at ${salon} was average. `,
        casual: (salon) => `Checked out ${salon}. It was an alright experience. `,
        short: (salon) => `Average visit at ${salon}. `
      },
      serviceSentences: {
        haircut: {
          excited: "The haircut is okay, though not exactly what I envisioned. ",
          professional: "The haircut was standard, though some details could be improved. ",
          casual: "Got a haircut, it's decent but nothing special. ",
          short: "Standard haircut. "
        },
        coloring: {
          excited: "The color is fine, but some parts didn't blend perfectly. ",
          professional: "The hair coloring was acceptable, though color consistency could improve. ",
          casual: "Color is okay, just slightly different from what I wanted. ",
          short: "Decent color. "
        },
        nails: {
          excited: "Nails are decent but the polish application was a bit uneven. ",
          professional: "Nail work was average, with slight blemishes in polish distribution. ",
          casual: "Nails are fine, just a simple manicure. ",
          short: "Nails are okay. "
        },
        facials: {
          excited: "The facial was okay, but I've had more refreshing skin treatments elsewhere. ",
          professional: "The skincare session was basic and standard. ",
          casual: "Facial was alright, just a basic cleanse. ",
          short: "Basic facial. "
        },
        massage: {
          excited: "The massage was decent but parts of it felt a bit rushed. ",
          professional: "The massage therapy was adequate, though could be more thorough. ",
          casual: "Massage was okay, helped a little with relaxation. ",
          short: "Decent massage. "
        },
        makeup: {
          excited: "The makeup was okay, but felt a bit heavier than I preferred. ",
          professional: "The cosmetics styling was standard, though customization was limited. ",
          casual: "Makeup was okay, just a standard application. ",
          short: "Basic makeup. "
        }
      },
      tags: {
        wait: {
          excited: "I had to wait about 15-20 minutes past my appointment time. ",
          professional: "There was a delay in starting my scheduled session. ",
          casual: "Appointment started a bit late, which was slightly annoying. ",
          short: "Slight wait time. "
        },
        cleanliness: {
          excited: "The salon could have been slightly cleaner in the styling stations. ",
          professional: "Cleanliness in some common areas could be improved. ",
          casual: "Stations could use a bit more cleaning between clients. ",
          short: "Average cleanliness. "
        },
        expensive: {
          excited: "It felt a bit expensive for the final outcome. ",
          professional: "Pricing is somewhat high for the tier of service provided. ",
          casual: "Thought the pricing was a bit steep for the results. ",
          short: "A bit pricey. "
        },
        rushed: {
          excited: "The service felt a bit rushed towards the end. ",
          professional: "The pacing of the service could be more deliberate. ",
          casual: "Felt like they were hurrying to get to the next customer. ",
          short: "Felt slightly rushed. "
        },
        detail: {
          excited: "I wish the stylist had paid a bit more attention to what I requested. ",
          professional: "A higher level of detail would enhance the overall quality. ",
          casual: "Stylist was nice but missed a couple of details on my hair. ",
          short: "Missed some details. "
        },
        noisy: {
          excited: "The salon was quite loud, making it hard to relax. ",
          professional: "The environment was rather loud, detracting from the spa atmosphere. ",
          casual: "Quite noisy inside, so it wasn't the most relaxing visit. ",
          short: "Somewhat noisy. "
        }
      },
      closings: {
        excited: "Hoping my next visit is a bit better.",
        professional: "Hoping for an improved experience during future visits.",
        casual: "Might give them another try, but not sure yet.",
        short: "Room for improvement."
      }
    },

    // 2 STARS (DISAPPOINTED)
    2: {
      openings: {
        excited: (salon) => `I was unfortunately quite disappointed with my visit to ${salon}. `,
        professional: (salon) => `Regrettably, my experience at ${salon} fell below standards. `,
        casual: (salon) => `Had an unsatisfactory visit to ${salon} recently. `,
        short: (salon) => `Disappointing visit to ${salon}. `
      },
      serviceSentences: {
        haircut: {
          excited: "My haircut was uneven and not what I asked for at all. ",
          professional: "The styling lacked precision, resulting in an uneven trim. ",
          casual: "Haircut didn't turn out well, it looks uneven. ",
          short: "Uneven haircut. "
        },
        coloring: {
          excited: "The color turned out patchy and looks brassy instead of soft. ",
          professional: "The dye application was inconsistent, showing patchy results. ",
          casual: "Color didn't match the swatch and looks blocky. ",
          short: "Patchy hair color. "
        },
        nails: {
          excited: "My nails are already chipping and the cuticles were cut too rough. ",
          professional: "Nail work was poorly finished with early chipping and rough borders. ",
          casual: "Manicure was rough and started peeling after a day. ",
          short: "Poor nail application. "
        },
        facials: {
          excited: "The facial left my skin feeling irritated and broken out. ",
          professional: "The skincare products used caused irritation and redness on my skin. ",
          casual: "Facial was uncomfortable and irritated my sensitive skin. ",
          short: "Skin irritation from facial. "
        },
        massage: {
          excited: "The massage was rough and uncomfortable rather than soothing. ",
          professional: "The massage technique was inconsistent and caused discomfort. ",
          casual: "Massage was way too rough and I left feeling sore. ",
          short: "Uncomfortable massage. "
        },
        makeup: {
          excited: "The makeup was blotchy and didn't match my skin tone. ",
          professional: "The cosmetic product match and blending were subpar. ",
          casual: "Makeup looked cakey and the shade match was off. ",
          short: "Cakey makeup match. "
        }
      },
      tags: {
        wait: {
          excited: "I was left waiting for over 30 minutes despite booking early. ",
          professional: "A significant scheduling delay of 30 minutes occurred. ",
          casual: "Had to wait over half an hour past my appointment. ",
          short: "Long wait time. "
        },
        cleanliness: {
          excited: "The tools and sink area did not look clean at all. ",
          professional: "Hygiene protocols appeared neglected at the work stations. ",
          casual: "Stations and brushes didn't look properly sanitized. ",
          short: "Dirty station setup. "
        },
        expensive: {
          excited: "This was way too expensive for such poor quality work. ",
          professional: "The pricing is disproportionate to the quality of service. ",
          casual: "Definitely not worth what they are charging. ",
          short: "Overpriced. "
        },
        rushed: {
          excited: "They rushed through my service to get to another customer. ",
          professional: "The technician rushed, compromising the service quality. ",
          casual: "Stylist was in a huge rush and didn't take time to do a good job. ",
          short: "Rushed service. "
        },
        detail: {
          excited: "They completely ignored the references I showed. ",
          professional: "Client preferences were disregarded during execution. ",
          casual: "Stylist did whatever they wanted and ignored my photo. ",
          short: "Ignored requests. "
        },
        noisy: {
          excited: "The salon was incredibly loud and chaotic. ",
          professional: "The high noise levels created a stressful atmosphere. ",
          casual: "Felt very chaotic and loud, not relaxing at all. ",
          short: "Loud environment. "
        }
      },
      closings: {
        excited: "I would not recommend this place unless you want to be disappointed.",
        professional: "I hope management addresses these quality issues.",
        casual: "I don't think I will be coming back here again.",
        short: "Disappointing experience."
      }
    },

    // 1 STAR (POOR / ANGRY)
    1: {
      openings: {
        excited: (salon) => `I had an absolutely terrible experience at ${salon} and will never return! `,
        professional: (salon) => `This was an exceptionally poor service experience at ${salon}. `,
        casual: (salon) => `Avoid ${salon}. Had a really awful experience here. `,
        short: (salon) => `Terrible experience at ${salon}. `
      },
      serviceSentences: {
        haircut: {
          excited: "They completely ruined my hair! The haircut looks like an absolute mess. ",
          professional: "The haircut was executed incorrectly, requiring correction elsewhere. ",
          casual: "Totally botched haircut. I have to go to another salon to fix it. ",
          short: "Botched haircut. "
        },
        coloring: {
          excited: "My hair color is fried and the shade is completely wrong and damaged! ",
          professional: "The coloring service resulted in significant chemical damage and incorrect tint. ",
          casual: "Ruined my hair color and left it looking orange and damaged. ",
          short: "Damaged, incorrect color. "
        },
        nails: {
          excited: "Terrible nails, they look messy, crooked, and my cuticles are bleeding! ",
          professional: "Substandard nail application resulting in micro-cuts and uneven shape. ",
          casual: "Nails are crooked, polish is bubbling, and fingers are sore. ",
          short: "Botched manicure. "
        },
        facials: {
          excited: "Severe skin reaction! The facial completely broke my face out in hives! ",
          professional: "The aesthetic treatment caused a severe skin reaction and inflammation. ",
          casual: "My face broke out in painful bumps immediately after this facial. ",
          short: "Severe skin reaction. "
        },
        massage: {
          excited: "The massage was painful and left me with bruises on my back! ",
          professional: "The massage session was painful and resulted in physical bruising. ",
          casual: "Massage was painful and the therapist ignored me when I asked to lighten up. ",
          short: "Painful massage. "
        },
        makeup: {
          excited: "Botched makeup! I looked terrible and had to wash it off immediately! ",
          professional: "The cosmetic work was completely unsuited and poorly applied. ",
          casual: "Looked clownish, had to go home and wash it off. ",
          short: "Awful makeup. "
        }
      },
      tags: {
        wait: {
          excited: "They kept me waiting for an hour and didn't even apologize! ",
          professional: "A wait time exceeding one hour was handled without professional apology. ",
          casual: "Waited an hour for a 15 min trim. Horrible scheduling. ",
          short: "Unacceptable wait. "
        },
        cleanliness: {
          excited: "The salon was dirty, hair was everywhere, and tools looked reused! ",
          professional: "The establishment failed to meet basic sanitary and tool sterilization codes. ",
          casual: "Super unhygienic, brushes had old hair in them. ",
          short: "Unhygienic. "
        },
        expensive: {
          excited: "An absolute rip-off! Charging premium prices for garbage service. ",
          professional: "The exorbitant fees are entirely unjustified given the poor service level. ",
          casual: "Charging a fortune for awful work. Total rip-off. ",
          short: "Rip-off pricing. "
        },
        rushed: {
          excited: "The stylist spent 5 minutes on me and shoved me out the door! ",
          professional: "The appointment was drastically shortened, violating service agreements. ",
          casual: "They rushed my trim in two minutes just to take a walk-in. ",
          short: "Extremely rushed. "
        },
        detail: {
          excited: "They cut my hair way too short despite me begging them not to! ",
          professional: "Specific instruction thresholds were completely ignored. ",
          casual: "stylist did the complete opposite of what I explicitly requested. ",
          short: "Ignored instructions. "
        },
        noisy: {
          excited: "It was a loud, chaotic, and extremely unprofessional environment. ",
          professional: "The environment was chaotic, loud, and lacked basic professional decorum. ",
          casual: "Staff was screaming and gossiping, super unprofessional and loud. ",
          short: "Unprofessional. "
        }
      },
      closings: {
        excited: "Save your money and go somewhere else! You have been warned!",
        professional: "I advise prospective clients to seek services elsewhere.",
        casual: "Stay away from this place. Highly advise going somewhere else.",
        short: "Do not recommend."
      }
    }
  };

  // --- RECONCILE EXPERIENCE HIGHLIGHT TAGS ---
  const activeTagsData = {
    positive: [
      { code: 'friendly', text: '😊 Friendly Staff' },
      { code: 'clean', text: '✨ Sparkling Clean' },
      { code: 'vibe', text: '🌸 Relaxing Vibe' },
      { code: 'fast', text: '⚡ Fast Service' },
      { code: 'price', text: '💎 Great Value' },
      { code: 'expert', text: '✂️ Expert Stylist' }
    ],
    negative: [
      { code: 'wait', text: '⏳ Wait Time' },
      { code: 'cleanliness', text: '🧹 Cleanliness' },
      { code: 'expensive', text: '💸 High Price' },
      { code: 'rushed', text: '🏃 Rushed Service' },
      { code: 'detail', text: '🔍 Lack of Detail' },
      { code: 'noisy', text: '🔊 Loud/Chaotic' }
    ]
  };

  // --- DOM ELEMENTS (MERCHANT DESK) ---
  const elSalonNameInput = document.getElementById('input-salon-name');
  const elReviewUrlInput = document.getElementById('input-review-url');
  const elThemeOptions = document.querySelectorAll('.theme-option');
  const elToneSelect = document.getElementById('select-default-tone');
  const elQrCodeCanvas = document.getElementById('qr-code-canvas');
  const elQrUrlLabel = document.getElementById('lbl-qr-url');
  const elQrBaseInput = document.getElementById('input-qr-base');
  const elDownloadQrBtn = document.getElementById('btn-download-qr');
  const elPrintFlyerBtn = document.getElementById('btn-print-flyer');
  
  // DOM Elements (Flyer Print Layout)
  const elFlyerSalonName = document.getElementById('flyer-salon-name');
  const elFlyerQrImage = document.getElementById('flyer-qr-image');

  // DOM Elements (Simulator Screen)
  const elSimSalonName = document.getElementById('sim-salon-name');
  const elSimStarsContainer = document.getElementById('stars-rating-container');
  const elSimRatingLabel = document.getElementById('lbl-rating-text');
  const elSimAiSection = document.getElementById('sim-ai-section');
  const elSimPrivateSection = document.getElementById('sim-private-feedback-section');
  const elDynamicTagsContainer = document.getElementById('dynamic-tags-container');
  const elClientToneSelector = document.getElementById('client-tone-selector');
  const elAiDraftTextarea = document.getElementById('txt-ai-draft');
  const elTextLengthLabel = document.getElementById('lbl-text-length');
  const elAiStatusLabel = document.getElementById('lbl-ai-status');
  
  // CTA Action Panels
  const elGoogleCtaBox = document.getElementById('google-cta-box');
  const elBtnCopyAndGo = document.getElementById('btn-copy-and-go');
  const elSuccessGoogle = document.getElementById('success-screen-google');
  const elSuccessPrivate = document.getElementById('success-screen-private');
  
  // Success CTAs
  const elLnkGoogleDirect = document.getElementById('lnk-google-direct');
  const elBtnResetGoogle = document.getElementById('btn-reset-simulator-google');
  const elBtnResetPrivate = document.getElementById('btn-reset-simulator-private');
  const elBtnSubmitFeedback = document.getElementById('btn-submit-feedback');

  // Private feedback inputs
  const elFbMessage = document.getElementById('fb-message');
  const elFbName = document.getElementById('fb-name');
  const elFbContact = document.getElementById('fb-contact');

  // Service switches
  const elSvcHaircut = document.getElementById('svc-haircut');
  const elSvcColoring = document.getElementById('svc-coloring');
  const elSvcNails = document.getElementById('svc-nails');
  const elSvcFacials = document.getElementById('svc-facials');
  const elSvcMassage = document.getElementById('svc-massage');
  const elSvcMakeup = document.getElementById('svc-makeup');

  // --- DETECT DEPLOYMENT MODE (Simulator vs Client Mobile Page) ---
  const detectUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('salon_name') || params.has('preview')) {
      // We are in Mobile-Only Client Review Mode!
      state.isMobileOnlyMode = true;
      state.salonName = params.get('salon_name') || "Bella Vita Luxury Spa";
      state.reviewUrl = params.get('review_url') || "https://g.page/r/your-salon-id/review";
      state.theme = params.get('theme') || "luxury-gold";
      state.defaultTone = params.get('tone') || "excited";
      
      const servicesParam = params.get('services');
      if (servicesParam) {
        state.services = servicesParam.split(',');
      } else {
        state.services = ["haircut", "coloring", "nails", "facials"];
      }

      // Hide all merchant desks and header from screen
      document.body.classList.add('mobile-only-layout');
      const header = document.querySelector('.app-header');
      const workspaceMain = document.querySelector('.workspace');
      
      // Rearrange body layout to fit the phone screen directly
      if (header) header.style.display = 'none';
      
      // Inject direct phone layout
      const phoneWrapper = document.querySelector('.phone-wrapper');
      if (phoneWrapper && workspaceMain) {
        // Move phone out of the workspace container to body root for fullscreen mobile vibe
        phoneWrapper.style.margin = "0 auto";
        phoneWrapper.style.boxShadow = "none";
        phoneWrapper.style.border = "none";
        phoneWrapper.style.width = "100%";
        phoneWrapper.style.maxWidth = "480px";
        phoneWrapper.style.height = "100vh";
        phoneWrapper.style.borderRadius = "0px";
        phoneWrapper.style.position = "absolute";
        phoneWrapper.style.top = "0";
        phoneWrapper.style.left = "0";
        phoneWrapper.style.right = "0";
        phoneWrapper.style.bottom = "0";
        
        // Remove simulated device notch speaker overlay
        phoneWrapper.classList.add('notchless');
        
        document.body.innerHTML = '';
        document.body.appendChild(phoneWrapper);
        
        // Fix paddings inside
        const phoneScreen = document.getElementById('simulated-mobile-page');
        if (phoneScreen) {
          phoneScreen.style.padding = "20px 16px";
        }
      }
    }
  };

  // --- INITIALIZE BRANDING / THEMES ---
  const applyTheme = (themeName) => {
    document.body.className = ''; // Reset classes
    document.body.classList.add(`theme-${themeName}`);
    state.theme = themeName;
    
    // Update theme picker UI
    elThemeOptions.forEach(btn => {
      if (btn.getAttribute('data-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  const updateServicesArray = () => {
    const list = [];
    if (elSvcHaircut.checked) list.push("haircut");
    if (elSvcColoring.checked) list.push("coloring");
    if (elSvcNails.checked) list.push("nails");
    if (elSvcFacials.checked) list.push("facials");
    if (elSvcMassage.checked) list.push("massage");
    if (elSvcMakeup.checked) list.push("makeup");
    state.services = list;
    
    // Align clientSelectedServices
    state.clientSelectedServices = state.clientSelectedServices.filter(svc => list.includes(svc));
    renderMobileServices();
    
    // If client preview has rated, regenerate text
    if (state.selectedRating > 0) {
      triggerAiGeneration();
    }
  };

  // --- QR CODE GENERATION ---
  const generateQRCode = () => {
    if (state.isMobileOnlyMode) return; // No QR generation on the phone client

    const salonName = elSalonNameInput.value.trim();
    const reviewUrl = elReviewUrlInput.value.trim();
    const tone = elToneSelect.value;
    
    // Gather checked services
    const servicesCSV = state.services.join(',');

    // Construct preview URL using base input
    let base = elQrBaseInput.value.trim().split('?')[0];
    if (!base) {
      base = `${window.location.origin}${window.location.pathname}`;
    }
    const targetUrl = `${base}?preview=1&salon_name=${encodeURIComponent(salonName)}&review_url=${encodeURIComponent(reviewUrl)}&services=${encodeURIComponent(servicesCSV)}&tone=${tone}&theme=${state.theme}`;
    
    elQrUrlLabel.textContent = targetUrl;

    // Build QR code on canvas
    const qr = new QRious({
      element: elQrCodeCanvas,
      value: targetUrl,
      size: 300,
      background: '#ffffff',
      foreground: '#10141a',
      level: 'H' // High correction
    });

    // Sync to flyer print area
    setTimeout(() => {
      elFlyerQrImage.src = elQrCodeCanvas.toDataURL("image/png");
    }, 100);
  };

  // --- TOAST NOTIFICATIONS ---
  const showToast = (message, isSuccess = true) => {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    toastMsg.textContent = message;
    if (isSuccess) {
      toastIcon.className = "fa-solid fa-circle-check toast-icon";
      toast.style.borderLeftColor = "var(--success-color)";
    } else {
      toastIcon.className = "fa-solid fa-circle-xmark toast-icon";
      toast.style.borderLeftColor = "var(--danger-color)";
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  // --- AI REVIEW GENERATOR LOGIC ---
  const triggerAiGeneration = () => {
    const rating = state.selectedRating;
    if (rating === 0) return;

    elAiStatusLabel.textContent = "AI Writing...";
    elAiStatusLabel.classList.add('typing');
    
    // Simulate AI delay & typewriter
    setTimeout(() => {
      const generatedText = runTextGenerationEngine();
      state.aiText = generatedText;
      if (rating >= 4) {
        typeWriterEffect(generatedText, elAiDraftTextarea);
      } else {
        typeWriterEffect(generatedText, elFbMessage);
      }
    }, 400);
  };

  const runTextGenerationEngine = () => {
    const r = state.selectedRating;
    const tone = state.selectedTone;
    const salon = state.salonName;
    const services = state.clientSelectedServices; // use the client's chosen services
    const tags = state.selectedTags;

    const data = aiDictionary[r];
    if (!data) return "Thank you for rating!";

    // 1. OPENING
    let output = "";
    const openingFunc = data.openings[tone] || data.openings["casual"];
    output += openingFunc(salon);

    // 2. SERVICES SECTION
    // Select matched services that were actually checked
    const matchServices = services.filter(svc => data.serviceSentences[svc]);
    if (matchServices.length > 0) {
      // Pick up to 2 services to make it sound natural (not catalog-like)
      const selectedSvcs = matchServices.slice(0, 2);
      selectedSvcs.forEach(svc => {
        const sentenceObj = data.serviceSentences[svc];
        output += sentenceObj[tone] || sentenceObj["casual"];
      });
    } else {
      // Default general sentence
      if (r >= 4) {
        output += (tone === 'excited') ? "Everything about the treatment was perfect. " : "The services provided were completed to a high standard. ";
      } else {
        output += "The service itself was below what I expected. ";
      }
    }

    // 3. TAG HIGHLIGHTS
    if (tags.length > 0) {
      tags.forEach(tagCode => {
        if (data.tags[tagCode]) {
          const tagSentence = data.tags[tagCode];
          output += tagSentence[tone] || tagSentence["casual"];
        }
      });
    }

    // 4. CLOSING
    const closingText = data.closings[tone] || data.closings["casual"];
    output += closingText;

    return postProcessRandomizer(output);
  };

  // --- DYNAMIC PERMUTATION & SYNONYM GENERATOR ---
  const postProcessRandomizer = (text) => {
    const prefixes = [
      "", 
      "Honestly, ", 
      "Just wanted to say, ", 
      "Review time: ", 
      "So, ",
      "Highly impressed! "
    ];
    const suffixes = [
      "", 
      " 👍", 
      " 😊", 
      " 🌟", 
      "!",
      " Highly recommended.",
      " Will repeat."
    ];

    const synonyms = {
      "amazing": ["amazing", "fantastic", "wonderful", "incredible", "outstanding", "spectacular", "superb"],
      "experience": ["experience", "visit", "time", "appointment", "session"],
      "perfect": ["perfect", "flawless", "spot on", "absolutely perfect", "excellent", "top-tier"],
      "staff": ["staff", "team", "crew", "people", "stylists"],
      "clean": ["clean", "spotless", "hygienic", "pristine", "neat"],
      "vibe": ["vibe", "ambiance", "atmosphere", "environment"],
      "highly recommend": ["highly recommend", "definitely recommend", "recommend 100%", "must recommend"],
      "Highly recommend": ["Highly recommend", "Definitely recommend", "Must visit", "I highly recommend"],
      "coming back": ["coming back", "returning", "visiting again", "going back"],
      "visit": ["visit", "session", "appointment", "time"],
      "wonderful": ["wonderful", "great", "lovely", "splendid"],
      "gorgeous": ["gorgeous", "beautiful", "stunning", "lovely"],
      "relaxing": ["relaxing", "calming", "soothing", "peaceful"],
      "expert": ["expert", "professional", "highly skilled", "masterful"],
      "flawless": ["flawless", "perfect", "impeccable", "spotless"],
      "friendly": ["friendly", "warm", "welcoming", "hospitable", "polite"],
      "professional": ["professional", "polite", "courteous", "expert"]
    };

    let result = text;
    for (const [word, list] of Object.entries(synonyms)) {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      result = result.replace(regex, () => list[Math.floor(Math.random() * list.length)]);
    }

    // Pick random prefix (only 30% chance to insert one to keep natural feel)
    const pref = Math.random() < 0.3 ? prefixes[Math.floor(Math.random() * prefixes.length)] : "";
    
    // Pick random suffix (50% chance)
    const suff = Math.random() < 0.5 ? suffixes[Math.floor(Math.random() * suffixes.length)] : "";

    return pref + result + suff;
  };

  // Realistic character-by-character output
  let typewriterTimeout = null;
  const typeWriterEffect = (text, targetEl = elAiDraftTextarea) => {
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    
    targetEl.value = "";
    let i = 0;
    elAiStatusLabel.textContent = "Writing...";
    elAiStatusLabel.classList.add('typing');
    
    // Increase character step size to complete writing in ~1 second
    const speed = text.length > 150 ? 5 : 10; 
    
    const type = () => {
      if (i < text.length) {
        // Feed 2 characters at a time for faster realistic feel
        targetEl.value += text.slice(i, i + 2);
        i += 2;
        if (targetEl === elAiDraftTextarea) {
          elTextLengthLabel.textContent = `${targetEl.value.length} characters`;
        }
        typewriterTimeout = setTimeout(type, speed);
      } else {
        targetEl.value = text; // safety check to ensure full text
        if (targetEl === elAiDraftTextarea) {
          elTextLengthLabel.textContent = `${text.length} characters`;
          elAiStatusLabel.textContent = "Draft Ready";
        } else {
          elAiStatusLabel.textContent = "Feedback Ready";
        }
        elAiStatusLabel.classList.remove('typing');
      }
    };
    
    type();
  };

  // --- RENDER DYNAMIC TAGS BASED ON STARS ---
  const renderTags = (rating) => {
    elDynamicTagsContainer.innerHTML = '';
    state.selectedTags = []; // Reset selected tags

    let tagsList = [];
    if (rating >= 4) {
      tagsList = activeTagsData.positive;
    } else {
      tagsList = activeTagsData.negative;
    }

    tagsList.forEach(tag => {
      const pill = document.createElement('button');
      pill.className = 'tag-pill';
      pill.setAttribute('data-code', tag.code);
      pill.innerHTML = `${tag.text} <i class="fa-solid fa-plus"></i>`;
      
      pill.addEventListener('click', () => {
        const isActive = pill.classList.toggle('active');
        if (isActive) {
          state.selectedTags.push(tag.code);
          pill.querySelector('i').className = "fa-solid fa-xmark";
        } else {
          state.selectedTags = state.selectedTags.filter(c => c !== tag.code);
          pill.querySelector('i').className = "fa-solid fa-plus";
        }
        // Regenerate review draft
        triggerAiGeneration();
      });

      elDynamicTagsContainer.appendChild(pill);
    });
  };

  // --- MOBILE SCREEN RATING SELECTOR ---
  const selectStarRating = (rating) => {
    state.selectedRating = rating;
    
    // Highlight stars
    const starBtns = elSimStarsContainer.querySelectorAll('.star-btn');
    starBtns.forEach((btn, idx) => {
      const starIcon = btn.querySelector('i');
      if (idx < rating) {
        btn.classList.add('active');
        starIcon.className = "fa-solid fa-star";
      } else {
        btn.classList.remove('active');
        starIcon.className = "fa-regular fa-star";
      }
    });

    // Update Text Label
    const labels = {
      1: "Disastrous (1/5)",
      2: "Disappointed (2/5)",
      3: "Average (3/5)",
      4: "Great Experience (4/5)",
      5: "Perfect! (5/5)"
    };
    elSimRatingLabel.textContent = labels[rating] || "Tap stars to rate";

    // Setup review templates based on rating value
    if (rating >= 4) {
      // Positive Routing (Google review)
      elSimAiSection.style.display = 'block';
      elSimPrivateSection.style.display = 'none';
      
      // Set default selected services (empty by default)
      state.clientSelectedServices = []; 
      renderMobileServices();
      
      renderTags(rating);
      triggerAiGeneration();
    } else {
      // Constructive Routing (Internal feedback Form)
      elSimAiSection.style.display = 'none';
      elSimPrivateSection.style.display = 'block';
      
      state.clientSelectedServices = []; 
      renderMobileServices();
      
      renderTags(rating);
      
      // Clear the private feedback message textarea so customer types it manually
      elFbMessage.value = "";
    }
    
    // Hide success screens if star changes mid-way (or if rating is low)
    if (rating < 4) {
      elSuccessGoogle.style.display = 'none';
      elSuccessPrivate.style.display = 'none';
      elSimStarsContainer.closest('.rating-box').style.display = 'block';
    }
  };

  // --- RENDER MOBILE CLIENT SERVICES ---
  const renderMobileServices = () => {
    const container = document.getElementById('mobile-services-container');
    if (!container) return;
    container.innerHTML = '';
    
    const serviceDetails = {
      haircut: { label: "Haircut & Style", icon: "fa-scissors", code: "haircut" },
      coloring: { label: "Hair Color", icon: "fa-palette", code: "coloring" },
      nails: { label: "Nails & Mani", icon: "fa-hand-sparkles", code: "nails" },
      facials: { label: "Facial Care", icon: "fa-spa", code: "facials" },
      massage: { label: "Massage & Spa", icon: "fa-leaf", code: "massage" },
      makeup: { label: "Makeup & Lashes", icon: "fa-wand-magic-sparkles", code: "makeup" }
    };

    state.services.forEach(svcCode => {
      const details = serviceDetails[svcCode];
      if (!details) return;

      const pill = document.createElement('button');
      pill.className = 'service-pill';
      if (state.clientSelectedServices.includes(svcCode)) {
        pill.classList.add('active');
      }
      
      pill.innerHTML = `
        <span class="pill-icon"><i class="fa-solid ${details.icon}"></i></span>
        <span class="pill-text">${details.label}</span>
      `;

      pill.addEventListener('click', () => {
        const isActive = pill.classList.toggle('active');
        if (isActive) {
          state.clientSelectedServices.push(svcCode);
        } else {
          state.clientSelectedServices = state.clientSelectedServices.filter(c => c !== svcCode);
        }
        triggerAiGeneration();
      });

      container.appendChild(pill);
    });
  };

  // --- ROUTING ACTIONS ---

  // Positive: Copy Text and Launch Google Reviews
  const handleCopyAndPost = () => {
    const draftText = elAiDraftTextarea.value.trim();
    if (!draftText) {
      showToast("Cannot copy empty draft", false);
      return;
    }

    // 1. Attempt clipboard copy
    navigator.clipboard.writeText(draftText)
      .then(() => {
        showToast("Review copied to clipboard!");
        
        // 2. Transition immediately to the success instructions screen
        elSimAiSection.style.display = 'none';
        elSimStarsContainer.closest('.rating-box').style.display = 'none';
        elSuccessGoogle.style.display = 'flex';
        
        const targetGoogleUrl = state.reviewUrl || "https://google.com";
        elLnkGoogleDirect.href = targetGoogleUrl;
        
        // 3. Immediately redirect / open Google reviews in a new window
        window.open(targetGoogleUrl, '_blank');
      })
      .catch(err => {
        console.error('Clipboard copy failed:', err);
        showToast("Failed to copy automatically. Please select text manually.", false);
      });
  };

  // Negative: Submit Internal Feedback
  const handlePrivateSubmit = () => {
    const message = elFbMessage.value.trim();
    if (!message) {
      showToast("Please enter a feedback message", false);
      return;
    }

    // Mock submission loading
    elBtnSubmitFeedback.disabled = true;
    elBtnSubmitFeedback.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;

    setTimeout(() => {
      showToast("Feedback sent privately to Manager!");
      elBtnSubmitFeedback.disabled = false;
      elBtnSubmitFeedback.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Private Feedback`;
      
      // Reset input fields
      elFbMessage.value = '';
      elFbName.value = '';
      elFbContact.value = '';

      // Shift screens
      elSimPrivateSection.style.display = 'none';
      elSimStarsContainer.closest('.rating-box').style.display = 'none';
      elSuccessPrivate.style.display = 'flex';
    }, 1200);
  };

  // Reset flow
  const resetFlow = () => {
    state.selectedRating = 0;
    state.selectedTags = [];
    
    // Clear stars
    const starBtns = elSimStarsContainer.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.querySelector('i').className = "fa-regular fa-star";
    });
    
    elSimRatingLabel.textContent = "Tap stars to rate";
    elSimAiSection.style.display = 'none';
    elSimPrivateSection.style.display = 'none';
    elSuccessGoogle.style.display = 'none';
    elSuccessPrivate.style.display = 'none';
    elSimStarsContainer.closest('.rating-box').style.display = 'block';
  };

  // --- MERCHANT HANDLERS ---
  const handleMerchantSettingsChange = () => {
    const newName = elSalonNameInput.value.trim() || "Bella Vita Luxury Spa";
    const newUrl = elReviewUrlInput.value.trim();
    
    state.salonName = newName;
    state.reviewUrl = newUrl;
    
    // Sync simulated mobile view title
    elSimSalonName.textContent = newName;
    elFlyerSalonName.textContent = newName;

    generateQRCode();
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadQRCodeOnly = () => {
    const dataUrl = elQrCodeCanvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = `${state.salonName.toLowerCase().replace(/\s+/g, '-')}-review-qr.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("QR Code download started!");
  };

  // --- EVENT LISTENERS ---

  // 1. Merchant Controls
  if (!state.isMobileOnlyMode) {
    elSalonNameInput.addEventListener('input', handleMerchantSettingsChange);
    elReviewUrlInput.addEventListener('input', handleMerchantSettingsChange);
    elQrBaseInput.addEventListener('input', generateQRCode);
    
    elThemeOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        applyTheme(theme);
        generateQRCode();
      });
    });

    elToneSelect.addEventListener('change', () => {
      state.defaultTone = elToneSelect.value;
      state.selectedTone = elToneSelect.value;
      
      // Update simulator client selector highlight
      const clientToneBtns = elClientToneSelector.querySelectorAll('.tone-btn');
      clientToneBtns.forEach(btn => {
        if (btn.getAttribute('data-tone') === state.defaultTone) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      generateQRCode();
      if (state.selectedRating > 0) triggerAiGeneration();
    });

    // Checkboxes change
    [elSvcHaircut, elSvcColoring, elSvcNails, elSvcFacials, elSvcMassage, elSvcMakeup].forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        updateServicesArray();
        generateQRCode();
      });
    });

    // Print & Download CTAs
    elPrintFlyerBtn.addEventListener('click', handlePrint);
    elDownloadQrBtn.addEventListener('click', downloadQRCodeOnly);
  }

  // 2. Client Simulator Controls
  const starBtns = elSimStarsContainer.querySelectorAll('.star-btn');
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-value'));
      selectStarRating(val);
    });
  });

  // Client Tone Selector buttons
  const clientToneBtns = elClientToneSelector.querySelectorAll('.tone-btn');
  clientToneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clientToneBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedTone = btn.getAttribute('data-tone');
      triggerAiGeneration();
    });
  });

  // Manual editing textarea
  elAiDraftTextarea.addEventListener('input', () => {
    elTextLengthLabel.textContent = `${elAiDraftTextarea.value.length} characters`;
  });

  // Action flow buttons
  elBtnCopyAndGo.addEventListener('click', handleCopyAndPost);
  elBtnSubmitFeedback.addEventListener('click', handlePrivateSubmit);
  
  elBtnResetGoogle.addEventListener('click', resetFlow);
  elBtnResetPrivate.addEventListener('click', resetFlow);

  // --- INITIALIZE BOOTSTRAP ---
  detectUrlParams();
  applyTheme(state.theme);
  
  if (!state.isMobileOnlyMode) {
    // Initialize QR Base Input value
    if (window.location.origin === 'null' || window.location.protocol === 'file:') {
      elQrBaseInput.value = `http://10.87.10.161:8000/salon-reviews/index.html`;
    } else {
      elQrBaseInput.value = `${window.location.origin}${window.location.pathname}`;
    }

    updateServicesArray();
    generateQRCode();
  } else {
    // If mobile-only mode, set title dynamically based on state
    elSimSalonName.textContent = state.salonName;
    elClientToneSelector.querySelectorAll('.tone-btn').forEach(btn => {
      if (btn.getAttribute('data-tone') === state.defaultTone) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    state.selectedTone = state.defaultTone;
  }
});
