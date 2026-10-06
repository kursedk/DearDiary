// Storage Service for Diary Entries, Drafts, and Stats
(function() {
  function getEntriesKey(userId) {
    return `uedvr_entries_${userId || 'guest'}`;
  }

  function getDraftKey(userId) {
    return `uedvr_draft_${userId || 'guest'}`;
  }

  window.StorageService = {
    // Get all entries for current user
    getEntries(userId) {
      const key = getEntriesKey(userId);
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      try {
        const entries = JSON.parse(raw);
        // Sort reverse chronological (newest first)
        return entries.sort((a, b) => new Date(b.date + 'T' + (b.createdAt || '00:00:00')).getTime() - new Date(a.date + 'T' + (a.createdAt || '00:00:00')).getTime());
      } catch (e) {
        return [];
      }
    },

    getEntryById(userId, id) {
      const entries = this.getEntries(userId);
      return entries.find(e => e.id === id) || null;
    },

    // Save or update an entry
    saveEntry(userId, entryData) {
      const entries = this.getEntries(userId);
      const now = new Date().toISOString();

      let savedEntry;
      if (entryData.id) {
        // Edit existing
        const index = entries.findIndex(e => e.id === entryData.id);
        if (index !== -1) {
          savedEntry = {
            ...entries[index],
            ...entryData,
            images: entryData.images !== undefined ? entryData.images : (entries[index].images || []),
            reminder: entryData.reminder !== undefined ? entryData.reminder : (entries[index].reminder || null),
            updatedAt: now
          };
          entries[index] = savedEntry;
        } else {
          savedEntry = {
            ...entryData,
            images: entryData.images || [],
            reminder: entryData.reminder || null,
            updatedAt: now
          };
          entries.unshift(savedEntry);
        }
      } else {
        // Create new
        savedEntry = {
          id: 'entry_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          title: entryData.title ? entryData.title.trim() : 'Untitled Entry',
          content: entryData.content || '',
          date: entryData.date || new Date().toISOString().split('T')[0],
          mood: entryData.mood || 'Calm',
          tags: entryData.tags || [],
          images: entryData.images || [],
          reminder: entryData.reminder || null,
          createdAt: now,
          updatedAt: now,
          isDemo: false
        };
        entries.unshift(savedEntry);
      }

      localStorage.setItem(getEntriesKey(userId), JSON.stringify(entries));
      this.clearDraft(userId); // Clear draft after successful save
      return savedEntry;
    },

    deleteEntry(userId, id) {
      let entries = this.getEntries(userId);
      entries = entries.filter(e => e.id !== id);
      localStorage.setItem(getEntriesKey(userId), JSON.stringify(entries));
    },

    clearAllEntries(userId) {
      localStorage.removeItem(getEntriesKey(userId));
      this.clearDraft(userId);
    },

    // Reminder Helpers
    getUpcomingReminders(userId) {
      const entries = this.getEntries(userId);
      return entries
        .filter(e => e.reminder && e.reminder.enabled && e.reminder.datetime)
        .sort((a, b) => new Date(a.reminder.datetime).getTime() - new Date(b.reminder.datetime).getTime());
    },

    markReminderNotified(userId, entryId) {
      const entries = this.getEntries(userId);
      const entry = entries.find(e => e.id === entryId);
      if (entry && entry.reminder) {
        entry.reminder.notified = true;
        localStorage.setItem(getEntriesKey(userId), JSON.stringify(entries));
      }
    },

    // Draft Management
    getDraft(userId) {
      const raw = localStorage.getItem(getDraftKey(userId));
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    saveDraft(userId, draftData) {
      if (!draftData || (!draftData.title && !draftData.content && (!draftData.images || draftData.images.length === 0))) {
        this.clearDraft(userId);
        return;
      }
      const draft = {
        ...draftData,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(getDraftKey(userId), JSON.stringify(draft));
    },

    clearDraft(userId) {
      localStorage.removeItem(getDraftKey(userId));
    },

    // Demo Data Management
    loadDemoEntries(userId) {
      const current = this.getEntries(userId);
      const existingDemoIds = new Set(current.map(e => e.id));
      const demoToAdd = window.DEMO_ENTRIES.filter(d => !existingDemoIds.has(d.id));
      
      const updated = [...demoToAdd, ...current];
      localStorage.setItem(getEntriesKey(userId), JSON.stringify(updated));
      return updated;
    },

    clearDemoEntries(userId) {
      let entries = this.getEntries(userId);
      entries = entries.filter(e => !e.isDemo);
      localStorage.setItem(getEntriesKey(userId), JSON.stringify(entries));
      return entries;
    },

    // Calculate writing stats
    getStats(userId) {
      const entries = this.getEntries(userId);
      if (entries.length === 0) {
        return { totalEntries: 0, streak: 0, dominantMood: null, totalImages: 0, totalReminders: 0 };
      }

      // Calculate streak
      const dates = Array.from(new Set(entries.map(e => e.date))).sort().reverse();
      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let checkDate = dates.includes(today) ? today : (dates.includes(yesterday) ? yesterday : null);

      if (checkDate) {
        let curr = new Date(checkDate);
        while (true) {
          const dateStr = curr.toISOString().split('T')[0];
          if (dates.includes(dateStr)) {
            streak++;
            curr.setDate(curr.getDate() - 1);
          } else {
            break;
          }
        }
      }

      // Calculate dominant mood
      const moodCounts = {};
      entries.forEach(e => {
        if (e.mood) {
          moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
        }
      });

      let dominantMood = null;
      let maxCount = 0;
      Object.keys(moodCounts).forEach(m => {
        if (moodCounts[m] > maxCount) {
          maxCount = moodCounts[m];
          dominantMood = m;
        }
      });

      const totalImages = entries.reduce((acc, e) => acc + (e.images ? e.images.length : 0), 0);
      const totalReminders = entries.filter(e => e.reminder && e.reminder.enabled).length;

      return {
        totalEntries: entries.length,
        streak,
        dominantMood,
        totalImages,
        totalReminders
      };
    },

    // Export & Import
    exportJSON(userId) {
      const entries = this.getEntries(userId);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `diary_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    },

    exportMarkdown(userId) {
      const entries = this.getEntries(userId);
      let mdContent = `# My Digital Diary Export\nExported on: ${new Date().toLocaleDateString()}\n\n---\n\n`;

      entries.forEach(e => {
        mdContent += `## ${e.title || 'Untitled'}\n`;
        mdContent += `**Date:** ${e.date} | **Mood:** ${e.mood || 'Unspecified'} | **Tags:** ${e.tags ? e.tags.join(', ') : 'None'}\n\n`;
        mdContent += `${e.content}\n\n---\n\n`;
      });

      const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `diary_export_${new Date().toISOString().split('T')[0]}.md`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };
})();
