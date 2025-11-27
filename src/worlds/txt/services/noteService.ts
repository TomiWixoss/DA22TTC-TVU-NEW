import { ref, onValue, push, set, remove } from "firebase/database";
import { getDatabaseInstance } from "@/shared/lib/firebaseConfig";

export interface Note {
  id: string;
  content: string;
  timestamp: number;
}

export const noteService = {
  // Subscribe to notes (realtime)
  subscribeToNotes(callback: (notes: Note[]) => void): () => void {
    let unsubscribe: () => void = () => {};

    getDatabaseInstance().then((database) => {
      const notesRef = ref(database, "notes");
      unsubscribe = onValue(notesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const notesList = Object.entries(data).map(
            ([id, note]: [string, any]) => ({
              id,
              content: note.content,
              timestamp: note.timestamp,
            })
          );
          notesList.sort((a, b) => b.timestamp - a.timestamp);
          callback(notesList);
        } else {
          callback([]);
        }
      });
    });

    return () => unsubscribe();
  },

  // Thêm note mới
  async addNote(content: string): Promise<void> {
    const database = await getDatabaseInstance();
    const notesRef = ref(database, "notes");
    const newNoteRef = push(notesRef);
    await set(newNoteRef, {
      content,
      timestamp: Date.now(),
    });
  },

  // Xóa note
  async deleteNote(id: string): Promise<void> {
    const database = await getDatabaseInstance();
    const noteRef = ref(database, `notes/${id}`);
    await remove(noteRef);
  },
};
