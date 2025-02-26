import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function MoodDetailsScreen() {
  // Dummy data
  const mood = 'Neutral';
  const date = 'Monday';
  const image = 'https://randomuser.me/api/portraits/women/44.jpg'; // Placeholder image
  const note = 'Simply dummy text of the printing and typesetting industry.';

  return (
    <View style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.navButton}>{'◀'}</Text>
        </TouchableOpacity>
        <Text style={styles.dayText}>{date}</Text>
        <TouchableOpacity>
          <Text style={styles.navButton}>{'▶'}</Text>
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      <Image source={{ uri: image }} style={styles.moodImage} />

      {/* Mood & Note Section */}
      <Text style={styles.moodText}>{mood}</Text>
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>{note}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add New Note Button */}
      <TouchableOpacity style={styles.addNoteButton}>
        <Text style={styles.addNoteText}>➕ Add new note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  navButton: { fontSize: 24, fontWeight: 'bold' },
  dayText: { fontSize: 20, fontWeight: '600' },
  moodImage: { width: 120, height: 120, borderRadius: 10, marginVertical: 20 },
  moodText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  noteContainer: { backgroundColor: 'white', padding: 15, borderRadius: 10, width: '90%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  noteText: { fontSize: 14, color: '#555' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  editButton: { backgroundColor: '#A4E57A', padding: 8, borderRadius: 5 },
  deleteButton: { backgroundColor: '#FF6B6B', padding: 8, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  addNoteButton: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  addNoteText: { fontSize: 16, color: '#FFA500', fontWeight: 'bold' },
});
