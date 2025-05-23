function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const width = skillBar.style.width;
            skillBar.style.width = '0';
            setTimeout(() => {
                skillBar.style.width = width;
            }, 100);
            observer.unobserve(entry.target);
        }
    });
};

const skillObserver = new IntersectionObserver(animateSkillBars, {
    threshold: 0.5
});

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth' 
            });
            
            // Close mobile menu if open
            const menu = document.querySelector(".menu-links");
            const icon = document.querySelector(".hamburger-icon");
            if (menu.classList.contains('open')) {
                menu.classList.remove('open');
                icon.classList.remove('open');
            }
        }
    });
});


document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formAction = 'https://formsubmit.co/ajax/deepak.rajputt.77@gmail.com';
    
    try {
      const response = await fetch(formAction, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Message sent successfully!');
        // Either:
        // window.location.href = '#contact'; // Scroll back to contact section
        // OR
        e.target.reset(); // Just clear the form
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });