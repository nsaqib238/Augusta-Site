// Populate country dropdown from config
function populateCountryDropdown() {
    const select = document.getElementById('countrySelect');
    if (!select) {
        console.warn('Country select dropdown not found');
        return;
    }
    
    if (typeof COUNTRY_URLS === 'undefined') {
        console.error('COUNTRY_URLS is not defined. Make sure country-config.js is loaded.');
        // Fallback: show all countries as disabled
        const fallbackCountries = [
            "Algeria", "Angola", "Argentina", "Australia", "Austria", "Bahrain", "Bangladesh",
            "Belgium", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brunei", "Bulgaria",
            "Cambodia", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Côte d'Ivoire",
            "Croatia", "Cyprus", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador",
            "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Germany",
            "Ghana", "Greece", "Guatemala", "Hong Kong", "Honduras", "Hungary", "Iceland",
            "India", "Indonesia", "Iran", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
            "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania",
            "Luxembourg", "Malaysia", "Mexico", "Mongolia", "Morocco", "Myanmar", "Namibia",
            "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman", "Pakistan",
            "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
            "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia",
            "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
            "Taiwan", "Tanzania", "Thailand", "Trinidad & Tobago", "Tunisia", "Turkey",
            "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Vietnam"
        ];
        fallbackCountries.sort().forEach(function(country) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = country;
            option.disabled = true;
            select.appendChild(option);
        });
        return;
    }
    
    // Clear existing options except the first one
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Sort countries alphabetically
    const sortedCountries = Object.keys(COUNTRY_URLS).sort();
    
    // Add each country as an option
    sortedCountries.forEach(function(country) {
        const url = COUNTRY_URLS[country];
        const option = document.createElement('option');
        option.value = url || '';
        option.textContent = country;
        
        // Disable if no URL is provided
        if (!url || url.trim() === '') {
            option.disabled = true;
        }
        
        select.appendChild(option);
    });
}

// Initialize country dropdown - try multiple times to ensure it loads
function initCountryDropdown() {
    // Try immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        populateCountryDropdown();
    }
    
    // Also try when DOM is ready
    if (typeof $ !== 'undefined') {
        $(document).ready(function() {
            populateCountryDropdown();
        });
    } else {
        document.addEventListener('DOMContentLoaded', populateCountryDropdown);
    }
    
    // Fallback: try after a short delay
    setTimeout(populateCountryDropdown, 500);
}

function attachCountrySelectRedirect() {
    var select = document.getElementById('countrySelect');
    if (!select) return;

    select.addEventListener('change', function () {
        var url = (select.value || '').trim();
        if (!url) return;
        window.location.href = url;
    });
}

// Smooth scrolling for navigation links
$(document).ready(function() {
    // Populate country dropdown
    populateCountryDropdown();
    attachCountrySelectRedirect();
    
    // Smooth scroll
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 1000);
                return false;
            }
        }
    });

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Contact form submission
    $('.contact-form').submit(function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Close mobile menu when clicking on a link
    $('.navbar-nav a').click(function() {
        $('.navbar-collapse').collapse('hide');
    });
});

// Starfield twinkle overlay for any .starfield-canvas
(function () {
    var instances = [];

    function createInstance(canvas) {
        var parent = canvas.parentElement || document.body;
        var ctx = canvas.getContext('2d');
        var stars = [];
        var dpr = Math.max(window.devicePixelRatio || 1, 1);

        function resize() {
            var rect = parent.getBoundingClientRect();
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            generateStars();
        }

        function generateStars() {
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
            var density = Math.round((width * height) / 5000);
            stars = [];
            for (var i = 0; i < density; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 2.0 + 0.6,
                    a: Math.random() * 0.8 + 0.2,
                    da: (Math.random() * 0.8 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
                    s: Math.random() * 0.8 + 0.4,
                    vx: (Math.random() - 0.5) * 0.08,
                    vy: (Math.random() - 0.5) * 0.08
                });
            }
        }

        function draw() {
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
            ctx.clearRect(0, 0, width, height);
            for (var i = 0; i < stars.length; i++) {
                var star = stars[i];
                star.a += (star.da * star.s) * 0.05;
                if (star.a <= 0.15 || star.a >= 1) star.da *= -1;
                star.x += star.vx;
                star.y += star.vy;
                if (star.x < 0) star.x = width;
                if (star.x > width) star.x = 0;
                if (star.y < 0) star.y = height;
                if (star.y > height) star.y = 0;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,' + star.a.toFixed(3) + ')';
                ctx.fill();
            }
            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        resize();
        requestAnimationFrame(draw);
    }

    var canvases = document.querySelectorAll('.starfield-canvas');
    for (var i = 0; i < canvases.length; i++) {
        createInstance(canvases[i]);
    }
})();

// Initialize country dropdown when page loads
initCountryDropdown();