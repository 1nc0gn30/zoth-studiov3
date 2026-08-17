/**
 * Magic UI Vanilla Interaction Library
 * Handles spotlight mouse tracking and dynamic meteor rain fields.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Spotlight Tracker
  document.querySelectorAll('.magic-spotlight').forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      elem.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      elem.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // 2. Meteor Generator
  const meteorContainers = document.querySelectorAll('.magic-meteors');
  meteorContainers.forEach((container) => {
    for (let i = 0; i < 14; i++) {
      const meteor = document.createElement('div');
      meteor.className = 'magic-meteor';
      meteor.style.left = `${Math.random() * 100}%`;
      meteor.style.animationDelay = `${Math.random() * 5}s`;
      meteor.style.animationDuration = `${3 + Math.random() * 3}s`;
      container.appendChild(meteor);
    }
  });
});
