// Realistic Sample Diary Entries for Demo State
window.DEMO_ENTRIES = [
  {
    id: 'demo-1',
    title: 'A quiet morning walk and clear thoughts',
    content: `Woke up early around 6:30 AM. The air was crisp, and the sun was just breaking through the morning mist. I went for a 30-minute walk through the neighborhood park without bringing my phone.

It felt incredibly refreshing to listen to the birds and feel present. I've been reflecting on my goals for this quarter. I want to spend more time reading physical books in the evening rather than scrolling.

Key takeaways today:
• Slow down in the morning
• Mindful coffee sipping
• Be present in conversations`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString().split('T')[0], // Yesterday
    mood: 'Calm',
    tags: ['Reflection', 'Morning', 'Mindfulness'],
    images: [
      {
        id: 'img-demo-1',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
        name: 'Morning Park Walk.jpg',
        caption: 'Morning mist breaking through the trees'
      },
      {
        id: 'img-demo-1b',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
        name: 'Morning Coffee.jpg',
        caption: 'Quiet coffee moment'
      }
    ],
    reminder: {
      enabled: true,
      datetime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().slice(0, 16), // In 2 days
      note: 'Revisit morning goals & phone-free walks check-in',
      notified: false
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    isDemo: true
  },
  {
    id: 'demo-2',
    title: 'Completed major project milestone!',
    content: `Finally submitted the design proposal for our team redesign project. After three weeks of prototyping and getting feedback, seeing everything come together felt super satisfying.

Celebrated by grabbing matcha lattes with standard team members. Need to remember to give myself credit for taking breaks when I feel stuck.

Grateful for:
1. Supportive team members
2. Good focus music playlists
3. Getting a solid 8 hours of sleep last night`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString().split('T')[0], // 3 days ago
    mood: 'Happy',
    tags: ['Work', 'Achievement', 'Grateful'],
    images: [
      {
        id: 'img-demo-2',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
        name: 'Team Celebration.jpg',
        caption: 'Matcha latte celebration with the team'
      }
    ],
    reminder: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString(),
    isDemo: true
  },
  {
    id: 'demo-3',
    title: 'Reflections on feeling overwhelmed & stepping back',
    content: `Felt a bit drained after lunch today. Too many context switches between meetings, emails, and active tasks. 

Instead of pushing through with coffee, I tried taking a 15-minute quiet pause and writing out everything on my mind into a simple list. Sorting tasks into 'Urgent' vs 'Can wait till tomorrow' immediately reduced the knot in my stomach.

Reminding myself: It's okay not to finish everything in one day. Focus on quality, not velocity.`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString().split('T')[0], // 5 days ago
    mood: 'Reflective',
    tags: ['Self-Care', 'Reflection', 'Work-Life'],
    images: [],
    reminder: {
      enabled: true,
      datetime: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString().slice(0, 16), // In 5 days
      note: 'Check if workload balance has improved and self-care break habit is holding up',
      notified: false
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    isDemo: true
  },
  {
    id: 'demo-4',
    title: 'Weekend farmers market & new recipe',
    content: `Spent Saturday morning exploring the local farmers market. Bought fresh sourdough, wild honey, and heirloom tomatoes.

In the evening, I cooked roasted garlic pasta from scratch. The kitchen smelled amazing! Cooking has become such a meditative hobby for me lately. I really enjoy the tactile process of prepping ingredients.`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString().split('T')[0], // 7 days ago
    mood: 'Grateful',
    tags: ['Weekend', 'Cooking', 'Hobbies'],
    images: [
      {
        id: 'img-demo-4',
        url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80',
        name: 'Farmers Market Produce.jpg',
        caption: 'Fresh heirloom tomatoes & produce'
      }
    ],
    reminder: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString(),
    isDemo: true
  }
];

window.PRESET_SNAPSHOTS = [
  {
    id: 'preset-1',
    name: 'Morning Park Mist',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'preset-2',
    name: 'Cozy Coffee & Journal',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'preset-3',
    name: 'Team Success High-Five',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'preset-4',
    name: 'Fresh Market Harvest',
    url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'preset-5',
    name: 'Serene Forest Trail',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'preset-6',
    name: 'Golden Evening Sunset',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80',
    thumb: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=300&q=80'
  }
];

window.MOOD_OPTIONS = [
  { id: 'Happy', label: 'Happy', emoji: '😊', color: '#10B981' },
  { id: 'Calm', label: 'Calm', emoji: '🌿', color: '#4A6B5D' },
  { id: 'Grateful', label: 'Grateful', emoji: '✨', color: '#F59E0B' },
  { id: 'Reflective', label: 'Reflective', emoji: '🌧️', color: '#6366F1' },
  { id: 'Energetic', label: 'Energetic', emoji: '⚡', color: '#EC4899' },
  { id: 'Anxious', label: 'Anxious', emoji: '☁️', color: '#6B7280' },
  { id: 'Sad', label: 'Sad', emoji: '💧', color: '#3B82F6' }
];

window.DEFAULT_TAGS = ['Reflection', 'Work', 'Mindfulness', 'Grateful', 'Goals', 'Personal', 'Health'];

