function loadComponent(selector, url) {
    return fetch(url)
        .then(function(response) {
            if (!response.ok) throw new Error('Failed to load ' + url);
            return response.text();
        })
        .then(function(html) {
            var el = document.querySelector(selector);
            if (el) el.innerHTML = html;
        });
}

function setActiveNavLink() {
    var path = window.location.pathname;
    var segment = path.split('/')[1] || '';
    var navKey = (!segment || segment === 'index.html') ? 'home' : segment.replace('.html', '');

    var link = document.querySelector('.nav-links a[data-nav="' + navKey + '"]');
    if (link) link.classList.add('active');
}

var navbarReady = loadComponent('.navbar', '/components/navbar.html').then(setActiveNavLink);
var footerReady = loadComponent('.footer', '/components/footer.html');

document.addEventListener('DOMContentLoaded', function() {

    navbarReady.then(function() {
        var navbar = document.querySelector('.navbar');
        var mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        var navLinks = document.querySelector('.nav-links');

        var lastScrollY = window.scrollY;
        var ticking = false;

        function updateNavbar() {
            var currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = 'none';
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                if (navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                } else {
                    navLinks.style.display = 'flex';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'rgba(10, 10, 10, 0.98)';
                    navLinks.style.padding = '24px';
                    navLinks.style.gap = '16px';
                    navLinks.style.borderTop = '1px solid #2d2d2d';
                    mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                }
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                var targetId = this.getAttribute('href');

                if (targetId === '#') return;

                var targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    if (window.innerWidth <= 768 && navLinks) {
                        navLinks.style.display = 'none';
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }

                    var navHeight = navbar.offsetHeight;
                    var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    });

    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .complexity-card, .swim-card, .philosophy-card, .collab-card').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    var style = document.createElement('style');
    style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    document.querySelectorAll('.project-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 40px rgba(238, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });

    var carousel = document.querySelector('.videos-carousel');
    var prevBtn = document.querySelector('.carousel-btn-prev');
    var nextBtn = document.querySelector('.carousel-btn-next');
    var dotsContainer = document.querySelector('.carousel-dots');
    var videoCards = document.querySelectorAll('.video-card');
    var videoModal = document.getElementById('video-modal');
    var videoIframe = document.getElementById('video-iframe');
    var videoYoutubeLink = document.getElementById('video-youtube-link');
    var modalClose = document.querySelector('.video-modal-close');

    if (carousel && videoCards.length > 0) {
        videoCards.forEach(function(_, index) {
            var dot = document.createElement('button');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to video ' + (index + 1));
            dot.addEventListener('click', function() { scrollToCard(index); });
            dotsContainer.appendChild(dot);
        });

        var dots = document.querySelectorAll('.carousel-dot');

        function scrollToCard(index) {
            var card = videoCards[index];
            if (card) {
                carousel.scrollTo({
                    left: card.offsetLeft - carousel.offsetLeft,
                    behavior: 'smooth'
                });
            }
        }

        function updateDots() {
            var scrollLeft = carousel.scrollLeft;
            var cardWidth = videoCards[0].offsetWidth + 24;
            var activeIndex = Math.round(scrollLeft / cardWidth);

            dots.forEach(function(dot, index) {
                dot.classList.toggle('active', index === activeIndex);
            });

            if (prevBtn) prevBtn.disabled = scrollLeft <= 0;
            if (nextBtn) nextBtn.disabled = scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10;
        }

        carousel.addEventListener('scroll', updateDots);
        updateDots();

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                var cardWidth = videoCards[0].offsetWidth + 24;
                carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                var cardWidth = videoCards[0].offsetWidth + 24;
                carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });
        }

        videoCards.forEach(function(card) {
            card.addEventListener('click', function() {
                var videoId = card.dataset.videoId;
                if (videoId && videoModal) {
                    videoIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
                    videoYoutubeLink.href = 'https://www.youtube.com/watch?v=' + videoId;
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    function closeVideoModal() {
        if (videoModal) {
            videoModal.classList.remove('active');
            videoIframe.src = '';
            document.body.style.overflow = '';
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    document.querySelectorAll('.wiki-video-inline').forEach(function(el) {
        el.addEventListener('click', function() {
            var videoId = el.dataset.videoId;
            if (videoId && videoModal) {
                videoIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
                videoYoutubeLink.href = 'https://www.youtube.com/watch?v=' + videoId;
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    var wikiLinks = document.querySelectorAll('.wiki-nav ul li a');
    var sidebarToggle = document.querySelector('.wiki-sidebar-toggle');
    var wikiSidebar = document.querySelector('.wiki-sidebar');

    if (sidebarToggle && wikiSidebar) {
        sidebarToggle.addEventListener('click', function() {
            wikiSidebar.classList.toggle('open');
            sidebarToggle.innerHTML = wikiSidebar.classList.contains('open')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-list"></i>';
        });

        wikiLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    wikiSidebar.classList.remove('open');
                    sidebarToggle.innerHTML = '<i class="fas fa-list"></i>';
                }
            });
        });
    }
});

(function () {
    var STORAGE_KEY = 'swim-os-preference';

    function getPreference() {
        try { return localStorage.getItem(STORAGE_KEY) || 'unix'; }
        catch (e) { return 'unix'; }
    }

    function setPreference(os) {
        try { localStorage.setItem(STORAGE_KEY, os); } catch (e) {}
    }

    function activateTab(container, os) {
        container.querySelectorAll('.wiki-tab-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === os);
            btn.setAttribute('aria-selected', btn.getAttribute('data-tab') === os);
        });
        container.querySelectorAll('.wiki-tab-panel').forEach(function (panel) {
            panel.classList.toggle('active', panel.getAttribute('data-tab') === os);
        });
    }

    function initTabs() {
        var pref = getPreference();
        document.querySelectorAll('.wiki-code-tabs').forEach(function (tabs) {
            activateTab(tabs, pref);
            tabs.addEventListener('click', function (e) {
                var btn = e.target.closest('.wiki-tab-btn');
                if (!btn) return;
                var os = btn.getAttribute('data-tab');
                setPreference(os);
                document.querySelectorAll('.wiki-code-tabs').forEach(function (t) {
                    activateTab(t, os);
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabs);
    } else {
        initTabs();
    }
})();
