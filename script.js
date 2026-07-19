/**
 * VideoHub - Unified Logic Engine
 * Handles homepage dynamic layouts & dedicated watch page states.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enrich minimal database with titles, categories, creators, ratings, description, and positive feedback percentage at runtime
  const rawDatabase = window.videoDatabase || [];
  const database = rawDatabase.map((video) => {
    // Generate categories and creators deterministically based on ID
    const categories = ['coding', 'coding', 'design', 'space', 'travel', 'design', 'space', 'travel', 'coding', 'design', 'space', 'travel'];
    const category = categories[(video.id - 1) % categories.length] || 'coding';

    const creators = [
      { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', verified: true, subs: '1.2M' },
      { name: 'Devon Lane', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', verified: true, subs: '890K' },
      { name: 'Cody Fisher', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', verified: false, subs: '320K' },
      { name: 'Jane Cooper', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80', verified: true, subs: '2.1M' },
      { name: 'Albert Flores', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80', verified: false, subs: '450K' },
      { name: 'Esther Howard', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80', verified: true, subs: '1.1M' }
    ];
    const creator = creators[(video.id - 1) % creators.length];

    const descriptions = [
      "Learn advanced JavaScript concepts including event loops, closures, tasks execution processes, and dynamic environment lifecycles.",
      "Master the next era of React web design. We will build practical exercises including Server Components, form actions, and async hooks.",
      "Unlock hardware-accelerated layouts, cubic-bezier timing properties, and fluid layout morphing animation secrets.",
      "A stunning cinematic view of a glowing colorful nebula in deep space with stars, planets, and cosmic dust elements.",
      "A dramatic drone view of misty volcanic mountains in Iceland with black sand beaches and winding glacier rivers.",
      "Learn design tokens, spacing scales, typography hierarchies, and dark mode configuration workflows for scalable SaaS layouts.",
      "An intuitive animated explanation of wave functions, observation theory, particle duality, and quantum computing.",
      "Immersive exploration of remote huts, pristine alpine glaciers, and wildflower meadows in Swiss valleys.",
      "Unlock structural safety. Build dynamic interfaces, mapped configurations, and compiler-level type validations.",
      "Master nested auto-layout setups, flex wraps, absolute bounding constraints, and variable padding designs in Figma.",
      "Analyzing infrared spectra, oldest active galaxies in the observable universe, and atmospheric exoplanet signatures.",
      "Explore the peaceful side of Kyoto during its peak autumn colors. Featuring temples, Zen stone gardens, and historic pathways.",
      "Master writing optimized Dockerfiles, multi-stage builders, container volume isolation, networks, and YAML definitions.",
      "Understand runes ($state, $derived, $effect), compiler modifications, bindings shifts, and lightweight virtual-dom free architectures.",
      "Scale CPU-heavy processes inside JavaScript. Use shared array buffers, messaging routines, and core balancing architectures.",
      "A deep dive into transparency, shadows, backdrop blurring effects, and neon lighting to elevate digital dashboard UI aesthetics.",
      "Analyzing modern glyph geometries, color psychology selections, SVG adjustments, and multi-platform visual consistency.",
      "Learn line-height proportions, relative sizing, pairings principles, and readability rules for high-conversion web pages.",
      "Exploring gravitational lensing observations, dark energy dynamics, cosmic microwave background details, and galaxy mapping.",
      "An animated breakdown of general relativity equations, time dilation, Hawking radiation physics, and singular collapses.",
      "Analyzing MOXIE oxygen generation, water ice extraction cycles, radiation shielding configurations, and soil processing setups.",
      "Traversing the Fitz Roy massifs, camping under hanging lakes, and capturing raw drone visuals of active glaciers.",
      "A gorgeous street-level cinematic walk through Shinjuku, Golden Gai, and Akihabara under rainy neon reflections.",
      "A visual guidebook to Positano, Amalfi, and Ravello. Includes transit advice, scenic walking routes, and historic stops.",
      "Unlock memory safety. Learn borrow checker behaviors, ownership scopes, lifetimes specifications, and thread concurrency.",
      "Build robust web architectures. Learn cached API layers, dynamic routing strategies, and streaming suspensions.",
      "Learn monochromatic styles, HSL palette generations, contrast accessibilities, and CSS custom color models.",
      "Learn glass shaders configurations, caustics simulations, transmission indexes, and Cycles engine rendering layouts.",
      "Master stacked captures, spectral noise reduction protocols, and colorful hydrogen-alpha mappings.",
      "A gorgeous exploration of fishing cabins under the Northern Lights and snowy peaks in arctic Norway."
    ];
    const description = descriptions[(video.id - 1) % descriptions.length] || "Access professional guidelines, animation deep-dives, and design masterpieces curated for SaaS teams.";

    const likes = 90 + (video.id % 11); // e.g. 90% - 100% positive feedback
    const rating = parseFloat((4.5 + (video.id % 6) * 0.1).toFixed(1));
    const dates = ["3 days ago", "5 days ago", "1 week ago", "2 weeks ago", "10 days ago", "4 days ago", "1 month ago", "3 weeks ago", "2 days ago", "6 days ago", "1 month ago", "2 months ago"];
    const uploadDate = dates[(video.id - 1) % dates.length];

    // Card short description helper
    const desc = description.split('\n')[0].substring(0, 100) + '...';

    return {
      ...video,
      title: video.title,
      category,
      creator,
      description,
      desc,
      likes,
      rating,
      uploadDate
    };
  });
  
  // ==========================================================================
  // 1. Shared Layout Controls (Header Scrolling, Themes, Back-to-Top)
  // ==========================================================================
  const mainHeader = document.getElementById('mainHeader');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  // Theme Sync
  const setInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  setInitialTheme();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Header and Floating Button Scroll States
  window.addEventListener('scroll', () => {
    if (mainHeader) {
      if (window.scrollY > 40) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Focus Search Shortcut
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Formatting View strings
  const formatViewsStr = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return Math.round(num / 1000) + 'K';
    return num.toString();
  };

  // Helper for generating star icons
  const generateStars = (rating) => {
    let starsHtml = '';
    const rounded = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= rounded) {
        starsHtml += '<i class="fa-solid fa-star star-filled"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }
    return `${starsHtml} <span class="rating-val">${rating} Rating</span>`;
  };

  // ==========================================================================
  // 2. Homepage (index.html) Controllers
  // ==========================================================================
  const videoGrid = document.getElementById('videoGrid');
  if (videoGrid) {
    let filteredVideos = [...database];
    let currentPage = 1;
    const itemsPerPage = 12;
    let activeCategory = 'all';
    let activeSearchQuery = '';

    const categoriesBar = document.getElementById('categoriesBar');
    const resultsCount = document.getElementById('resultsCount');
    const noResultsState = document.getElementById('noResultsState');
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageNumbersContainer = document.getElementById('pageNumbers');

    // Show skeleton loaders during paginations
    const showSkeletons = () => {
      videoGrid.innerHTML = '';
      for (let i = 0; i < itemsPerPage; i++) {
        videoGrid.innerHTML += `
          <div class="skeleton-card">
            <div class="skeleton-thumbnail skeleton-animation"></div>
            <div class="skeleton-body">
              <div class="skeleton-tag skeleton-animation"></div>
              <div class="skeleton-title skeleton-animation"></div>
              <div class="skeleton-text skeleton-animation"></div>
              <div class="skeleton-meta skeleton-animation"></div>
            </div>
          </div>
        `;
      }
    };

    // Card views count visual load
    const animateCardValue = (obj, start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = `<i class="fa-solid fa-eye"></i> ${formatViewsStr(Math.floor(progress * (end - start) + start))} Views`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    // Render Cards in Grid
    const renderVideoCards = (videos) => {
      videoGrid.innerHTML = '';
      if (videos.length === 0) {
        noResultsState.classList.remove('hidden');
        return;
      }
      noResultsState.classList.add('hidden');

      videos.forEach((video) => {
        const slug = window.getVideoSlug(video);
        const card = document.createElement('a');
        card.className = 'video-card';
        card.href = `/video/${slug}`;
        card.setAttribute('data-id', video.id);

        card.innerHTML = `
          <div class="card-thumbnail-wrapper">
            <img src="${video.thumbnail}" alt="${video.title}" class="card-thumbnail" loading="lazy">
            <span class="video-views views-count-el" data-views="${video.views}">
              <i class="fa-solid fa-eye"></i> Calculating views...
            </span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${video.title}</h3>
          </div>
        `;

        videoGrid.appendChild(card);

        // Animate counter views
        const viewsEl = card.querySelector('.views-count-el');
        setTimeout(() => {
          animateCardValue(viewsEl, 0, video.views, 600);
        }, 100);
      });
    };

    // Central Homepage View Dispatcher
    const updateHomepageView = () => {
      showSkeletons();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

      if (resultsCount) {
        resultsCount.textContent = `${filteredVideos.length} Videos`;
      }

      // Title state edits
      const heading = document.getElementById('galleryHeading');
      const subheading = document.getElementById('gallerySubheading');
      if (heading && subheading) {
        if (activeSearchQuery) {
          heading.textContent = `Search Results`;
          subheading.textContent = `Found ${filteredVideos.length} videos matching "${activeSearchQuery}"`;
        } else if (activeCategory !== 'all') {
          heading.textContent = `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Highlights`;
          subheading.textContent = `A curated list of ${filteredVideos.length} ${activeCategory} videos`;
        } else {
          heading.textContent = `Curated Playlist`;
          subheading.textContent = `Showing ${filteredVideos.length} premium handpicked videos`;
        }
      }

      // Render cards with visual delay
      setTimeout(() => {
        renderVideoCards(paginatedVideos);
        renderPagination();
      }, 400);
    };

    // Filter application
    const applyFilters = () => {
      filteredVideos = database.filter((video) => {
        const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
        const searchLower = activeSearchQuery.toLowerCase();
        const matchesSearch = 
          video.title.toLowerCase().includes(searchLower) ||
          video.desc.toLowerCase().includes(searchLower) ||
          video.creator.name.toLowerCase().includes(searchLower);

        return matchesCategory && matchesSearch;
      });
      currentPage = 1;
      updateHomepageView();
    };

    // Cat bar tabs
    if (categoriesBar) {
      categoriesBar.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;
        categoriesBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        activeCategory = e.target.getAttribute('data-category');
        applyFilters();
      });
    }

    // Input text search
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        activeSearchQuery = e.target.value;
        if (activeSearchQuery.length > 0) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
        applyFilters();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        activeSearchQuery = '';
        clearSearchBtn.classList.add('hidden');
        applyFilters();
      });
    }

    if (resetSearchBtn) {
      resetSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        activeSearchQuery = '';
        activeCategory = 'all';
        categoriesBar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        categoriesBar.querySelector('[data-category="all"]').classList.add('active');
        clearSearchBtn.classList.add('hidden');
        applyFilters();
      });
    }

    // Pagination numbers
    const renderPagination = () => {
      const totalPages = Math.ceil(filteredVideos.length / itemsPerPage) || 1;
      const showPrevButton = currentPage > 1;
      const showNextButton = currentPage < totalPages;

      prevPageBtn.classList.toggle('hidden', !showPrevButton);
      nextPageBtn.classList.toggle('hidden', !showNextButton);
      prevPageBtn.disabled = !showPrevButton;
      nextPageBtn.disabled = !showNextButton;

      pageNumbersContainer.innerHTML = '';
      const paginationItems = [];
      const addPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && !paginationItems.includes(pageNumber)) {
          paginationItems.push(pageNumber);
        }
      };
      const addEllipsis = () => {
        if (paginationItems[paginationItems.length - 1] !== 'ellipsis') {
          paginationItems.push('ellipsis');
        }
      };

      if (totalPages <= 4) {
        for (let i = 1; i <= totalPages; i++) {
          addPage(i);
        }
      } else if (currentPage <= 3) {
        addPage(1);
        addPage(2);
        addPage(3);
        addEllipsis();
        addPage(totalPages);
      } else if (currentPage >= totalPages - 2) {
        addPage(1);
        addEllipsis();
        addPage(totalPages - 2);
        addPage(totalPages - 1);
        addPage(totalPages);
      } else {
        addPage(1);
        addEllipsis();
        addPage(currentPage - 1);
        addPage(currentPage);
        addPage(currentPage + 1);
        addEllipsis();
        addPage(totalPages);
      }

      paginationItems.forEach((item) => {
        if (item === 'ellipsis') {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'page-ellipsis';
          ellipsis.textContent = '...';
          pageNumbersContainer.appendChild(ellipsis);
          return;
        }

        const btn = document.createElement('button');
        btn.className = `page-num ${item === currentPage ? 'active' : ''}`;
        btn.textContent = item;
        btn.addEventListener('click', () => {
          if (currentPage === item) return;
          currentPage = item;
          updateHomepageView();
          smoothScrollToGallery();
        });
        pageNumbersContainer.appendChild(btn);
      });
    };

    const smoothScrollToGallery = () => {
      const target = document.getElementById('galleryHeading');
      if (!target) return;
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    };

    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateHomepageView();
        smoothScrollToGallery();
      }
    });

    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        updateHomepageView();
        smoothScrollToGallery();
      }
    });

    // Run homepage load
    updateHomepageView();
  }

  // Support redirecting homepage queries to fill search input automatically
  const checkUrlSearchParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && searchInput && videoGrid) {
      searchInput.value = searchQuery;
      activeSearchQuery = searchQuery;
      clearSearchBtn.classList.remove('hidden');
      applyFilters();
    }
  };
  
  if (videoGrid) {
    checkUrlSearchParameters();
  }
});
