// Global variables - Updated: 2025-12-15 18:15
let projectsData = {};
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.modal-close');

// Auto-scroll functionality for projects
function initAutoScroll(scrollContainer) {
    let scrollSpeed = 1; // pixels per frame
    let scrollDirection = 1; // 1 for right, -1 for left
    let isUserScrolling = false;
    let userScrollTimeout;
    let animationId;

    function autoScroll() {
        if (!isUserScrolling) {
            scrollContainer.scrollLeft += scrollSpeed * scrollDirection;

            // Check if we've reached the end
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

            if (scrollContainer.scrollLeft >= maxScroll) {
                // Reached the end, scroll back to start smoothly
                scrollContainer.scrollLeft = 0;
            }
        }

        animationId = requestAnimationFrame(autoScroll);
    }

    // Detect user scrolling
    scrollContainer.addEventListener('scroll', () => {
        isUserScrolling = true;
        clearTimeout(userScrollTimeout);

        // Resume auto-scroll after 3 seconds of no user interaction
        userScrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 3000);
    });

    // Pause on hover
    scrollContainer.addEventListener('mouseenter', () => {
        isUserScrolling = true;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        clearTimeout(userScrollTimeout);
        userScrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 1000);
    });

    // Start auto-scroll
    autoScroll();
}

// Load projects from JSON
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const data = await response.json();

        // Store projects in a map for easy access
        data.projects.forEach(project => {
            projectsData[project.id] = project;
        });

        // Render projects to the page
        renderProjects(data.projects);

        // Add click events to project cards
        addProjectClickEvents();

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Render projects to the grid
function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');

    // Separate featured and other projects
    const featuredProjects = projects.filter(p => p.featured);
    const otherProjects = projects.filter(p => !p.featured);

    // Create featured project section
    if (featuredProjects.length > 0) {
        const featuredSection = document.createElement('div');
        featuredSection.className = 'featured-project';
        featuredProjects.forEach(project => {
            const card = createProjectCard(project);
            featuredSection.appendChild(card);
        });
        grid.appendChild(featuredSection);
    }

    // Create other projects section with horizontal scroll
    if (otherProjects.length > 0) {
        const otherSection = document.createElement('div');
        otherSection.className = 'other-projects';

        const title = document.createElement('h3');
        title.textContent = 'Main Projects';
        otherSection.appendChild(title);

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'projects-scroll';

        otherProjects.forEach(project => {
            const card = createProjectCard(project);
            scrollContainer.appendChild(card);
        });

        otherSection.appendChild(scrollContainer);
        grid.appendChild(otherSection);

        // Initialize auto-scroll
        initAutoScroll(scrollContainer);
    }
}

// Create a project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = `project-card${project.featured ? ' featured' : ''}`;
    card.setAttribute('data-project', project.id);

    // Build features HTML if available
    let featuresHTML = '';
    if (project.features) {
        featuresHTML = `
            <div class="project-features">
                ${project.features.map(feature => `
                    <div class="feature">
                        <span class="feature-icon">${feature.icon}</span>
                        <span>${feature.text}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Build tech tags HTML
    const techHTML = `
        <div class="project-tech">
            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
    `;

    // Build button HTML - always use View Details for non-featured, Learn More for featured
    const buttonHTML = `
        <button class="btn btn-project" onclick="window.location.href='project-template.html?id=${project.id}'">
            ${project.featured ? 'Learn More' : 'View Details'}
        </button>
    `;

    // Build the card HTML
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title} App Screenshot">
            ${project.featured ? `
                <div class="project-overlay">
                    <span class="project-badge">Featured</span>
                </div>
            ` : ''}
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            ${project.tagline ? `<p class="project-tagline">${project.tagline}</p>` : ''}
            <p class="project-description">${project.description}</p>
            ${featuresHTML}
            ${techHTML}
            ${buttonHTML}
        </div>
    `;

    return card;
}

// Generate modal content from project data
function generateModalContent(project) {
    const fullDesc = project.fullDescription;

    let html = `
        <h2>${project.title} - ${project.tagline}</h2>
        <p>${fullDesc.intro}</p>
    `;

    // Add key features
    if (fullDesc.keyFeatures) {
        html += `<h3>Key Features</h3>`;
        fullDesc.keyFeatures.forEach(feature => {
            html += `
                <div class="modal-feature">
                    <h4>${feature.title}</h4>
                    <p>${feature.description}</p>
                </div>
            `;
        });
    }

    // Add pricing (if available)
    if (fullDesc.pricing) {
        html += `
            <h3>Pricing</h3>
            <div class="pricing-box">
                <h4>${fullDesc.pricing.price}</h4>
                <ul>
                    ${fullDesc.pricing.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Add "Perfect For" section (if available)
    if (fullDesc.perfectFor) {
        html += `
            <h3>Perfect For</h3>
            <ul>
                ${fullDesc.perfectFor.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }

    // Add technical specifications
    if (fullDesc.technicalSpecs) {
        html += `
            <h3>Technical Specifications</h3>
            <ul>
                ${fullDesc.technicalSpecs.map(spec => `<li>${spec}</li>`).join('')}
            </ul>
        `;
    }

    // Add quote (if available)
    if (fullDesc.quote) {
        html += `
            <h3>Why Developers Love ${project.title}</h3>
            <blockquote>${fullDesc.quote}</blockquote>
        `;
    }

    // Add getting started (if available)
    if (fullDesc.gettingStarted) {
        html += `
            <h3>Getting Started</h3>
            <ol>
                ${fullDesc.gettingStarted.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;
    }

    return html;
}

// Open project modal
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-tech-tags">
                ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="modal-body">
            ${generateModalContent(project)}
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add click events to project cards
function addProjectClickEvents() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function (e) {
            // Don't navigate if clicking on a button
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            const projectId = this.getAttribute('data-project');
            if (projectId) {
                window.location.href = `project-template.html?id=${projectId}`;
            }
        });
    });
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // For contact section, scroll to bottom of page
            if (this.getAttribute('href') === '#contact') {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(26, 15, 15, 0.98)';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(26, 15, 15, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// Modal close events
if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
}

window.addEventListener('click', (e) => {
    if (modal && e.target === modal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        closeProjectModal();
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all project cards and sections after they're loaded
function setupAnimations() {
    const elements = document.querySelectorAll('.project-card, .contact-card, .skill-category');

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add active state to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < 600) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / 600);
    }
});

// Add ripple effect to buttons
document.addEventListener('click', function (e) {
    const target = e.target.closest('.btn, .project-card');
    if (!target) return;

    const ripple = document.createElement('span');
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    target.style.position = 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});

// Add CSS for ripple effect and modal styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    .modal-header {
        margin-bottom: 24px;
    }

    .modal-tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .modal-body h2 {
        font-size: 32px;
        margin-bottom: 16px;
        background: linear-gradient(135deg, var(--primary-orange), #D95F3F);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .modal-body h3 {
        font-size: 24px;
        margin-top: 32px;
        margin-bottom: 16px;
        color: var(--primary-orange);
    }

    .modal-body h4 {
        font-size: 18px;
        margin-top: 16px;
        margin-bottom: 8px;
        color: var(--primary-orange);
    }

    .modal-body p, .modal-body li {
        color: var(--text-secondary);
        line-height: 1.8;
        margin-bottom: 12px;
    }

    .modal-body ul, .modal-body ol {
        padding-left: 24px;
        margin-bottom: 16px;
    }

    .modal-body ul li::marker {
        color: var(--primary-orange);
    }

    .modal-feature {
        background: rgba(232, 116, 81, 0.05);
        border-left: 3px solid var(--primary-orange);
        padding: 16px;
        margin: 16px 0;
        border-radius: 8px;
    }

    .modal-feature h4 {
        margin-top: 0;
    }

    .pricing-box {
        background: var(--dark-bg);
        border: 2px solid var(--primary-orange);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
    }

    .pricing-box h4 {
        font-size: 36px;
        color: var(--primary-orange);
        margin: 0 0 16px 0;
    }

    .pricing-box ul {
        list-style: none;
        padding: 0;
    }

    .pricing-box li {
        padding: 8px 0;
        color: var(--text-primary);
    }

    blockquote {
        border-left: 4px solid var(--primary-orange);
        padding: 16px 24px;
        margin: 24px 0;
        background: rgba(232, 116, 81, 0.05);
        font-style: italic;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    setupAnimations();
    console.log('Portfolio website loaded successfully! 🚀');
});
