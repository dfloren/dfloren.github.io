const links = Array.from(document.querySelectorAll('.nav-links a'));
const sections = Array.from(document.querySelectorAll('main section'));
const linkMap = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));

function setActive(id) {
  links.forEach(link => link.classList.remove('active'));
  if (linkMap.has(id)) {
    linkMap.get(id).classList.add('active');
  }
}

// Smooth scroll on click
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
      setActive(id);
    }
  });
});

// IntersectionObserver for accurate active section detection
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActive(entry.target.id);
    }
  });
}, {
  root: document.querySelector('#content'),
  threshold: 0.6
});

sections.forEach(section => observer.observe(section));
