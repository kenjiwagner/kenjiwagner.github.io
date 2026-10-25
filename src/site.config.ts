// Everything personal about the site lives here.
export const site = {
  name: 'Kenji Wagner',
  role: 'AI Engineer · Data Scientist',
  location: 'Tampa, FL',
  intro:
    'I build AI agents, analytics pipelines, and machine-learning models that turn messy business data into answers people can act on.',
  email: 'kenjiw@umich.edu',
  linkedin: 'https://www.linkedin.com/in/kenji-wagner-42b433270',
  resumePdf: '/Kenji_Wagner_Resume.pdf',

  github: {
    // Accounts whose repos are pulled in. Add 'kwarrenwagner' here if you
    // ever want the BU repos to show without copying them over.
    users: ['kenjiwagner'],
    // A repo appears on the site only when it has this topic on GitHub.
    topic: 'portfolio',
  },
};

export const githubProfileUrl = `https://github.com/${site.github.users[0]}`;
